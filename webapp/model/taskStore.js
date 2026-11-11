sap.ui.define([], function () {
  "use strict";

  function tasks(oComponent) {
    return oComponent.getModel("tasks").getProperty("/tasks") || [];
  }

  function clone(oTask) {
    return Object.assign({}, oTask);
  }

  return {
    all: function (oComponent) {
      return tasks(oComponent).map(clone);
    },
    find: function (oComponent, sId) {
      var oTask = tasks(oComponent).find(function (oCandidate) {
        return oCandidate.id === sId;
      });
      return oTask ? clone(oTask) : null;
    },
    create: function (oComponent, oDraft) {
      var aTasks = tasks(oComponent);
      var iMax = aTasks.reduce(function (iCurrent, oTask) {
        var aMatch = /^T-(\d+)$/.exec(oTask.id);
        return aMatch ? Math.max(iCurrent, Number(aMatch[1])) : iCurrent;
      }, 100);
      var oNew = Object.assign({}, oDraft, { id: "T-" + (iMax + 1) });
      oComponent.getModel("tasks").setProperty("/tasks", aTasks.concat([oNew]));
      this.updateCounts(oComponent);
      return clone(oNew);
    },
    update: function (oComponent, sId, oDraft) {
      var bFound = false;
      var aUpdated = tasks(oComponent).map(function (oTask) {
        if (oTask.id !== sId) { return oTask; }
        bFound = true;
        return Object.assign({}, oDraft, { id: sId });
      });
      if (!bFound) { return false; }
      oComponent.getModel("tasks").setProperty("/tasks", aUpdated);
      this.updateCounts(oComponent);
      return true;
    },
    remove: function (oComponent, sId) {
      var aOriginal = tasks(oComponent);
      var aRemaining = aOriginal.filter(function (oTask) { return oTask.id !== sId; });
      if (aRemaining.length === aOriginal.length) { return false; }
      oComponent.getModel("tasks").setProperty("/tasks", aRemaining);
      this.updateCounts(oComponent);
      return true;
    },
    updateCounts: function (oComponent) {
      var aTasks = tasks(oComponent);
      var oCounts = {
        total: aTasks.length,
        open: aTasks.filter(function (oTask) { return oTask.status !== "Done"; }).length,
        done: aTasks.filter(function (oTask) { return oTask.status === "Done"; }).length
      };
      oComponent.getModel("ui").setProperty("/counts", oCounts);
    }
  };
});
