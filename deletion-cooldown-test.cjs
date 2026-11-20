const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync(require('node:path').join(__dirname, 'delete-account.js'), 'utf8');
let now = 1000000;
const store = new Map();
function page(blockStorage = false) {
    const elements = {};
    const element = id => elements[id] ||= { value: '', textContent: '', disabled: false, addEventListener() {} };
    element('deletionForm').querySelector = () => element('button');
    const context = vm.createContext({
        document: { getElementById: element },
        window: { addEventListener() {} },
        localStorage: {
            getItem(key) { if (blockStorage) throw Error('blocked'); return store.get(key) || null; },
            setItem(key, value) { if (blockStorage) throw Error('blocked'); store.set(key, value); },
        },
        Date: { now: () => now },
        setInterval() {},
    });
    vm.runInContext(source, context);
    return { elements, run: code => vm.runInContext(code, context) };
}
let first = page();
assert.equal(first.elements.button.disabled, false);
first.run('startDeletionCooldown()');
assert.equal(first.elements.button.disabled, true);
assert.match(first.elements.button.textContent, /5:00/);
const reloaded = page();
assert.equal(reloaded.elements.button.disabled, true);
now += 300001;
reloaded.run('refreshDeletionCooldown()');
assert.equal(reloaded.elements.button.disabled, false);
const blocked = page(true);
blocked.run('startDeletionCooldown()');
assert.equal(blocked.elements.button.disabled, true);
blocked.elements.deletionReason.value = 'other';
blocked.run('updateCustomReason()');
assert.equal(blocked.elements.customReason.required, true);
assert.equal(blocked.elements.customReasonField.hidden, false);
console.log('PASS: initial state, cooldown, refresh persistence, expiry, blocked storage, custom reason. No network requests made.');