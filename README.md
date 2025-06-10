# CheckTrade WebApp

This repository contains the web user interface for **CheckTrade**. The frontend
is built with React and Vite and lives under the [`frontend-app/`](frontend-app/) directory.

## Prerequisites

- **Node.js** >= 18 (see `.nvmrc`)
- **npm** (comes with Node.js)

## Getting started

Ensure you are using Node.js 18. If you have `nvm` installed you can simply
run `nvm use` in the project root to activate the version specified in
`.nvmrc`.

From the `frontend-app/` directory run:

```bash
npm install
npm run dev
```

Other useful commands:

```bash
npm run lint    # run ESLint
npm run stylelint # lint styles
npm run test    # run unit tests (if defined)
npm run build   # compile for production
```

The build output is placed in `frontend-app/dist/`.

