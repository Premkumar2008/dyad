const test = require('node:test');
const assert = require('node:assert/strict');

function withMockedModules(mocks, run) {
  const originals = [];

  for (const [modulePath, exportsValue] of Object.entries(mocks)) {
    const resolved = require.resolve(modulePath);
    originals.push([resolved, require.cache[resolved]]);
    require.cache[resolved] = {
      id: resolved,
      filename: resolved,
      loaded: true,
      exports: exportsValue
    };
  }

  try {
    return run();
  } finally {
    for (const [resolved, original] of originals) {
      if (original) {
        require.cache[resolved] = original;
      } else {
        delete require.cache[resolved];
      }
    }
  }
}

function loadRouteWithMockedExpress(routeRelativePath, extraMocks) {
  const routePath = require.resolve(routeRelativePath);
  const registered = [];

  const expressMock = {
    Router() {
      return {
        post(pathname, ...handlers) {
          registered.push({ method: 'post', path: pathname, handlersCount: handlers.length });
        },
        get(pathname, ...handlers) {
          registered.push({ method: 'get', path: pathname, handlersCount: handlers.length });
        }
      };
    }
  };

  return withMockedModules(
    {
      express: expressMock,
      ...extraMocks
    },
    () => {
      delete require.cache[routePath];
      require(routePath);
      return registered;
    }
  );
}

test('auth routes expose register, login, and me endpoints', () => {
  const routes = loadRouteWithMockedExpress('../src/routes/authRoutes', {
    '../src/controllers/authController': {
      register: () => {},
      login: () => {},
      getMe: () => {}
    },
    '../src/middleware/auth': {
      protect: () => {}
    }
  });

  assert.deepEqual(routes, [
    { method: 'post', path: '/register', handlersCount: 1 },
    { method: 'post', path: '/login', handlersCount: 1 },
    { method: 'get', path: '/me', handlersCount: 2 }
  ]);
});

test('admin routes expose admin-only users endpoint', () => {
  const routes = loadRouteWithMockedExpress('../src/routes/adminRoutes', {
    '../src/controllers/authController': {
      getAllUsers: () => {}
    },
    '../src/middleware/auth': {
      protect: () => {},
      authorizeRoles: () => () => {}
    }
  });

  assert.deepEqual(routes, [{ method: 'get', path: '/users', handlersCount: 3 }]);
});
