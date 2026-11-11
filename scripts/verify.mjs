import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const file = (name) => path.join(root, name);
const read = (name) => fs.readFileSync(file(name), 'utf8');
let count = 0;
function check(condition, message) { assert.ok(condition, message); count++; }
function loadAMD(name, dependencies = []) {
  let exported;
  const sandbox = {
    sap: { ui: { define(depNames, factory) { exported = factory(...dependencies); } } },
    Date, Intl, Number, Math, Object, Boolean, Array
  };
  vm.runInNewContext(read(name), sandbox, { filename: name });
  check(exported !== undefined, `${name} exports an AMD module`);
  return exported;
}
const manifest = JSON.parse(read('webapp/manifest.json'));
const fixture = JSON.parse(read('webapp/model/tasks.json'));
const pkg = JSON.parse(read('package.json'));
check(manifest['sap.app'].id === 'com.training.sprintboard', 'SAPUI5 namespace');
check(manifest['sap.ui5'].routing.routes.length === 2, 'Two routes');
check(manifest['sap.ui5'].routing.targets.detail.viewName === 'Detail', 'Detail target');
check(pkg.scripts.start.includes('ui5 serve'), 'UI5 serve command');
check(fixture.tasks.length >= 12, 'At least twelve initial tasks');
check(new Set(fixture.tasks.map((t) => t.id)).size === fixture.tasks.length, 'Unique task IDs');
check(new Set(fixture.tasks.map((t) => t.category)).size === 3, 'Three categories');
check(new Set(fixture.tasks.map((t) => t.priority)).size === 3, 'Three priorities');
check(new Set(fixture.tasks.map((t) => t.status)).size === 3, 'Three statuses');
for (const f of [
  'webapp/Component.js', 'webapp/model/formatter.js', 'webapp/model/taskStore.js',
  'webapp/controller/BaseController.js', 'webapp/controller/Overview.controller.js',
  'webapp/controller/Detail.controller.js', 'webapp/test/testsuite.qunit.js',
  'webapp/test/unit/unitTests.qunit.js', 'webapp/test/unit/model/formatter.js'
]) { new vm.Script(read(f), { filename: f }); count++; }
for (const f of [
  'webapp/index.html', 'webapp/view/App.view.xml', 'webapp/view/Overview.view.xml',
  'webapp/view/Detail.view.xml', 'webapp/view/TaskEditor.fragment.xml',
  'webapp/i18n/i18n.properties', 'webapp/test/testsuite.qunit.html'
]) { check(fs.existsSync(file(f)), `Required source: ${f}`); }
const properties = Object.fromEntries(
  read('webapp/i18n/i18n.properties').split(/\r?\n/)
    .filter((line) => line.trim() && !line.startsWith('#'))
    .map((line) => [line.split('=')[0], line.slice(line.indexOf('=') + 1)])
);
for (const f of ['webapp/view/Overview.view.xml', 'webapp/view/Detail.view.xml', 'webapp/view/TaskEditor.fragment.xml']) {
  for (const match of read(f).matchAll(/\{i18n>([^}]+)\}/g)) {
    check(match[1] in properties, `i18n property ${match[1]} in ${f}`);
  }
}
const formatter = loadAMD('webapp/model/formatter.js');
assert.equal(formatter.priorityState('High'), 'Error'); count++;
assert.equal(formatter.priorityState('Medium'), 'Warning'); count++;
assert.equal(formatter.priorityState('Low'), 'Success'); count++;
assert.equal(formatter.priorityState('?'), 'None'); count++;
assert.equal(formatter.formatDueDate('2026-11-12'), 'Nov 12, 2026'); count++;
assert.equal(formatter.formatDueDate('2026-02-31'), '—'); count++;
assert.equal(formatter.formatDueDate(null), '—'); count++;
assert.equal(formatter.isValidISODate('2028-02-29'), true); count++;
assert.equal(formatter.isValidISODate('2027-02-29'), false); count++;
class FakeModel {
  constructor(data) { this.data = structuredClone(data); }
  getProperty(path) { return path.slice(1).split('/').reduce((obj, key) => obj?.[key], this.data); }
  setProperty(path, value) {
    const parts = path.slice(1).split('/');
    const prop = parts.pop();
    const parent = parts.reduce((obj, key) => obj[key], this.data);
    parent[prop] = value;
  }
}
const models = { tasks: new FakeModel(fixture), ui: new FakeModel({counts: {}}) };
const fakeComponent = { getModel: (name) => models[name] };
const store = loadAMD('webapp/model/taskStore.js');
store.updateCounts(fakeComponent);
check(models.ui.getProperty('/counts/total') === 12, 'Initial total counter');
check(store.find(fakeComponent, 'T-101')?.title?.length > 0, 'Find by ID');
const created = store.create(fakeComponent, {
  title: 'A new task', category: 'Learning', priority: 'Low', status: 'Open',
  dueDate: '2026-12-01', description: '', favorite: false
});
check(created.id === 'T-113', 'New stable identifier');
check(models.ui.getProperty('/counts/total') === 13, 'Create updates counters');
const draft = store.find(fakeComponent, created.id);
draft.title = 'Edited task';
check(store.update(fakeComponent, created.id, draft), 'Update succeeds');
check(store.find(fakeComponent, created.id).title === 'Edited task', 'Edit is stored');
check(store.remove(fakeComponent, created.id), 'Delete succeeds');
check(models.ui.getProperty('/counts/total') === 12, 'Delete updates counters');
check(store.find(fakeComponent, created.id) === null, 'Deleted ID is absent');
console.log(`PASS — ${count} dependency-free source, formatter and CRUD assertions`);
console.log('Note: UI5 browser render and ui5 build require npm/UI5 framework packages.');
