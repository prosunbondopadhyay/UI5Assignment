# Manual acceptance checklist — SprintBoard Lite

Run with `npm start` and tick the results:

- [ ] Opening `/index.html` shows the Overview with 12 tasks and three summary counters.
- [ ] Search by title filters table rows; status/category dropdown filters combine with search.
- [ ] Reset clears search and selectors; sort by due date and group by category work.
- [ ] Selecting a row routes to `#/task/T-...` and displays its details.
- [ ] Refreshing directly on a valid detail hash continues to display the task.
- [ ] A non-existent task hash shows a friendly “Task not found” state.
- [ ] New Task opens the shared XML dialog with Input, Select, RadioButtonGroup, DatePicker, TextArea, CheckBox.
- [ ] Empty/short titles, blank or impossible due dates do not save; validation feedback appears.
- [ ] Saving a valid task adds it, updates counters, and can be opened from the table.
- [ ] Edit shows the current due date. Save updates details; Cancel leaves task data unchanged.
- [ ] Priority High/Medium/Low have semantic colors from the formatter; due dates are readable.
- [ ] Mark Done changes status and disables Mark Done for the completed task.
- [ ] Delete asks for confirmation and routes home only after confirmation.
- [ ] Browser Back from Details returns to Overview; direct detail link falls back to Overview.
- [ ] Narrow phone layout shows useful pop-in table columns without horizontal scrolling.
- [ ] QUnit formatter suite passes; no error appears in the browser console.
- [ ] `npm run build` completes, producing `dist/`.

Note: Browser refresh resets edits because the fixture is local/in-memory by design.
