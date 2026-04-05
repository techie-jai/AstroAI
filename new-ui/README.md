# AstroAI New UI - Chart Generator

A simple, clean PyQt6 application for generating all divisional charts (D1-D60) from birth data.

## Features

- **Simple Form Interface**: Easy-to-use form for entering birth details
- **Auto-complete**: Place name autocomplete with automatic coordinate filling
- **All 20 Charts**: Generates all divisional charts (D1, D2, D3, D4, D5, D6, D7, D8, D9, D10, D11, D12, D16, D20, D24, D27, D30, D40, D45, D60)
- **Multiple Formats**: Saves charts as JSON, text, and PNG images
- **Organized Storage**: Creates user-specific folders with structured file organization
- **Progress Tracking**: Real-time progress bar and status updates
- **Error Handling**: Comprehensive validation and error messages

## Installation

### Prerequisites

Make sure you have Python 3.8+ installed.

### Install Dependencies

```bash
cd new-ui
pip install -r requirements.txt
```

## Usage

### Running the Application

```bash
python main.py
```

Or from the parent directory:

```bash
python new-ui/main.py
```

### Using the Interface

1. **Enter Personal Information**
   - Name (required)
   - Gender (optional)

2. **Enter Birth Details**
   - Date of Birth (use calendar picker)
   - Time of Birth (use time picker)

3. **Enter Location**
   - Start typing place name - autocomplete will suggest cities
   - Selecting a place auto-fills latitude, longitude, and timezone
   - You can manually adjust coordinates if needed

4. **Generate Charts**
   - Click "Generate All Charts" button
   - Watch progress bar for status
   - Charts are saved automatically

5. **View Results**
   - Success dialog shows folder location
   - Click "Open Folder" to view generated files

## Output Structure

Charts are saved in the following structure:

```
users/
└── {uniqueId}-{name}/
    ├── user_info.json          # Birth data and metadata
    ├── charts_summary.txt      # Summary of all charts
    ├── charts/
    │   ├── json/               # JSON chart data (20 files)
    │   │   ├── D1.json
    │   │   ├── D2.json
    │   │   └── ... (D3-D60)
    │   ├── text/               # Human-readable text (20 files)
    │   │   ├── D1.txt
    │   │   ├── D2.txt
    │   │   └── ... (D3-D60)
    │   └── images/             # Visual charts (20 files)
    │       ├── D1.png
    │       ├── D2.png
    │       └── ... (D3-D60)
```

## File Formats

### JSON Files
- Complete chart data in structured JSON format
- Includes planet positions, houses, ascendant
- Easy to parse for AI/programmatic analysis

### Text Files
- Human-readable formatted text
- Shows chart name, signification, planet positions
- Organized by houses

### Image Files
- PNG images with chart visualization
- Text-based representation with planet positions
- Includes birth data and chart title

## Architecture

### Components

- **main.py**: Application entry point and controller
- **ui_components.py**: PyQt6 UI widgets and layout
- **chart_generator.py**: Chart generation using AstroChartAPI
- **file_manager.py**: File operations and folder management

### Data Flow

1. User enters data in UI
2. UI validates input and enables Generate button
3. On Generate click, data is passed to ChartGenerator
4. ChartGenerator uses AstroChartAPI to calculate charts
5. Each chart is saved by FileManager in multiple formats
6. Progress updates are sent back to UI
7. Success/error messages shown to user

## Backend Integration

This UI uses the tested `astro_chart_api.py` which has:
- ✅ 78/78 tests passing (100% success rate)
- ✅ All 20 divisional charts working
- ✅ All API methods tested
- ✅ Comprehensive error handling

## Troubleshooting

### Import Errors

If you get import errors, make sure:
1. You're running from the correct directory
2. All dependencies are installed
3. Jyotishganit is installed: `pip install jyotishganit`

### Place Autocomplete Not Working

- Ensure geocoder/geopy are installed
- Try manually entering coordinates

### Charts Not Generating

- Check that all required fields are filled
- Verify date/time are valid
- Check console for error messages
- Ensure you have write permissions in the users folder

### Image Generation Issues

- Images use a simple text-based rendering
- If images fail, JSON and text files will still be created
- Check console for specific error messages

## Limitations

- Images are simple text-based representations (not traditional chart diagrams)
- PDF generation not yet implemented (planned for future version)
- Chart style is fixed to South Indian (configurable in code)

## Future Enhancements

- [ ] Full PDF report generation
- [ ] Traditional chart diagram rendering (North/South/East Indian styles)
- [ ] Chart viewing interface
- [ ] Batch processing for multiple users
- [ ] Export to other formats (CSV, XML)
- [ ] Chart comparison features

## Credits

- Built on Jyotishganit library with NASA JPL ephemeris
- Uses JyotishganitChartAPI wrapper  
- UI built with PyQt6

## License

Same as parent AstroAI project.
