# Serverless REST API Backend Development Instructions

## Overview

You are developing a frontend React Application in Typescript with a serverless REST API backend in Python

Each backend function operates independently, is scalable, and stateless without shared code.

You have to always write unit and integration tests for each action.

Unit tests must invoke directly the action function passing dictionaries.

Integration test must use the requests library and perform HTTP requests to the deployed action endpoints, using as host the `OPSDEV_HOST` environment variable.

You can execute an unit test in isolation, as they use test containers.

When you change the code of an action, before executing the integration test, you have to redeploy it with `ops ide deploy <package>/<action>`.

## Goals

- Code Python REST API backend functions
- Each deployed action becomes a REST endpoint at `/api/my/<package>/<name>`
- Implement the frontend using TypeScrippt and React

## Backend Project Structure

### Backend Functions Organization

- Functions are stored in `packages/<package>/<name>/*.py`
- Each function requires a `packages/<package>/<name>/__main__.py` file
- Each function has an `<function>.py` file with a `main` function
- Unit tests: `tests/<package>/test_<name>.py`
- Integration tests: `tests/<package>/test_<name>_int.py`

### Function Structure

- Main function receives JSON object input and returns JSON object output (never arrays or primitives)
- `__main__.py` ends with: `return {"body": <function>.<function>(args) }`
- Write code in `<function>.py` file within the `<function>` module, **never** in `__main__.py`
- Always add annotation comments (format: `#--`) in `__main__.py`

### Common Annotation

Each action must specify its kind, so it needs always

```
#--kind python:default
```

Action that are invoked publicly also need to be exposed with

```
#--param true
```

## Development Commands

### Creating Actions

When you need a new function create and deploy as follows

```bash
ops tk new  <package>/<function>
ops ide deploy <package>/<function>
```

### Deployment

Depoloyment is automatic when you change the code.

## Environment and Dependencies

### Limitations

- Write **only Python code** for backend
- Write **only Typescript code** for frontend
- Consider only `packages/**` and `tests/**` files and for Python
- Consider only `src/**` for Typescript
- Place static assets under `public`
- **NEVER** use `pip import` or `requirements.txt`
- Use only the following approved libraries:
  - `requests`
  - `openai`
  - `psycopg`
  - `boto3`
  - `pymilvus`
  - `redis`

### Secrets Management

## Service Integrations

### Redis Configuration

When you need to use Redis, do always 2 things:

1. Add to `__main__.py`:

```python
#--param REDIS_URL $REDIS_URL
#--param REDIS_PREFIX $REDIS_PREFIX
```

2. Access code for `<action>.<action>(args)`:

```python
rd = redis.from_url(args.get("REDIS_URL"), os.getenv("REDIS_URL"))
prefix = args.get("REDIS_PREFIX"), os.getenv("REDIS_PREFIX"))
# Always use prefix for all Redis Keys
```


### PostgreSQL Configuration

When you need to use Postgres, do always 2 things:

1. add to `__main__.py`:

```python
#--param POSTGRES_URL "$POSTGRES_URL"
```

2. use the code for `<action>.<action>(args)`:

```python
dburl = args.get("POSTGRES_URL", os.getenv("POSTGRES_URL"))
```

### S3 Configuration

When you need to use S3, do always 3 things:

1. Add to `__main__.py`:

```python
#--param S3_HOST $S3_HOST
#--param S3_PORT $S3_PORT
#--param S3_ACCESS_KEY $S3_ACCESS_KEY
#--param S3_SECRET_KEY $S3_SECRET_KEY
#--param S3_BUCKET_DATA $S3_BUCKET_DATA
```

2. Access code for `<action>.<action>(args)`:

```python
host = args.get("S3_HOST", os.getenv("S3_HOST"))
port = args.get("S3_PORT", os.getenv("S3_PORT"))
url = f"http://{host}:{port}"
key = args.get("S3_ACCESS_KEY", os.getenv("S3_ACCESS_KEY"))
sec = args.get("S3_SECRET_KEY", os.getenv("S3_SECRET_KEY"))
store_s3 = boto3.client('s3', region_name='us-east-1', endpoint_url=url, aws_access_key_id=key, aws_secret_access_key=sec)
store_bucket = args.get("S3_BUCKET_DATA", os.getenv("S3_BUCKET_DATA"))
```

### Milvus Configuration

When you need to use Milvus, do always 2 things:

1. Add to `__main__.py`:

```python
#--param MILVUS_HOST $MILVUS_HOST
#--param MILVUS_PORT $MILVUS_PORT
#--param MILVUS_DB_NAME $MILVUS_DB_NAME
#--param MILVUS_TOKEN $MILVUS_TOKEN
```

2. Access code for `<action>.<action>(args)`:

```python
uri = f"http://{args.get("MILVUS_HOST", os.getenv("MILVUS_HOST"))}"
token = args.get("MILVUS_TOKEN", os.getenv("MILVUS_TOKEN"))
db_name = args.get("MILVUS_DB_NAME", os.getenv("MILVUS_DB_NAME"))
client = MilvusClient(uri=uri, token=token, db_name=db_name)
```

3. Ensure there is `ENABLE_MILVUS` in the `tests/.env` file.

## Key Requirements Summary

- Serverless, stateless, independent functions
- Python-only backend development
- JSON input/output objects only
- Proper annotation comments in `__main__.py`
- Environment-based configuration management
- Support for Redis, PostgreSQL, S3, and Milvus

# Web Actions Development Guide

The following rules apply to write backend REST calls (aka web actions) for the frontend.

## Overview

Web actions are serverless functions that can be invoked via HTTP REST interface without requiring authentication credentials. They enable you to build web-based applications with backend logic accessible anonymously.

## Web Action Basics

### URL Structure

Web actions are accessible to the frontend with this structure

```
/api/my/{PACKAGE}/{ACTION}.{EXTENSION}
```

Note that an {ACTION} has a name, but it can be also be accesset as {NAME}/{SUBPATH} allowing an internal routing.

The {SUBPATH} is then available in the `__ow_path` argument.

### Creating Web Actions

Enable web functionality using in the `__main__.py` the

```
#--param web true
```

## HTTP Request Context

Web actions automatically receive HTTP request details as parameters:

### Available Parameters

- `__ow_method`: HTTP method (GET, POST, PUT, etc.)
- `__ow_headers`: Request headers as key-value map
- `__ow_path`: Unmatched path after action extension
- `__ow_user`: Authenticated user namespace (if auth required)
- `__ow_body`: Request body (base64 for binary, string otherwise)
- `__ow_query`: Unparsed query string

## Content Types and Extensions

### Supported Extensions

- `.json` - JSON response
- `.html` - HTML response
- `.http` - HTTP response (default if no extension)
- `.svg` - SVG response
- `.text` - Plain text response

### Example URLs

```
/api/my/guest/demo/hello.json    # JSON response
/api/my/guest/demo/hello.html    # HTML response
/api/my/guest/demo/hello.http    # HTTP response
/api/my/guest/demo/hello         # Defaults to .http
```

## Request Processing

### Parameter Precedence (highest to lowest)

1. Body parameters
2. Query parameters
3. Action parameters
4. Package parameters

### Input Formats

- **JSON**: `application/json` (default)
- **Form Data**: `application/x-www-form-urlencoded`
- **Raw Data**: Any other content type

### HTTP Methods

Supported methods: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, `OPTIONS`

## Best Practices

### Content Type Handling

- Specify the right extension for the URL
- Default is `application/json` for objects, `text/html` for strings
- Use base64 encoding for binary data

## React Frontend Development

### Overview

The frontend is built with React and JavaScript. It communicates with the backend via REST API calls to the deployed serverless actions.

### Project Structure

```
web/
├── public/
│   └── index.html
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/            # Page-level components
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API service modules
│   ├── utils/            # Utility functions
│   ├── App.jsx           # Root application component
│   └── index.jsx         # Entry point
├── package.json
└── vite.config.js
```

### Development Commands

Deployment is automatic when you change the code.

### API Integration

#### Service Module Pattern

Create API service modules in `web/src/services/` to centralize backend communication:

```javascript
// web/src/services/api.js
const API_BASE = '/api/my';

export async function fetchJson(package, action, options = {}) {
  const url = `${API_BASE}/${package}/${action}.json`;
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}

export async function postJson(package, action, data) {
  return fetchJson(package, action, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
```

#### Example Service

```javascript
// web/src/services/users.js
import { fetchJson, postJson } from './api';

export const getUsers = () => fetchJson('users', 'list');
export const createUser = (data) => postJson('users', 'create', data);
export const getUser = (id) => fetchJson('users', `get/${id}`);
```

### Custom Hooks

Create custom hooks for data fetching and state management:

```javascript
// web/src/hooks/useApi.js
import { useState, useEffect } from 'react';

export function useApi(fetchFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchFn()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, deps);

  return { data, loading, error };
}
```

### Component Guidelines

#### Functional Components

Always use functional components with hooks:

```javascript
// web/src/components/UserList.jsx
import { useApi } from '../hooks/useApi';
import { getUsers } from '../services/users';

export function UserList() {
  const { data: users, loading, error } = useApi(getUsers);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

#### Component File Structure

Each component should be self-contained:

```
components/
├── UserList/
│   ├── UserList.jsx      # Component logic
│   ├── UserList.css      # Component styles
│   └── index.js          # Export
```

### State Management

- Use React Context for global state (auth, theme, etc.)
- Use `useState` and `useReducer` for local component state
- Avoid external state libraries unless complexity demands it

```javascript
// web/src/context/AuthContext.jsx
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (credentials) => {
    const userData = await postJson('auth', 'login', credentials);
    setUser(userData);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

### Routing

Use React Router for client-side navigation:

```javascript
// web/src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Styling

- Use CSS Modules or plain CSS files per component
- Avoid inline styles except for dynamic values
- Use CSS variables for theming

```css
/* web/src/components/Button/Button.css */
.button {
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-primary);
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.button:hover {
  background: var(--color-primary-dark);
}
```

### Error Handling

Implement error boundaries for graceful failure:

```javascript
// web/src/components/ErrorBoundary.jsx
import { Component } from 'react';

export class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong: {this.state.error.message}</div>;
    }
    return this.props.children;
  }
}
```

### Key Requirements Summary

- Use functional components with hooks
- Centralize API calls in service modules
- Use custom hooks for data fetching
- Implement proper error handling with error boundaries
- Use React Context for global state
- Use React Router for navigation
- Keep components small and focused
- Use CSS Modules or scoped CSS for styling
