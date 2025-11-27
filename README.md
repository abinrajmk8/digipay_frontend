# DTE DigiPay Frontend

A production-ready React + TypeScript frontend scaffold for the Directorate of Technical Education (Kerala) DigiPay payment portal.

## Features

- **Modern Tech Stack**: React, TypeScript, Vite, TailwindCSS
- **Localization**: English and Malayalam support (i18next)
- **Security UI**: Login throttling, MFA placeholders, Transaction passwords
- **Mock API**: MSW (Mock Service Worker) for realistic API simulation
- **Responsive Design**: Mobile-first approach with accessible components

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Setup Instructions

Since the environment did not have Node.js installed, the dependencies have not been installed yet. Please follow these steps:

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Start Development Server**:
    ```bash
    npm run dev
    ```

3.  **Open in Browser**:
    Navigate to `http://localhost:5173`

## Project Structure

- `src/components/ui`: Reusable UI components (Button, Input, Card, etc.)
- `src/components/layout`: Layout components (Header, Sidebar, Footer)
- `src/pages`: Route components (Landing, Auth, Dashboard, Payments)
- `src/lib`: Utilities and helpers
- `src/mocks`: API mocks using MSW
- `src/i18n`: Localization configuration
- `public/locales`: Translation files (en.json, ml.json)

## Key Flows to Test

1.  **Public Landing**: Check the responsive design and language toggle.
2.  **Login**:
    - Try username `fail` to see throttling simulation.
    - Try username `mfa` to see OTP placeholder.
    - Use any other username to login.
3.  **Dashboard**: View the summary cards and sidebar navigation.
4.  **New Payment**:
    - Go to `Payments -> New Payment`.
    - Complete the 6-step wizard.
    - Verify the transaction password prompt in the final step.

## Configuration

- **Theme**: Colors are defined in `src/index.css` and `tailwind.config.js`.
- **API**: Base URL can be configured in `.env` (currently mocked).

## Accessibility

- All components use semantic HTML and ARIA attributes where necessary.
- Color contrast ratios meet WCAG 2.1 AA standards.
