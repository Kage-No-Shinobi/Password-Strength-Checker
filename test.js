// Run tests with: node test.js
const assert = require('node:assert/strict');
const { analyzePassword, shannonEntropy } = require('./script.js');
assert.equal(shannonEntropy('aaaa'), 0);
assert.equal(shannonEntropy('ab'), 1);
assert.equal(analyzePassword('password123').label, 'Weak');
assert.equal(analyzePassword('p@ssword123').label, 'Weak');
assert.equal(analyzePassword('aaaAAAA1234!').label, 'Weak');
assert.equal(analyzePassword('vT9#kP2!mR7$zL4&').label, 'Strong');
console.log('All 6 tests passed.');
