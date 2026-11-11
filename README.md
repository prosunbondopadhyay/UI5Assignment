# SprintBoard Lite — Complete SAPUI5 assignment solution

An instructor reference implementation of the revised SAPUI5 Walkthrough assignment. **Freestyle SAPUI5** using XML views, controllers, `Component.js`, `manifest.json`, local `JSONModel`, routing, a shared XML dialog fragment, i18n, lightweight CSS and common `sap.m` controls. **No CAP service or HANA database is required.** The only role of Node.js here is to run UI5 development tooling.

## Requirements

- Node.js **20 or later** (22 LTS works) and npm.
- Internet on the development machine for the initial `npm install` and SAPUI5 framework downloads via UI5 CLI.
- A current browser. SAP Business Application Studio or VS Code.

## Run locally

```bash
npm install
npm start
```

Open `http://localhost:8080/index.html`. Do not open `index.html` directly as a `file://` URL.

To build:

```bash
npm run build
```

The built app is generated in `dist/`. To run a dependency-free source/data/formatter check:

```bash
npm run verify
```

## Screen navigation

```text
Overview (route #/)
  ├─ Search title + Status/Category dropdown filters
  ├─ Sort due date + Group by category + Reset
  ├─ New Task ─────────────┐
  └─ Click a table row     │
             ↓            │
Details (route #/task/T-101)
  ├─ Edit ────────────────┤
  ├─ Mark Done            │
  ├─ Delete (confirm)     │
  └─ Back                 ↓
                  Create/Edit Dialog (XML Fragment)
                  Input • Select • RadioButtonGroup
                  DatePicker • TextArea • CheckBox
                  Save (validate) / Cancel
```

There is **no calendar view and no OPA5 test**. The `DatePicker` is the only date-selection control. Browser refresh resets in-memory changes. The 12 initial task records are in `webapp/model/tasks.json`.

## Five-minute demo

1. Open Overview and check total/active/done counts.
2. Search for `UI5`, filter `Learning`, change status filters, and click Reset.
3. Sort due dates and group by category; open a row.
4. Edit its priority, due date and favorite flag; Save. Observe semantic colors and formatted date.
5. Choose New Task; demonstrate validation on empty title/date, then create a valid task.
6. Open the task, Mark Done, and Delete (cancel once, confirm next time).
7. Resize to phone width to inspect pop-ins. Refresh to restore the initial data.

## Concepts and files

| Concept | Where |
|---|---|
| Component, manifest, routing | `Component.js`, `manifest.json` |
| MVC | `view/Overview.view.xml`, `view/Detail.view.xml`, `controller/` |
| Models/data binding | named `tasks`, `ui`, `detail`, `editor` JSONModels |
| Property/aggregation/expression binding | table items, text, favorites and button state |
| Formatters | `model/formatter.js`: `formatDueDate`, `priorityState`, `statusState` |
| CRUD | `model/taskStore.js`, shared `controller/BaseController.js` |
| Fragment and validation | `view/TaskEditor.fragment.xml` |
| i18n | `i18n/i18n.properties` |
| CSS and icons | `css/style.css`, `sap-icon://...` |
| QUnit | `test/unit/model/formatter.js`; no OPA5 |

Common `sap.m` controls: `Table`, `ColumnListItem`, `SearchField`, `Select`, `DatePicker`, `RadioButtonGroup`, `CheckBox`, `TextArea`, `Dialog`, `Panel`, `Page`, `VBox`, `HBox`, `OverflowToolbar`, `ToggleButton`, `ObjectStatus`, `MessageToast` and `MessageBox`.

## QUnit formatter test

With `npm start` running, open `http://localhost:8080/test/testsuite.qunit.html`. Select the unit test. It checks semantic priority states and valid/invalid date formatting.

## Troubleshooting

- `ui5: command not found`: run `npm install` and use `npm start`.
- First UI5 start needs network to fetch SAPUI5 libraries.
- Blank page: check `/index.html`, dev console and `resources/sap-ui-core.js`.
- Unknown task hashes show Task not found; try `#/task/T-101`.
- Data resets on browser refresh by design, because no backend/storage is used.
- If a created task is hidden, click Reset to clear filters.
- Dates are stored as ISO `yyyy-MM-dd` even if formatted differently in the UI.

## Validation scope

`npm run verify` checks local fixtures, source references, formatters and CRUD logic without UI5. Browser rendering and full production builds must be verified on a machine with npm registry access. This repository does not include `node_modules` or SAPUI5 binaries. See `VALIDATION_REPORT.md` and `MANUAL_TEST_CHECKLIST.md`.

## Official sources

- [SAPUI5 Walkthrough, JavaScript](https://ui5.github.io/tutorials/walkthrough/?lang=js)
- [SAPUI5 formatters](https://ui5.github.io/tutorials/walkthrough/steps/22/)
- [SAPUI5 QUnit](https://ui5.github.io/tutorials/walkthrough/steps/27/)
- [UI5 CLI](https://ui5.github.io/cli/v4/pages/SAPUI5/)

Training note: The local-data app prepares learners for future CAP and HANA training. It deliberately excludes OData, deployment, CAP and persistence.
