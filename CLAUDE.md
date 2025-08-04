# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `bun dev` (runs Vite dev server)
- **Build for production**: `bun run build` (TypeScript compilation + Vite build)
- **Lint code**: `bun run lint` (Biome check for linting and formatting)
- **Lint and fix**: `bun run lint:fix` (Biome check with auto-fix)
- **Preview production build**: `bun run preview`
- **Add dependencies**: `bun add <package>` or `bun add -D <package>` (for dev dependencies)

## Project Architecture

This is a React + TypeScript + Vite application that finds the closest design token matches for legacy hex colors using CIEDE2000 algorithm in LAB color space for perceptually accurate matching.

### Core Components

- **`src/app.tsx`**: Main application component containing UI and state management
- **`src/lib/utils.ts`**: Core color matching logic and utilities
  - `findMultipleClosestMatches()`: Returns top N matches using CIEDE2000 algorithm
  - `findClosestMatches()`: Returns single best match
  - `isValidColor()`: Color validation using Color.js library
  - `parseAvailableColors()`: JSON parsing for design tokens
  - Alpha channel support via background compositing
- **`src/components/valid-color-field.tsx`**: Reusable color input component with validation
- **`src/components/color-comparison.tsx`**: Side-by-side color comparison display

### Key Features

- **Advanced color matching**: Uses CIEDE2000 algorithm in LAB color space (via color-diff library)
- **Alpha channel support**: Handles transparency by compositing with configurable background
- **Multiple input formats**: Supports any color format recognized by Color.js (hex, rgb, hsl, etc.)
- **JSON design tokens**: Accepts object format like `{"tokenName": "#hexvalue"}`
- **Top N matches**: Displays up to 20 closest matches, sorted by perceptual distance
- **Real-time matching**: Updates results as user types
- **Local storage**: Persists design token input using usehooks-ts
- **Copy functionality**: Copy token names and values to clipboard

### Tech Stack

- **Frontend**: React 19 with TypeScript
- **Styling**: Tailwind CSS v4 (using @tailwindcss/vite plugin)
- **Icons**: Lucide React
- **Color processing**: Color.js for parsing, color-diff for CIEDE2000 matching
- **Utilities**: usehooks-ts for local storage, zod for validation
- **Build tool**: Vite with TypeScript compilation
- **Runtime/Package Manager**: Bun
- **Linting/Formatting**: Biome (replaces ESLint/Prettier)

### Code Style and Configuration

- **Biome configuration** (`biome.json`): Tab indentation (width 2), single quotes, trailing commas
- **Component structure**: Modular design with reusable components
- **Type safety**: Full TypeScript coverage with strict configuration
- **State management**: React hooks with local storage persistence

### Algorithm Details

The color matching uses a sophisticated approach:
1. **Input parsing**: Accepts any color format via Color.js
2. **Alpha compositing**: Transparent colors are composited with background using alpha blending formula
3. **Color space conversion**: RGB → LAB color space for perceptually uniform distance calculation
4. **Distance calculation**: CIEDE2000 algorithm via color-diff library for human-perceived color differences
5. **Ranking**: Results sorted by distance with top N matches returned

This approach is significantly more accurate than simple RGB Euclidean distance for human color perception.