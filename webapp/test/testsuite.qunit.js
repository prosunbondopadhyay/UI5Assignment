sap.ui.define([], function () {
  "use strict";
  return {
    name: "SprintBoard Lite formatter tests",
    defaults: {
      page: "ui5://test-resources/com/training/sprintboard/Test.qunit.html?testsuite={suite}&test={name}",
      qunit: { version: 2 },
      ui5: { theme: "sap_horizon" },
      loader: { paths: { "com/training/sprintboard": "../" } }
    },
    tests: {
      "unit/unitTests": { title: "SprintBoard – Formatter (QUnit)" }
    }
  };
});
