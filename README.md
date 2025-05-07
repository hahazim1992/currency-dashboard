# Project hosted online, alternatively, continue below to setup project locally
- FE Angular hosted using github pages, visit https://hahazim1992.github.io/currency-dashboard/

- BE nodejs hosted at https://currency-dashboard-7kgm.onrender.com (no need to visit)
- Observe API calls from angular web page calling from render


# CurrencyDashboard - Get Started

- git clone https://github.com/hahazim1992/currency-dashboard.git
- checkout main

## install FE packages

- install angular v16.2.16.
- install node v18.20.4

## install FE dependencies

at the root of the project
- npm install

## install BE dependencies

at the root of the project
- cd server
- npm install

## initialize BE server (server.js)

at the root of the project
- run node server/server.js

## start the FE App

at the root of the project
- npm run start

# run unit test FE Jasmine Karma

at the root of the project
- npm run test
- at folder explorer, goto root > coverage > currency-dashboard > right click (index.html) > copy path > pate in google chrome > inspect unit test coverage

## run unit test BE Jest Babel

at the root of the project
- cd server
- npx jest --coverage
- at folder explorer, goto root > server > coverage > right click (index.html) > copy path > pate in google chrome > inspect unit test coverage

## run prettier

at the root of the project
- npm run format

## run esLint

at the root of the project
- npm run lint

## assessment checklist + developer comments

- ✅ - DONE
- ❌ - NOT DONE / CAN'T BE DONE
- 🗯️ - DEVELOPER NOTES
#
- ✅ Fetch real-time exchange rates from a public API (e.g., ExchangeRate-API)
- ✅ Display rates in a sortable table with columns for currency code, exchange rate, and base currency.
#
- ✅ Allow users to compare exchange rate trends for up to 3 selected currencies over the past month.
- 🗯️: can compare 3 currencies in a particular date instead of over the past month
#
- ❌ Use a toggle to switch between daily, weekly, and monthly data aggregation for the chart.
- 🗯️: unable to do this because historical API can only support params (#1 - base currency) (#2 - can select up to 3 currencies) (#3 - a singular date for the history of currency rate)
#
- ✅ Display the trend as a dynamic chart using a library like Chart.js or D3.js.
- 🗯️: using chart.js
#
- ✅ Include a section where users can input an amount and two currencies to calculate the equivalent value based on the latest exchange rates.
- ✅ Implement filtering by currency and a search bar to quickly find specific currencies.
#
- ✅ | ❌ (partially) Use WebSockets or a polling mechanism to refresh exchange rates in real time.
- ✅ | ❌ (partially) Optimize polling intervals to reduce API calls without compromising user experience.
- 🗯️: currently not using websocket or polling, achieved this by using take and interval method from rxjs
#
- ✅ Cache the last fetched exchange rates and historical data in IndexedDB or localStorage.
- 🗯️: this is available ONLY in exchange rates page (landing page). We are using localStorage. you may use offline mode button i provoided, OR, go to historical page > disconnect your internet > navigate back to exchange rates > observe it detects as you dont have connectivity and will fetch from localStorage earlier when you had internet
#
- ✅ Allow users to interact with cached data when offline, with a clear indication that data is not live.
#
- ✅ Provide a toggle for switching between light and dark themes.
- 🗯️: find the toggle in the sticky menu in the top of your screen of the icon on the most far right
#
- ✅ Organize the code using modular architecture.
- 🗯️: using BE nodejs and mono repo
#
- ✅ Write unit tests for services, components, and utilities using Jasmine and Karma.
- 🗯️ refer:
- Goto section [run unit test FE Jasmine Karma]
- Goto section [run unit test BE Jest Babel]
#
- ❌ Implement E2E tests using Cypress or Protractor to cover key user interactions.
- 🗯️: not implemented yet
#
- ✅ (partially) Include a basic CI/CD pipeline script to lint, test, build, and deploy the application to a staging environment.
- 🗯️: CICD implemented, includes CI job for lint, unit test and build
#
- ✅ Provide a README.md file with setup instructions, architecture decisions, and usage details.




