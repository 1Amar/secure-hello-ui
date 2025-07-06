# Secure Hello UI - Angular Application

![Angular](https://img.shields.io/badge/Angular-v17+-red)
![Keycloak](https://img.shields.io/badge/Keycloak-SSO-blue)
![OAuth2](https://img.shields.io/badge/OAuth2-Google-green)

Secure Hello UI is an Angular application that demonstrates secure authentication flows using Keycloak and Google OAuth2 with a Spring Boot backend.

## Table of Contents
1. [Features](#features)
2. [Project Structure](#project-structure)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Configuration](#configuration)
6. [Running the Application](#running-the-application)
7. [Authentication Flows](#authentication-flows)
8. [Key Components](#key-components)
9. [Security Features](#security-features)
10. [Deployment](#deployment)

## Features 
- Multi-provider authentication (Google OAuth2 + Keycloak)
- Protected routes with AuthGuard
- User profile management
- Secure API communication
- Silent SSO implementation
- Reactive state management
- Environment-specific configuration

## Project Structure <a name="project-structure"></a>

## Prerequisites <a name="prerequisites"></a>
- Node.js v18+
- Angular CLI v17+
- Keycloak server
- Spring Boot backend
- Google OAuth2 credentials

## Installation 
```bash
git clone https://github.com/yourusername/secure-hello-ui.git
cd secure-hello-ui
npm install
npm install keycloak-angular keycloak-js

Configuration <a name="configuration"></a>
Update environment.ts:
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  authUrl: 'http://localhost:8080/auth',
  keycloak: {
    url: 'http://localhost:8081',
    realm: 'secure-hello-realm',
    clientId: 'secure-hello-client'
  }
};

Configure Keycloak:

Realm: secure-hello-realm

Client: secure-hello-client (public access)

Redirect URIs: http://localhost:4200/*

Running the Application 

ng serve
Access at: http://localhost:4200

Authentication Flows 

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

