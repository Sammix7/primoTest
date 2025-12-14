# AGENTS.md

## Build/Lint/Test Commands

Do not execute any build or deploy commands as there is an hot deploy and autoreload in place.

## Code Style Guidelines

- **Imports**: Use standard TypeScript/JavaScript import syntax with proper module resolution
- **Formatting**: Prettier and ESLint for code formatting enforcement
- **Types**: Strict TypeScript typing with interfaces for function parameters and return values
- **Naming**: camelCase for variables and functions, PascalCase for components, kebab-case for file names
- **Error Handling**: Use try/catch blocks for async operations and validate input parameters
- **Components**: React functional components with TypeScript interfaces

## Existing Rules

### Copilot Instructions
- Serverless, stateless, independent functions
- Python backend only, JSON input/output objects
- Write unit and integration tests for each action
- Use specific annotation comments in \`__main__.py\`
- Each action has \`main\` function that receives JSON input and returns JSON output
- Follow package structure: \`packages/<package>/<name>/*.py\`
- Follow test structure: \`tests/<package>/test_<name>.py\` and \`tests/<package>/test_<name>_int.py\`
- Use approved libraries only: requests, openai, psycopg, boto3, pymilvus, redis
- Environment-based configuration management
- Web actions accessible via \`/api/my/{PACKAGE}/{ACTION}.{EXTENSION}\`


