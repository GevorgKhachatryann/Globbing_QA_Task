# Globbing Playwright Automation

Playwright + TypeScript automated test suite created for the Globbing QA Automation assignment.

## Tech Stack

- Playwright
- TypeScript
- Page Object Model (POM)
- Allure Reporting
- GitHub Actions CI/CD

## Why Playwright?

Playwright was chosen because:

- Built-in auto-waiting reduces flaky tests
- Supports modern browsers and multiple contexts
- Provides powerful debugging tools (trace, screenshots, videos)
- Good TypeScript support and fast CI execution

## Automated Scenario

### Registration Flow

Automated end-to-end registration:

- Generate dynamic user data
- Create temporary email inbox
- Fill registration form
- Receive verification email
- Extract confirmation link
- Complete second registration step
- Select service center
- Confirm registration success

## Project Structure
globbing-automation/
│
├── pages/
│ ├── RegistrationPage.ts
│ └── RegistrationStepTwoPage.ts
│
├── tests/
│ └── registration.spec.ts
│
├── utils/
│ ├── dynamicEmail.ts
│ └── mailtm.ts
│
├── .github/
│ └── workflows/
│ └── playwright.yml
│
├── playwright.config.ts
├── package.json
└── README.md


## Running Tests

Install dependencies:

```bash
npm install
# Install Playwright browsers:
npx playwright install chromium
# Run tests:
npm test
# Run with browser visible:
npm run test:headed
# Run Playwright UI mode:
npm run test:ui
```
## Test Stability

To reduce flaky tests:

- Uses Playwright auto-waiting
- Avoids hardcoded sleeps
- Captures screenshots/videos on failures
- Generates HTML and Allure reports
- CI/CD

GitHub Actions workflow:

- Runs tests on every push and pull request
- Installs dependencies and Chromium
- Executes Playwright tests
- Uploads:
    - Playwright HTML report
    - Allure report
    - Test artifacts