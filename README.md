# Secure Hello UI

This project is an Angular application that demonstrates secure authentication and message retrieval using a Keycloak-based authentication system. It features a simple UI with login, profile, and home components, and interacts with a backend to fetch both public and secured messages.

## Features
- User authentication with Keycloak
- Protected routes using Angular guards
- Fetching secured and public messages from backend services
- User profile display
- Modular Angular structure with standalone components

## Project Structure
```
secure-hello-ui/
├── angular.json
├── package.json
├── README.md
├── tsconfig*.json
├── public/
├── src/
│   ├── index.html
│   ├── main.ts
│   ├── styles.scss
│   └── app/
│       ├── app-routing.module.ts
│       ├── app.component.*
│       ├── app.module.ts
│       ├── components/
│       │   ├── home/
│       │   ├── login/
│       │   └── profile/
│       ├── guards/
│       ├── services/
│       └── environments/
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- npm (v8 or higher)
- Angular CLI (optional, for development)

### Installation
1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd secure-hello-ui
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

### Running the Application
Start the development server:
```sh
npm start
```
The app will be available at `http://localhost:4200/` by default.

### Running Tests
To execute unit tests:
```sh
npm test
```

## Authentication
This project uses Keycloak for authentication. Make sure your Keycloak server is running and the configuration in `keycloak-init.service.ts` matches your environment.

## Project Structure Overview
- `src/app/components/` — Contains feature components (home, login, profile)
- `src/app/services/` — Contains authentication and API service logic
- `src/app/guards/` — Contains route guards for protected routes
- `src/assets/` — Static assets
- `src/environments/` — Environment-specific configuration

## Customization
- Update Keycloak settings in `keycloak-init.service.ts` as needed.
- Modify styles in `src/styles.scss` or component-specific SCSS files.

## License
This project is licensed under the MIT License.
