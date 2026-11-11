sap.ui.define([
  "com/training/sprintboard/controller/BaseController",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/ui/model/Sorter"
], function (BaseController, Filter, FilterOperator, Sorter) {
  "use strict";

  return BaseController.extend("com.training.sprintboard.controller.Overview", {
    onInit: function () {
      this.getRouter().getRoute("overview").attachPatternMatched(this._onRouteMatched, this);
    },
    _onRouteMatched: function () {
      this._applyTableState();
    },
    onAfterRendering: function () {
      this._applyTableState();
    },
    onSearch: function (oEvent) {
      // SearchField's change binding may not update on every keystroke.
      this.getOwnerComponent().getModel("ui").setProperty(
        "/search", oEvent.getSource().getValue()
      );
      this._applyTableState();
    },
    onFilterChange: function () {
      var oUi = this.getOwnerComponent().getModel("ui");
      oUi.setProperty("/status", this.byId("statusFilter").getSelectedKey());
      oUi.setProperty("/category", this.byId("categoryFilter").getSelectedKey());
      this._applyTableState();
    },
    onSortDate: function () {
      var oUi = this.getOwnerComponent().getModel("ui");
      oUi.setProperty("/sortDescending", !oUi.getProperty("/sortDescending"));
      this._applyTableState();
    },
    onToggleGroup: function (oEvent) {
      // ToggleButton has already updated its pressed state before this event.
      this.getOwnerComponent().getModel("ui").setProperty(
        "/groupByCategory", oEvent.getSource().getPressed()
      );
      this._applyTableState();
    },
    onResetFilters: function () {
      var oUi = this.getOwnerComponent().getModel("ui");
      oUi.setProperty("/search", "");
      oUi.setProperty("/status", "All");
      oUi.setProperty("/category", "All");
      oUi.setProperty("/sortDescending", false);
      oUi.setProperty("/groupByCategory", false);
      this._applyTableState();
    },
    _applyTableState: function () {
      var oTable = this.byId("taskTable");
      var oBinding = oTable && oTable.getBinding("items");
      if (!oBinding) { return; }
      var oUi = this.getOwnerComponent().getModel("ui");
      var sSearch = (oUi.getProperty("/search") || "").trim();
      var sStatus = oUi.getProperty("/status");
      var sCategory = oUi.getProperty("/category");
      var aFilters = [];
      if (sSearch) { aFilters.push(new Filter("title", FilterOperator.Contains, sSearch)); }
      if (sStatus && sStatus !== "All") {
        aFilters.push(new Filter("status", FilterOperator.EQ, sStatus));
      }
      if (sCategory && sCategory !== "All") {
        aFilters.push(new Filter("category", FilterOperator.EQ, sCategory));
      }
      oBinding.filter(aFilters);
      var oDueSorter = new Sorter("dueDate", oUi.getProperty("/sortDescending"));
      if (oUi.getProperty("/groupByCategory")) {
        oBinding.sort([
          new Sorter("category", false, function (oContext) {
            var sValue = oContext.getProperty("category");
            return { key: sValue, text: sValue };
          }),
          oDueSorter
        ]);
      } else {
        oBinding.sort(oDueSorter);
      }
    },
    onOpenTask: function (oEvent) {
      var oItem = oEvent.getSource();
      var oContext = oItem.getBindingContext("tasks");
      if (oContext) {
        this.getRouter().navTo("detail", { taskId: oContext.getProperty("id") });
      }
    },
    onEditorSaved: function () {
      this._applyTableState();
    }
  });
});
