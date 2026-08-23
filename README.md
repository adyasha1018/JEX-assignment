# JEX Assignment - Company & Vacancy Management System

A modern Angular 22 application for managing companies and job vacancies. This full-stack project demonstrates best practices in Angular development including component-based architecture, reactive forms, services, routing, and testing.

## 📋 Project Overview

JEX Assignment is a web application for managing companies and their job vacancies. The application has specific visibility rules:

- **Companies**: Only visible in the main list if they have associated vacancies. Users can add new companies, edit, and delete existing ones. New companies without vacancies won't appear in the main company list.
- **Vacancies**: Users can view all vacancies in a centralized list and add new ones, but cannot edit or delete existing vacancies.
- **Organization**: Vacancies are linked to specific companies, allowing users to view which vacancies belong to which company.

### Key Features
- 📱 Responsive UI with Angular components
- 🔄 Reactive forms for data input
- 🗂️ Modular architecture with feature-based organization
- 🧪 Comprehensive unit testing setup with Vitest
- 📝 Code quality tools (ESLint, Prettier)
- 🚀 Server-Side Rendering (SSR) support
- 📡 Mock data API with JSON Server

## 🏗️ Project Structure

```
src/
├── app/
│   ├── core/                    # Core app logic (non-shared)
│   │   ├── models/              # Data models/interfaces
│   │   │   ├── company.model.ts
│   │   │   └── vacancy.model.ts
│   │   └── services/            # Core services
│   │       ├── company.service.ts
│   │       └── vacancy.service.ts
│   │
│   ├── features/                # Feature modules (lazy-loaded)
│   │   ├── companies/           # Company management
│   │   │   ├── company-list/    # List all companies
│   │   │   ├── company-form/    # Create/edit company
│   │   │   └── company-vacancies/ # View vacancies for a company
│   │   │
│   │   └── vacancies/           # Vacancy management
│   │       ├── vacancy-list/    # List all vacancies
│   │       └── vacancy-form/    # Create/edit vacancy
│   │
│   ├── shared/                  # Shared components & utilities
│   │   ├── components/          # Reusable UI components
│   │   └── styles/              # Global styles and design tokens
│   │
│   ├── app.component.ts         # Root component
│   ├── app.routes.ts            # Route configuration
│   └── app.config.ts            # App configuration
│
├── assets/
│   └── mock/                    # Mock data for development
│       └── mockData.json
│
└── public/                      # Static files

```

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v20 or higher
- **npm**: v11 or higher
- **Angular CLI**: v22 or higher (optional, use `npm run ng` instead)

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd JEX-assignment
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### Development Server

Start the development server with automatic reload:

```bash
npm start
```

The application will be available at `http://localhost:4200/`

**Note**: For full functionality, run the mock API in a separate terminal:
```bash
npm run api
```

The API will be available at `http://localhost:3000/`

## 📚 Available Commands

### Development
| Command | Description |
|---------|-------------|
| `npm start` | Start the development server (ng serve) |
| `npm run api` | Start the mock JSON-server API on port 3000 |
| `npm run build` | Build the project for production |
| `npm run watch` | Build in watch mode with development configuration |

### Testing & Quality
| Command | Description |
|---------|-------------|
| `npm test` | Run unit tests with Vitest |
| `npm run lint` | Check code with ESLint |
| `npm run lint:fix` | Fix linting issues automatically |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting without changes |

### Server-Side Rendering
| Command | Description |
|---------|-------------|
| `npm run serve:ssr:JEX-assignment` | Serve the SSR build locally |

## 🧪 Testing

### Running Unit Tests
```bash
npm test
```

Tests are written using [Vitest](https://vitest.dev/) and are located alongside components with the `.spec.ts` extension.

### Key Test Files
- `src/app/core/services/company.service.spec.ts`
- `src/app/core/services/vacancy.service.spec.ts`
- `src/app/features/companies/*/*.spec.ts`
- `src/app/features/vacancies/*/*.spec.ts`

## 🎨 Code Quality

### ESLint
Check code for quality issues:
```bash
npm run lint
```

Automatically fix linting issues:
```bash
npm run lint:fix
```

### Prettier
Format code consistently:
```bash
npm run format
```

Verify formatting without changes:
```bash
npm run format:check
```

## 🔨 Building for Production

Build the application for deployment:
```bash
npm build
```

Build artifacts will be stored in the `dist/` directory. The production build optimizes the application for performance and speed.

## 📱 Features in Detail

### Companies Management
- **List Companies** (`/companies`): View all companies that have associated vacancies. Companies without vacancies will not appear in this list.
- **Create Company** (`/companies/new`): Add a new company. Note: The company will only appear in the main list once it has at least one vacancy assigned to it.
- **Edit Company** (`/companies/:companyId/edit`): Update existing company details
- **Delete Company** (`/companies/:companyId`): Remove a company from the system
- **View Company Vacancies** (`/companies/:companyId/vacancies`): See all vacancies associated with a specific company

**Company Model:**
```typescript
interface Company {
  id: string;
  name: string;
  address: string;
}
```

### Vacancies Management
- **List Vacancies** (`/vacancies`): Browse all job vacancies in one centralized location (view-only for existing vacancies)
- **Create Vacancy** (`/vacancies/new` or `/companies/:companyId/vacancies/new`): Post a new job vacancy
- **Note**: Existing vacancies cannot be edited or deleted - they are read-only after creation

**Vacancy Model:**
```typescript
interface Vacancy {
  id: string;
  title: string;
  description: string;
  companyId: string;
}
```

## 🔄 Data Flow

1. **API Requests**: Services communicate with the mock JSON-server API
2. **State Management**: Services use RxJS for reactive data streams
3. **Component Binding**: Components subscribe to services and update the UI reactively
4. **Form Handling**: Reactive forms for data validation and submission

## 🛠️ Technology Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Angular | 22.1.0 | Framework |
| TypeScript | 6.0.2 | Language |
| RxJS | 7.8.0 | Reactive programming |
| Angular Forms | 22.1.0 | Form management |
| Angular Router | 22.1.0 | Routing |
| Angular SSR | 22.1.5 | Server-side rendering |
| Vitest | 4.0.8 | Unit testing |
| ESLint | 10.9.0 | Code linting |
| Prettier | 3.8.1 | Code formatting |
| SCSS | Built-in | Styling |
| Express | 5.1.0 | SSR server |
| JSON Server | 1.0.0-beta.15 | Mock API |

## 📡 Mock Data API

The project uses JSON Server to mock a backend API. Mock data is stored in:
```
src/assets/mock/mockData.json
```

Start the API server:
```bash
npm run api
```

Access the API at `http://localhost:3000/`

**Available Endpoints:**
- `GET /companies` - List all companies
- `GET /companies/:id` - Get company details
- `POST /companies` - Create a company
- `PUT /companies/:id` - Update a company
- `DELETE /companies/:id` - Delete a company
- `GET /vacancies` - List all vacancies
- `GET /vacancies/:id` - Get vacancy details
- `POST /vacancies` - Create a vacancy
- `PUT /vacancies/:id` - Update a vacancy
- `DELETE /vacancies/:id` - Delete a vacancy

## 🔍 Angular CLI Features

### Generate Components
```bash
npm run ng generate component features/companies/my-component
```

### Generate Services
```bash
npm run ng generate service core/services/my-service
```

### For More Schematics
```bash
npm run ng generate --help
```

## 📚 Additional Resources

- [Angular Official Documentation](https://angular.dev)
- [Angular CLI Overview](https://angular.dev/tools/cli)
- [Vitest Documentation](https://vitest.dev/)
- [ESLint Documentation](https://eslint.org/)
- [Prettier Documentation](https://prettier.io/)
- [RxJS Documentation](https://rxjs.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

## 🤝 Contributing

When contributing to this project:

1. **Follow the existing code style** - Use `npm run format` to ensure consistency
2. **Write tests for new features** - Use Vitest
3. **Lint your code** - Run `npm run lint:fix` before committing
4. **Keep components modular** - Follow the feature-based architecture
5. **Document complex logic** - Add comments and JSDoc where appropriate

## 📝 License

This project is provided as-is for educational and assignment purposes.

## ❓ Troubleshooting

### Application won't start
- Ensure Node.js v20+ and npm v11+ are installed
- Delete `node_modules` and run `npm install` again
- Check that port 4200 is not in use

### API errors in development
- Ensure the JSON Server is running (`npm run api`)
- Verify the API is accessible at `http://localhost:3000/`
- Check the mock data file at `src/assets/mock/mockData.json`

### Tests failing
- Clear cache: `npm test -- --clearCache`
- Ensure all dependencies are installed correctly

### Formatting or linting issues
- Auto-fix with: `npm run lint:fix` and `npm run format`
