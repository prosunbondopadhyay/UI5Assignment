sap.ui.define([
  "com/training/sprintboard/controller/BaseController",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageBox",
  "sap/m/MessageToast",
  "com/training/sprintboard/model/taskStore"
], function (BaseController, JSONModel, MessageBox, MessageToast, taskStore) {
  "use strict";

  return BaseController.extend("com.training.sprintboard.controller.Detail", {
    onInit: function () {
      this.getView().setModel(new JSONModel({ found: false, task: {} }), "detail");
      this.getRouter().getRoute("detail").attachPatternMatched(this._onRouteMatched, this);
      // Direct deep links must also work if tasks.json loads after routing.
      this.getOwnerComponent().getModel("tasks").attachRequestCompleted(this._refreshDetails, this);
    },
    _onRouteMatched: function (oEvent) {
      this._sTaskId = oEvent.getParameter("arguments").taskId;
      this._refreshDetails();
    },
    _refreshDetails: function () {
      if (!this._sTaskId) { return; }
      var oTask = taskStore.find(this.getOwnerComponent(), this._sTaskId);
      this.getView().getModel("detail").setData({ found: Boolean(oTask), task: oTask || {} });
    },
    onEditTask: function () {
      var oTask = this.getView().getModel("detail").getProperty("/task");
      if (oTask && oTask.id) { this.openTaskEditor(oTask); }
    },
    onMarkDone: function () {
      var oTask = taskStore.find(this.getOwnerComponent(), this._sTaskId);
      if (!oTask) { return; }
      oTask.status = "Done";
      taskStore.update(this.getOwnerComponent(), this._sTaskId, oTask);
      this._refreshDetails();
      MessageToast.show(this.getText("taskMarkedDone"));
    },
    onDeleteTask: function () {
      MessageBox.confirm(this.getText("confirmDelete"), {
        title: this.getText("deleteTask"),
        onClose: function (sAction) {
          if (sAction !== MessageBox.Action.OK) { return; }
          taskStore.remove(this.getOwnerComponent(), this._sTaskId);
          MessageToast.show(this.getText("taskDeleted"));
          this.getRouter().navTo("overview", {}, true);
        }.bind(this)
      });
    },
    onEditorSaved: function () {
      this._refreshDetails();
    }
  });
});
