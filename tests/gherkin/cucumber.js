module.exports = {
  default: {
    requireModule: [],
    require: ['step-definitions/**/*.steps.js'],
    format: [
      'json:reports/cucumber_report.json',
      'summary'
    ],
    formatOptions: { snippetInterface: 'synchronous' },
  }
};
