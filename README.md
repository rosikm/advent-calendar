# 🎄 Advent Calendar 2025

An interactive web-based Advent Calendar with 24 clickable windows that unlock throughout December.

## Features

- **24 Interactive Windows**: Each window unlocks on its corresponding day in December (Window 1 on Dec 1st, Window 2 on Dec 2nd, etc.)
- **PDF Integration**: Each window displays a specific portion of the LEGO instructions PDF
- **Progress Tracking**: The calendar remembers which windows you've opened (stored in browser localStorage)
- **Responsive Design**: Works on desktop and mobile devices
- **Beautiful UI**: Festive gradient background with smooth animations

## Page Distribution

- **Windows 1-7**: 3 pages each (pages 1-21)
- **Windows 8-23**: 4 pages each (pages 22-85)
- **Window 24**: 7 pages (pages 86-92)

## How to Use

1. Open `index.html` in a web browser
2. Click on any unlocked window (windows unlock on their corresponding December date)
3. View the PDF pages assigned to that window
4. Navigate through pages using the Previous/Next buttons or arrow keys
5. Close the PDF viewer by clicking the × button or pressing Escape

## Files

- `index.html` - Main HTML structure
- `style.css` - Styling and animations
- `script.js` - Interactive functionality and PDF rendering
- `AdventCalendar2025.pdf` - The LEGO instructions PDF

## Testing

By default, windows only unlock on their corresponding December dates. To test all windows immediately, uncomment line 55 in `script.js`:

```javascript
// return true;
```

This will make all windows clickable regardless of the current date.

## Browser Compatibility

Works best in modern browsers (Chrome, Firefox, Safari, Edge). Requires JavaScript to be enabled.

## Technologies Used

- HTML5
- CSS3 (Grid, Flexbox, Gradients, Animations)
- Vanilla JavaScript
- PDF.js library for PDF rendering
- LocalStorage for progress tracking

Enjoy your Advent Calendar! 🎅🎁
