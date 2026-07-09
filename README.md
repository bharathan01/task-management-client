# Task Board Client

A modern task management application built with **Angular 18** and **Angular Material**. Features a Kanban board with drag-and-drop, a filterable task list with server-side pagination, and a dashboard with live summary statistics.

## Tech Stack

| Layer         | Technology                                           |
|---------------|------------------------------------------------------|
| Framework     | Angular 18 (Standalone Components)                   |
| UI Library    | Angular Material 18 (Azure Blue theme)               |
| Drag & Drop   | Angular CDK `DragDropModule`                        |
| Language      | TypeScript 5.5                                       |
| HTTP          | Angular `HttpClient` with JWT Auth Interceptor       |
| Forms         | Reactive Forms (`FormGroup`, `Validators`)           |
| Routing       | Angular Router with `AuthGuard`                      |
| Styling       | Vanilla CSS (component-scoped)                       |
| Package Mgr   | npm                                                  |

## Features

- **Authentication** — JWT-based login with token stored in `localStorage`
- **Route Guard** — Protected routes redirect unauthenticated users to login
- **Dashboard** — Summary cards showing task counts and total story points
- **Task List** — Server-side paginated table with status, priority, and title filters (500ms debounced search)
- **Kanban Board** — Drag-and-drop columns (Backlog → Planned → In Progress → Completed) with daily/weekly capacity validation
- **Task CRUD** — Create, view details, edit, and delete tasks via modal dialogs
- **Settings** — Configure daily and weekly story point limits
- **Profile & Logout** — Header dropdown showing user profile with logout confirmation

## Project Structure

```
src/app/
├── core/
│   ├── constants/         # API endpoints, sidebar menu config, task constants
│   ├── guards/            # AuthGuard for route protection
│   ├── helpers/           # Token helper (get/set/remove from localStorage)
│   ├── interceptors/      # JWT auth interceptor (auto-attaches Bearer token)
│   ├── interfaces/        # TypeScript interfaces (Task, Auth, Dashboard, Settings)
│   └── services/          # API services (Auth, Task, Dashboard, Settings)
├── features/
│   ├── auth/              # Login page
│   ├── dashboard/         # Dashboard summary page
│   ├── kanban/            # Kanban board with drag-and-drop
│   ├── settings/          # Settings page (daily/weekly SP limits)
│   └── tasks/             # Task list page with filters and pagination
├── layouts/               # Main layout (sidebar + header + content)
├── shared/
│   └── components/        # Reusable components
│       ├── confirm-dialog/    # Confirmation modal (used for delete/logout)
│       ├── header/            # App header with profile dropdown
│       ├── sidebar/           # Navigation sidebar
│       ├── task-dialog/       # Create/Edit task modal
│       └── task-view-dialog/  # Task detail view modal
├── app.config.ts          # App providers (router, HTTP, animations)
└── app.routes.ts          # Route definitions
```

## API Endpoints

The app communicates with a REST backend. All endpoints are centralized in [`src/app/core/constants/endpoints.ts`](src/app/core/constants/endpoints.ts):

| Method  | Endpoint                | Description                |
|---------|-------------------------|----------------------------|
| POST    | `/auth/login`           | User login                 |
| GET     | `/auth/profile`         | Get current user profile   |
| GET     | `/dashboard/summary`    | Dashboard statistics       |
| GET     | `/settings`             | Get SP limit settings      |
| PUT     | `/settings`             | Update SP limit settings   |
| GET     | `/tasks`                | List tasks (paginated)     |
| GET     | `/tasks/:id`            | Get single task            |
| POST    | `/tasks`                | Create a task              |
| PUT     | `/tasks/:id`            | Update a task              |
| PATCH   | `/tasks/:id/status`     | Update task status only    |
| DELETE  | `/tasks/:id`            | Delete a task              |

## Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- **Angular CLI** ≥ 18.x (`npm install -g @angular/cli`)
- A running instance of the [Task Manager Server](../task-manager-server) backend on `http://localhost:5000`

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd task-board-client
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Copy the environment template and set your backend API URL:

```bash
# Copy the example environment file
cp src/environments/environment.example.ts src/environments/environment.ts
```

Then edit `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api/v1'
};
```

You can also create a `.env` file in the project root for reference:

```
API_URL=http://localhost:5000/api/v1
```

### 4. Start the development server

```bash
npm start
```

The app will be available at **http://localhost:4200**.

### 5. Build for production

```bash
npm run build
```

The production bundle will be output to `dist/task-board-client/`.

## Environment Variables

| Variable   | Description             | Default                            |
|------------|-------------------------|------------------------------------|
| `API_URL`  | Backend API base URL    | `http://localhost:5000/api/v1`     |

## Available Scripts

| Command         | Description                                      |
|-----------------|--------------------------------------------------|
| `npm start`     | Start dev server at `http://localhost:4200`       |
| `npm run build` | Build production bundle to `dist/`               |
| `npm run watch` | Build in watch mode for development              |
| `npm test`      | Run unit tests via Karma                         |

## License

This project is private and not licensed for public distribution.
