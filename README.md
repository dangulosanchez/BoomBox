# The Boombox Miami Website

This repository contains the website for The Boombox Miami, a Miami-based venue and creative space built around underground music, local culture, and community events.

For the purposes of this project README, treat this as a frontend website project. Any backend or authentication-related files in the repo are legacy leftovers and are not part of the website documentation below.

## What This Site Includes

- A landing page for The Boombox Miami
- A story page about the venue and its roots
- A gallery experience with site photography
- Collaboration and contact pages
- Shared navigation, footer, and reusable section components
- Centralized site copy stored in JSON for easier content updates

## Tech Stack

- React 18
- React Router
- CSS Modules
- Framer Motion
- React Photo Album
- Yet Another React Lightbox

## Project Structure

```text
.
├── frontend/        # React website
├── backend/         # Legacy code, ignored for this website README
├── README.md
└── LICENSE
```

Key frontend folders:

- `frontend/src/pages` for top-level routes like Home, Gallery, Story, Contact, and Collaborate
- `frontend/src/components` for reusable UI pieces
- `frontend/src/data/content.json` for editable site copy
- `frontend/public/images` and `frontend/public/real_images` for site assets

## Getting Started

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Start the development server:

```bash
npm start
```

3. Open the app at `http://localhost:3000`

## Available Scripts

Run these from the `frontend` directory:

- `npm start` starts the local dev server
- `npm run build` creates a production build
- `npm test` runs the test suite

## Content Updates

Most of the website copy is centralized in:

- `frontend/src/data/content.json`

That makes it easy to update headlines, body copy, labels, and other text without rewriting component logic.

## Routing

The public website currently includes routes for:

- `/`
- `/gallery`
- `/story`
- `/collaborations`
- `/contact`

There are also some legacy auth-related routes still present in the codebase, but they are outside the scope of this website README.

## Deployment Notes

The frontend is configured with a `homepage` value in `frontend/package.json`, which suggests it is intended to be deployed as a static React site, including GitHub Pages-style hosting.

If deployment behavior changes, update:

- `frontend/package.json`
- React Router `basename` usage in `frontend/src/App.jsx`

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).
