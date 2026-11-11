sap.ui.define([
  "sap/ui/core/UIComponent",
  "sap/ui/model/json/JSONModel",
  "com/training/sprintboard/model/taskStore"
], function (UIComponent, JSONModel, taskStore) {
  "use strict";

  return UIComponent.extend("com.training.sprintboard.Component", {
    metadata: { manifest: "json" },

    init: function () {
      UIComponent.prototype.init.apply(this, arguments);

      // The entire application works without a backend. Changes are in memory
      // and reset after refresh, just as the exercise specifies.
      var oTasks = new JSONModel({ tasks: [] });
      var oUi = new JSONModel({
        search: "",
        status: "All",
        category: "All",
        sortDescending: false,
        groupByCategory: false,
        counts: { total: 0, open: 0, done: 0 }
      });
      this.setModel(oTasks, "tasks");
      this.setModel(oUi, "ui");
      oTasks.attachRequestCompleted(function (oEvent) {
        if (oEvent.getParameter("success")) {
          taskStore.updateCounts(this);
        }
      }, this);
      oTasks.loadData(sap.ui.require.toUrl("com/training/sprintboard/model/tasks.json"));
      this.getRouter().initialize();
    }
  });
});
