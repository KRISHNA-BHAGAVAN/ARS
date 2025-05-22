# Student Photo in PDF Reports

This feature adds student photos to the PDF reports in all template styles.

## Implementation Details

- Student photos are now displayed in the top-right section of the report
- The photo is sized at 160px × 198px and maintains aspect ratio
- Each template style has appropriate styling for the photo (borders, shadows, etc.)

## Current Implementation

Currently, the student photo is static and uses the file at:
```
/home/lucky/ARS/baggi/v3/templates/images/sample_image.png
```

## Future Enhancements

To implement dynamic student photos, you could:

1. Add a photo field to the Students table in the database
2. Store photos in a dedicated directory with filenames matching student IDs
3. Update the PDF generation code to use the appropriate photo for each student

Example implementation:

```python
# In generate_pdf_with_styles.py

def generate_html(student, records, summaries=None, includeCharts=False, template_style="classic"):
    # ... existing code ...
    
    # Get student photo path
    reg_no = student["registered_no"]
    photo_path = f"/home/lucky/ARS/baggi/v3/templates/images/students/{reg_no}.jpg"
    
    # Use default photo if student photo doesn't exist
    if not os.path.exists(photo_path):
        photo_path = "/home/lucky/ARS/baggi/v3/templates/images/default_student.png"
    
    # ... existing code ...
    
    # Replace photo path in HTML
    html_content = html_content.replace("{{STUDENT_PHOTO_PATH}}", photo_path)
    
    # ... existing code ...
```

## Testing

To test the current implementation with the static photo:

```bash
./test_pdf_with_photo.py
```

This will generate PDFs in all three styles with the student photo included.