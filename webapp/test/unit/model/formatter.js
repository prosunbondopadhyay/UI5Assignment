sap.ui.define([
  "com/training/sprintboard/model/formatter"
], function (formatter) {
  "use strict";

  QUnit.module("SprintBoard Lite – Formatters");
  QUnit.test("priorityState has semantic values and a safe fallback", function (assert) {
    assert.strictEqual(formatter.priorityState("High"), "Error", "High is red");
    assert.strictEqual(formatter.priorityState("Medium"), "Warning", "Medium is yellow");
    assert.strictEqual(formatter.priorityState("Low"), "Success", "Low is green");
    assert.strictEqual(formatter.priorityState("Unknown"), "None", "Unknown is neutral");
  });
  QUnit.test("formatDueDate handles correct and incorrect dates", function (assert) {
    assert.strictEqual(formatter.formatDueDate("2026-11-12"), "Nov 12, 2026");
    assert.strictEqual(formatter.formatDueDate("2026-02-31"), "—");
    assert.strictEqual(formatter.formatDueDate(null), "—");
  });
});
