# PDF Template Styles

This feature allows you to generate PDF reports with different visual styles.

## Available Styles

1. **Classic Style**
   - Traditional academic look
   - Times New Roman font
   - Simple borders and subtle backgrounds
   - Formal presentation

2. **Modern Style**
   - Contemporary design with gradients
   - Arial font
   - Rounded corners and shadows
   - Color accents and hover effects

3. **Minimal Style**
   - Clean, minimalist design
   - Helvetica font
   - Light borders and minimal decoration
   - Focus on content with maximum readability

## How to Use

### From the UI

1. When generating an individual report:
   - Click "Generate Report" for a student
   - Select your preferred template style from the dialog
   - Choose whether to include charts
   - Click "Preview" or "Download"

2. When generating bulk reports:
   - Select multiple students
   - Click "Generate Report for Selected Students"
   - Choose "PDF" as the report type
   - Select your preferred template style
   - Choose whether to include charts
   - Click "Generate"

### From the API

You can specify the template style when calling the API endpoints:

```
GET /api/reports/individual/{reg_no}?includeCharts=true&templateStyle=modern
```

Valid template style values:
- `classic` (default)
- `modern`
- `minimal`

## Customizing Templates

You can modify the template HTML files to further customize the styles:

- `templates/pdf_classic.html`
- `templates/pdf_modern.html`
- `templates/pdf_minimal.html`

## Header Image

Replace the placeholder image at `templates/images/header.png` with your institution's logo or header image.

Recommended dimensions: 700px × 100px