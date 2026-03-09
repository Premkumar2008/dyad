const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

test('server entry file exists', () => {
  assert.equal(fs.existsSync('src/server.js'), true);
});

test('app includes auth route wiring', () => {
  const appContent = fs.readFileSync('src/app.js', 'utf8');
  assert.equal(appContent.includes("app.use('/api/v1/auth', authRoutes);"), true);
});
