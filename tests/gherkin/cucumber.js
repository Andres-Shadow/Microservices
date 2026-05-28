// module.exports = {
//   default: `--format-options '{"snippetInterface": "synchronous"}' `,
// };

const path = require("path");

module.exports = {
  default: `--format-options '{"snippetInterface": "synchronous"}' --format json:reports/cucumber_report.json`,
};

// const config = `
//   --require cucumber.node.js
//   --format json:playwright/reports/cucumber-html-reporter.json
//   --format message:playwright/reports/cucumber-html-reporter.ndjson
//   --format html:playwright/reports/report.html
//   --publish-quiet
//   --format @cucumber/pretty-formatter
//   `;

// export default config;
