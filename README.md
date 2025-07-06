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
