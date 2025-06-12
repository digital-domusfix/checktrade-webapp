# CheckTrade WebApp

This repository contains the web user interface for **CheckTrade**. The frontend
is built with React and Vite and lives under the [`frontend-app/`](frontend-app/) directory.

## Prerequisites

- **Node.js** >= 18 (see `.nvmrc`)
- **npm** (comes with Node.js)

## Setup

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

## Lead Generation Wizard

The home page includes a quick wizard that collects a trade category, postcode,
desired start date, and contact info. After the final step it calls the API at
`/api/lead-gen/jobs/draft` using the base URL defined in `VITE_API_BASE_URL` and
navigates to `/job/new`.

To run the frontend against a different API backend set the environment variable
before starting Vite:

```bash
VITE_API_BASE_URL=https://api.example.com npm run dev
```

## Profile Setup Page

The `ProfileSetupPage` shows a **Skip for now** link by default. Set
`VITE_SHOW_PROFILE_SKIP_LINK=false` when starting Vite to hide this link or pass
`showSkipLink={false}` to the component manually.

