# Use a multi-stage build for smaller final image
FROM python:3.10-slim AS backend-builder

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    ghostscript \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install Playwright browsers
RUN pip install playwright && \
    playwright install chromium && \
    playwright install-deps chromium

# Second stage for Node.js frontend build
FROM node:20-slim AS frontend-builder

WORKDIR /app/frontend

# Copy frontend source
COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# Final stage
FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    ghostscript \
    && rm -rf /var/lib/apt/lists/*

# Copy Python dependencies from builder
COPY --from=backend-builder /usr/local/lib/python3.10/site-packages /usr/local/lib/python3.10/site-packages
COPY --from=backend-builder /usr/local/bin /usr/local/bin

# Copy Playwright browsers
COPY --from=backend-builder /ms-playwright /ms-playwright

# Copy built frontend
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

# Copy application code
COPY database/ /app/database/
COPY reports/ /app/reports/
COPY templates/ /app/templates/
COPY utils/ /app/utils/
COPY app.py /app/

# Create directories for output and images
RUN mkdir -p /app/output /app/templates/images

# Create a sample header image if it doesn't exist
RUN touch /app/templates/images/header.png
RUN touch /app/templates/images/sample_image.png

# Create .env file with default values that can be overridden
RUN echo "host=db\nuser=root\npassword=password\ndatabase=StudentReportingDB" > /app/.env

# Expose port
EXPOSE 5000

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV FLASK_APP=app.py

# Command to run the application
CMD ["python", "-m", "flask", "run", "--host=0.0.0.0"]