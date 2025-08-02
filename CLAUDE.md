# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `bun dev` (runs Vite dev server)
- **Build for production**: `bun run build` (TypeScript compilation + Vite build)
- **Lint code**: `bun run lint` (ESLint with TypeScript support)
- **Preview production build**: `bun run preview`
- **Add dependencies**: `bun add <package>` or `bun add -D <package>` (for dev dependencies)

## Project Architecture

This is a React + TypeScript + Vite application that finds the closest design token matches for legacy hex colors using Euclidean distance in RGB color space.

### Core Components

- **`src/app.tsx`**: Main application component containing all logic
  - Color similarity algorithm using RGB Euclidean distance
  - Real-time matching as user types
  - JSON parsing for design token input
  - Top 5 closest matches display
  - Copy-to-clipboard functionality for results

### Key Features

- **Color input validation**: Validates hex color format (#RRGGBB)
- **JSON design tokens**: Accepts object format like `{"tokenName": "#hexvalue"}`
- **Distance calculation**: Uses `Math.sqrt((r1-r2)² + (g1-g2)² + (b1-b2)²)`
- **Visual comparison**: Side-by-side color swatches
- **Best match highlighting**: Special styling for closest match

### Tech Stack

- **Frontend**: React 19 with TypeScript
- **Styling**: Tailwind CSS v4 (using @tailwindcss/vite plugin)
- **Icons**: Lucide React
- **Build tool**: Vite with TypeScript compilation
- **Runtime/Package Manager**: Bun
- **Linting**: ESLint with TypeScript and React plugins

### File Structure

- `src/main.tsx`: React app entry point
- `src/app.tsx`: Single-component application (no routing)
- `src/index.css`: Global styles and Tailwind imports
- `src/utils.ts`: Currently empty utility file
- `vite.config.ts`: Vite configuration with React and Tailwind plugins

Note: The application is intentionally simple with all logic contained in a single component for rapid prototyping and development.