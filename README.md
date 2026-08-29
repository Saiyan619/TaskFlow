# Task Manager

A full-stack task manager with an Express/Drizzle/PostgreSQL backend and a React/Vite frontend.
    Live Preview - https://task-flow-gold-seven.vercel.app/

## Requirements

- Node.js 18 or newer
- npm
- PostgreSQL running locally or a reachable PostgreSQL database

## Project Structure

- `backend/`: Express API, Drizzle ORM, and PostgreSQL schema
- `frontend/`: React/Vite application

## Configuration

Create `backend/.env` with a PostgreSQL connection string:

```env
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/task_manager
```

Optional backend settings:

```env
PORT=3000
FRONTEND_URL=http://localhost:5173
```

`PORT` defaults to `3000`. `FRONTEND_URL` is used by the backend CORS configuration and defaults to `http://localhost:5173`.

Do not commit `.env` files. The repository ignores environment files, while `.env.example` files remain trackable.

## Install Dependencies

From the repository root:

```powershell
cd backend
npm install

cd ..\frontend
npm install
```

## Database Setup

Make sure PostgreSQL is running and the database named in `DATABASE_URL` exists. From `backend/`, apply the current Drizzle schema:

```powershell
npx drizzle-kit push
```

The task table contains:

- `id`
- `title`
- `description`
- `status`: `TODO`, `IN-PROGRESS`, or `COMPLETED`
- `priority`: `HIGH`, `MEDIUM`, or `LOW`
- `dueDate`
- `createdAt`

## Run the Application Locally

Use two terminals.

Backend terminal:

```powershell
cd backend
npm run dev
```

The API runs at `http://localhost:3000`.

Frontend terminal:

```powershell
cd frontend
npm run dev
```

Vite normally serves the frontend at `http://localhost:5173`. Open the URL shown by Vite in a browser.

The frontend task API currently points to the deployed backend at:

```text
https://taskflow-backend-u5ja.onrender.com/api/task
```

To test the frontend against the local backend, change `TASK_API_BASE_URL` in `frontend/src/features/tasks/api/tasks-api.ts` to:

```ts
http://localhost:3000/api/task
```

Make sure the backend is running before loading the frontend.

## Backend Commands

Run from `backend/`:

```powershell
npm run dev       # Start the development server with file watching
npm run build     # Compile TypeScript into backend/dist/
npm start         # Run the compiled backend
npx drizzle-kit push  # Apply the schema to the configured database
```

## Frontend Commands

Run from `frontend/`:

```powershell
npm run dev       # Start the Vite development server
npm run build     # Type-check and create the production frontend build
npm run lint      # Run ESLint
npm run preview   # Preview the production build
```

## API Routes

Base URL: `http://localhost:3000/api/task`

| Method | Route | Description |
| --- | --- | --- |
| `POST` | `/` | Create a task |
| `GET` | `/` | Get all tasks |
| `GET` | `/:id` | Get one task |
| `PATCH` | `/:id` | Partially update a task |
| `DELETE` | `/:id` | Delete a task |

Create and update requests use JSON. A task has a required `title`; `description`, `status`, `priority`, and `dueDate` are optional when creating a task. Updates may include any subset of editable fields.

Example create request:

```json
{
  "title": "Finish frontend integration",
  "description": "Connect the task list to the API",
  "status": "TODO",
  "priority": "HIGH",
  "dueDate": "2026-08-30T12:00:00.000Z"
}
```

## Verification

After starting the backend, check that the API responds:

```powershell
Invoke-WebRequest http://localhost:3000/api/task
```

Successful backend compilation:

```powershell
cd backend
npm run build
```

## Assumptions and Notable Decisions

- The backend uses PostgreSQL and Drizzle Kit's `push` workflow rather than a separately documented migration pipeline.
- The backend defaults to local development on port `3000`, and CORS allows the Vite development origin `http://localhost:5173`.
- The frontend currently uses a hard-coded deployed API URL in `tasks-api.ts`; the README documents the one-line change needed for local API testing instead of changing that existing deployment behavior.
- Task status and priority values are uppercase in the API. The frontend converts them to display-friendly lowercase values where needed.
- UUID task IDs are validated by the backend. Missing tasks return `404`; malformed IDs return `400`.
- There is currently no automated backend test suite. `backend/npm test` is still the placeholder command and is not a meaningful test run.
- Database credentials are expected to be supplied through environment variables and are intentionally not included in this README.
