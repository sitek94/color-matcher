# Color Similarity Finder

## Core Features
- **Input Section**: Field to enter a hex color (like `#7A7A7A`)
- **Design Tokens Section**: Text area to paste your JSON object of available colors
- **Results Display**: Shows the closest matching design token with:
  - Color name (e.g., "sapNeutralColor")
  - Color value (e.g., "#d3d7d9")
  - Visual color swatches for both input and matched colors
  - Similarity score/distance

## Algorithm
- Convert hex colors to RGB values
- Calculate Euclidean distance in RGB color space to find closest match
- Could also show top 3-5 closest matches for comparison

## Interface
- Clean, developer-friendly design
- Side-by-side color preview
- Easy copy-paste functionality for the results
- Real-time matching as you type

## Future Enhancements
- Support for RGBA input
- Different color distance algorithms (LAB, HSL)
- Batch processing multiple colors
