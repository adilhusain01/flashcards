# Flashcards

Flashcards is a CSV-driven study app built with Next.js. Upload a simple two-column CSV file and study through a clean, animated flashcard experience.

## Project Overview

This project currently contains a frontend app in the `client` folder. It is designed for quick self-study sessions:

- Import flashcards from a CSV file.
- Flip cards to reveal answers.
- Move through the deck with keyboard or on-screen controls.
- Track study progress with a visual progress bar.

## Core Features

- Drag-and-drop or click-to-upload CSV import
- Automatic parsing of rows into flashcards
- Optional header detection (for headers like `Question` or `Term`)
- Animated card transitions and 3D card flipping
- Keyboard shortcuts:
  - Left Arrow: previous card
  - Right Arrow: next card
  - Space or Enter: flip current card
- Deck reset and quick "upload new file" action

## Tech Stack

- Next.js 16
- React 19 + TypeScript
- Tailwind CSS v4
- Framer Motion (animations)
- Papa Parse (CSV parsing)
- Lucide React (icons)

## Repository Structure

```text
Flashcards/
	README.md
	client/
		app/
			globals.css
			layout.tsx
			page.tsx
		public/
		package.json
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Install and Run

```bash
cd client
npm install
npm run dev
```

Then open `http://localhost:3000` in your browser.

## CSV Format

Use a CSV with two columns:

```csv
Question,Answer
What is FDI?,Foreign Direct Investment
What does GDP stand for?,Gross Domestic Product
```

Notes:

- The app reads the first two columns as front and back.
- Empty rows are skipped.
- If the first row looks like a header (`Question` or `Term`), it is removed automatically.

## Available Scripts

Run these inside the `client` folder:

- `npm run dev` - start local development server
- `npm run build` - build for production
- `npm run start` - run the production build
- `npm run lint` - run ESLint

## Current Scope

This is a frontend-only project focused on local CSV-based study flow. No backend or database is required for the current version.
