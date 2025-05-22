# PDF Styling Fix for Linux Environment

The PDF styling issues have been addressed with the following changes:

## 1. Template Changes

- Replaced external CSS with inline styles in the HTML template
- Removed Windows-specific file paths for images and CSS
- Added a placeholder for the student image instead of using a file path
- Added a centered heading for the report

## 2. Dashboard Generation

- Updated the dashboard generation code to use a non-interactive Matplotlib backend
- Ensured the chart is properly embedded in the PDF

## 3. Directory Structure

- Created the templates/images directory to store any images you might want to add

## How to Test

1. Generate a PDF report for a student:
   ```python
   from reports.generate_pdf import generate_pdf_report
   
   # Generate report for a single student
   pdf_path = generate_pdf_report(["23A95A6102"], includeCharts=True)
   print(f"PDF generated at: {pdf_path}")
   ```

2. Open the generated PDF to verify that styles are applied correctly

## Additional Customization

If you want to add a header image or student photos:

1. Place your images in the `templates/images` directory
2. Update the HTML template to reference these images with relative paths:
   ```html
   <img src="templates/images/your_image.png" alt="Description">
   ```

## Troubleshooting

If you still encounter styling issues:
- Make sure Playwright is properly installed with `playwright install chromium`
- Check that the HTML template is being properly loaded and processed
- Verify that the PDF generation process has access to the necessary directories