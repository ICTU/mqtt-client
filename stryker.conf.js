module.exports = function(config) {
  config.set({
    files: [
      "test/**/*.js",
      { pattern: "src/**/*.js", included: false, mutated: true }
    ],
    testFramework: "mocha",
    testRunner: "mocha",
    reporter: ["progress", "clear-text", "dots", "html", "event-recorder"],
    coverageAnalysis: "perTest",
    plugins: [
      "stryker-mocha-framework",
      "stryker-mocha-runner",
      "stryker-html-reporter"
    ]
  });
};
