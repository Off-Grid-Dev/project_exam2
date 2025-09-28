# Project Exam 2

[![Deployed to GitHub Pages](https://github.com/Off-Grid-Dev/project_exam2/actions/workflows/deploy.yml/badge.svg?branch=main)](https://off-grid-dev.github.io/project_exam2/)

Single-page React application built with Vite and TypeScript, deployed to GitHub
Pages.

---

## Table of Contents

- [Live Demo](#live-demo)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Building](#building)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

---

## Live Demo

https://off-grid-dev.github.io/project_exam2/

---

## Prerequisites

- Node.js ≥ 20.19.0
- npm (bundled with Node.js)
- pnpm (optional, for faster installs)

---

## Installation

```bash
git clone https://github.com/Off-Grid-Dev/project_exam2.git
cd project_exam2
npm ci
# or
pnpm install
```

---

## Development

```bash
npm run dev
# or
pnpm dev
```

Open http://localhost:5173 in your browser.

---

## Building

```bash
npm run build
# or
pnpm build
```

Production files are generated in the `dist/` folder.

---

## Deployment

A GitHub Actions workflow (`.github/workflows/deploy.yml`) runs on every push to
`main` and:

1. Installs dependencies
2. Builds the app into `dist/`
3. Deploys `dist/` to the `gh-pages` branch

GitHub Pages is configured to serve from that branch and folder, so every
successful push to `main` automatically updates the live site.

---

## Environment Variables

Create a `.env` file in the project root for any public-facing values:

```env
VITE_API_URL=https://api.example.com
```

Access in code via:

```ts
const apiUrl = import.meta.env.VITE_API_URL;
```

Ensure that `.env` is listed in `.gitignore`.

---

## Contributing

Contributions are welcome. Open issues or pull requests, and CI will validate
changes with:

- linting
- type checking
- tests
- build

---

## License

MIT License © 2025
