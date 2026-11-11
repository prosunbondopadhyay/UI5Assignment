sap.ui.define([], function () {
  "use strict";

  function parseISODate(sValue) {
    if (typeof sValue !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(sValue)) {
      return null;
    }
    var aParts = sValue.split("-").map(Number);
    var oDate = new Date(Date.UTC(aParts[0], aParts[1] - 1, aParts[2]));
    // Reject 2026-02-31 and similar dates rather than silently rolling over.
    if (oDate.getUTCFullYear() !== aParts[0] ||
        oDate.getUTCMonth() !== aParts[1] - 1 ||
        oDate.getUTCDate() !== aParts[2]) {
      return null;
    }
    return oDate;
  }

  return {
    isValidISODate: function (sValue) {
      return parseISODate(sValue) !== null;
    },
    formatDueDate: function (sValue) {
      var oDate = parseISODate(sValue);
      if (!oDate) { return "—"; }
      return new Intl.DateTimeFormat("en", {
        day: "numeric", month: "short", year: "numeric", timeZone: "UTC"
      }).format(oDate);
    },
    priorityState: function (sPriority) {
      switch (sPriority) {
        case "High": return "Error";
        case "Medium": return "Warning";
        case "Low": return "Success";
        default: return "None";
      }
    },
    statusState: function (sStatus) {
      switch (sStatus) {
        case "Done": return "Success";
        case "In Progress": return "Information";
        default: return "None";
      }
    }
  };
});
