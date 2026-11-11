sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/Fragment",
  "sap/ui/core/routing/History",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageToast",
  "sap/m/MessageBox",
  "com/training/sprintboard/model/taskStore",
  "com/training/sprintboard/model/formatter"
], function (Controller, Fragment, History, JSONModel, MessageToast, MessageBox, taskStore, formatter) {
  "use strict";

  return Controller.extend("com.training.sprintboard.controller.BaseController", {
    formatter: formatter,

    getRouter: function () {
      return this.getOwnerComponent().getRouter();
    },
    getText: function (sKey) {
      return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(sKey);
    },
    onNavBack: function () {
      var sPreviousHash = History.getInstance().getPreviousHash();
      if (sPreviousHash !== undefined) {
        window.history.go(-1);
      } else {
        this.getRouter().navTo("overview", {}, true);
      }
    },

    onOpenCreate: function () {
      this.openTaskEditor(null);
    },
    openTaskEditor: function (oExistingTask) {
      var bEditing = Boolean(oExistingTask);
      var oTask = bEditing ? Object.assign({}, oExistingTask) : {
        title: "", category: "Learning", priority: "Medium", status: "Open",
        dueDate: "", description: "", favorite: false
      };
      var aPriorities = ["Low", "Medium", "High"];
      this.getView().setModel(new JSONModel({
        mode: bEditing ? "edit" : "create",
        dialogTitle: this.getText(bEditing ? "editTask" : "newTask"),
        priorityIndex: Math.max(0, aPriorities.indexOf(oTask.priority)),
        task: oTask
      }), "editor");

      if (!this._pEditorDialog) {
        this._pEditorDialog = Fragment.load({
          id: this.getView().getId(),
          name: "com.training.sprintboard.view.TaskEditor",
          controller: this
        }).then(function (oDialog) {
          this.getView().addDependent(oDialog);
          return oDialog;
        }.bind(this));
      }
      this._pEditorDialog.then(function (oDialog) {
        this.byId("titleInput").setValueState("None");
        this.byId("dueDatePicker").setValueState("None");
        oDialog.open();
      }.bind(this));
    },
    onTitleLiveChange: function () {
      this.byId("titleInput").setValueState("None");
    },
    onDateChange: function (oEvent) {
      this.byId("dueDatePicker").setValueState(
        oEvent.getParameter("valid") ? "None" : "Error"
      );
    },
    onCancelEditor: function () {
      this.byId("taskEditorDialog").close();
      // Editor model contains a copy. Closing cannot mutate the task list.
    },
    onSaveEditor: function () {
      var oEditor = this.getView().getModel("editor");
      var oDraft = Object.assign({}, oEditor.getProperty("/task"));
      var oTitle = this.byId("titleInput");
      var oDate = this.byId("dueDatePicker");
      oDraft.title = (oTitle.getValue() || "").trim();
      oDraft.dueDate = oDate.getValue();
      oDraft.category = this.byId("categoryInput").getSelectedKey();
      oDraft.status = this.byId("statusInput").getSelectedKey();
      oDraft.favorite = this.byId("favoriteInput").getSelected();
      oDraft.description = this.byId("descriptionInput").getValue();
      oDraft.priority = ["Low", "Medium", "High"][this.byId("priorityGroup").getSelectedIndex()];

      var bTitleValid = oDraft.title.length >= 4 && oDraft.title.length <= 70;
      var bDateValid = formatter.isValidISODate(oDraft.dueDate) && Boolean(oDate.getDateValue());
      var bChoicesValid = ["Learning", "Planning", "Onboarding"].includes(oDraft.category) &&
        ["Open", "In Progress", "Done"].includes(oDraft.status) && Boolean(oDraft.priority);
      oTitle.setValueState(bTitleValid ? "None" : "Error");
      oDate.setValueState(bDateValid ? "None" : "Error");
      if (!bTitleValid || !bDateValid || !bChoicesValid) {
        MessageBox.error(this.getText("validationError"));
        return;
      }

      if (oEditor.getProperty("/mode") === "edit") {
        var bUpdated = taskStore.update(this.getOwnerComponent(), oDraft.id, oDraft);
        if (!bUpdated) {
          MessageBox.error(this.getText("taskNotFound"));
          return;
        }
        MessageToast.show(this.getText("taskUpdated"));
      } else {
        taskStore.create(this.getOwnerComponent(), oDraft);
        MessageToast.show(this.getText("taskCreated"));
      }
      this.byId("taskEditorDialog").close();
      if (typeof this.onEditorSaved === "function") {
        this.onEditorSaved();
      }
    },
    onExit: function () {
      // Dialog is a view dependent and is automatically destroyed by the view.
      this._pEditorDialog = null;
    }
  });
});
