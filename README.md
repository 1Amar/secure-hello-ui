# Secure Hello UI - Angular Frontend

## Overview
An Angular 17+ frontend application that integrates with Keycloak for OAuth2.0 authentication and communicates with a Spring Boot backend API. The application provides a secure user interface with authentication guards and user profile management.

## Authentication Flows 
![Security Diagram](login-flow.png)

## Features
- **Keycloak Integration**: Seamless authentication using keycloak-angular
- **Route Guards**: Protected routes with authentication checks
- **User Profile Management**: Display user information and profile pictures
- **Responsive Design**: Bootstrap-based responsive UI
- **JWT Token Handling**: Automatic token attachment to API requests
- **Session Management**: Handle login/logout flows

## Technology Stack
- **Framework**: Angular 17+ (Standalone Components)
- **Authentication**: Keycloak Angular Library
- **UI Framework**: Bootstrap 5
- **Icons**: Font Awesome
- **HTTP Client**: Angular HttpClient
- **Router**: Angular Router

## Prerequisites
- Node.js 18+ and npm
- Angular CLI 17+
- Keycloak server running on `http://localhost:8081`
- Spring Boot backend running on `http://localhost:8080`

## Installation

### 1. Clone and Install Dependencies
```bash
npm install
```

### 2. Install Required Packages
```bash
npm install keycloak-angular keycloak-js
npm install bootstrap @fortawesome/fontawesome-free
```

### 3. Configure Angular.json
Add Bootstrap and Font Awesome to your `angular.json`:
```json
"styles": [
  "node_modules/bootstrap/dist/css/bootstrap.min.css",
  "node_modules/@fortawesome/fontawesome-free/css/all.min.css",
  "src/styles.scss"
],
"scripts": [
  "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"
]
```

## Configuration

### Keycloak Client Setup
Ensure you have a Keycloak client configured:
- **Client ID**: `secure-hello-frontend`
- **Client Type**: Public
- **Valid Redirect URIs**: `http://localhost:4200/*`
- **Web Origins**: `http://localhost:4200`
- **Access Type**: Public

### Environment Configuration
Create/update `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  keycloak: {
    url: 'http://localhost:8081',
    realm: 'secure-hello-realm',
    clientId: 'secure-hello-frontend'
  },
  apiUrl: 'http://localhost:8080/api'
};
```

## Project Structure
```
src/app/
├── components/
│   ├── home/
│   │   ├── home.component.ts
│   │   ├── home.component.html
│   │   └── home.component.scss
│   └── profile/
│       ├── profile.component.ts
│       ├── profile.component.html
│       └── profile.component.scss
├── guards/
│   └── auth.guard.ts
├── services/
│   ├── auth.service.ts
│   └── keycloak-init.service.ts
├── app.component.ts
├── app.component.html
├── app.routes.ts
└── main.ts
```

## Key Components

### AuthService
Handles authentication logic:
- Keycloak integration
- User information management
- API communication with backend
- Authentication state management

### AuthGuard
Protects routes requiring authentication:
- Checks authentication status
- Redirects to Keycloak login if not authenticated
- Allows access to protected routes

### KeycloakInitService
Initializes Keycloak configuration:
- Configures Keycloak client
- Sets up authentication options
- Handles token interceptor

## Authentication Flow

### 1. Application Initialization
```typescript
// main.ts
bootstrapApplication(AppComponent, {
  providers: [
    // ... other providers
    {
      provide: APP_INITIALIZER,
      useFactory: (keycloakInitService: KeycloakInitService) => 
        () => keycloakInitService.init(),
      deps: [KeycloakInitService],
      multi: true
    }
  ]
});
```

### 2. Route Protection
```typescript
// app.routes.ts
const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./components/home/home.component'),
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./components/profile/profile.component'),
    canActivate: [AuthGuard]
  }
];
```

### 3. API Communication
```typescript
// Automatic token attachment
const token = await this.keycloakService.getToken();
const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
```

## Running the Application

### Development Server
```bash
ng serve
```
Navigate to `http://localhost:4200`

### Build for Production
```bash
ng build --prod
```

## Features in Detail

### User Authentication
- **Automatic Login**: Configured with `login-required` for immediate authentication
- **Token Management**: Automatic token refresh and attachment
- **Session Handling**: Proper logout and session cleanup

### User Interface
- **Responsive Navigation**: Bootstrap-based navigation with user profile
- **Profile Display**: Shows user avatar, name, and provider information
- **Protected Content**: Secured and public message display
- **Error Handling**: User-friendly error messages

### Security Features
- **Route Guards**: All protected routes require authentication
- **Token Interceptor**: Automatic token attachment to API requests
- **CORS Handling**: Configured for backend communication
- **Session Management**: Proper cleanup on logout

## API Integration

### Backend Endpoints Used
- `GET /api/hello` - Secured hello message
- `GET /api/user-info` - Current user information
- `GET /api/public/hello` - Public hello message

### Request Flow
1. User navigates to protected route
2. AuthGuard checks authentication
3. If not authenticated, redirects to Keycloak
4. On successful login, token is obtained
5. API requests include Bearer token
6. Backend validates token and returns data

## Customization

### Styling
- Bootstrap 5 classes used throughout
- Custom SCSS in component files
- Font Awesome icons for better UX

### Components
- **Standalone Components**: Using Angular 17+ standalone approach
- **Lazy Loading**: Routes are lazy-loaded for better performance
- **Reactive Forms**: Can be easily integrated for form handling

## Troubleshooting

### Common Issues

1. **Keycloak Connection Issues**
   - Verify Keycloak is running on `http://localhost:8081`
   - Check client configuration in Keycloak
   - Ensure redirect URIs are properly configured

2. **CORS Errors**
   - Verify backend CORS configuration
   - Check that frontend URL is allowed in backend

3. **Token Issues**
   - Check token expiration
   - Verify token format and claims
   - Ensure proper token attachment to requests

### Debug Mode
Enable debug logging in `KeycloakInitService`:
```typescript
initOptions: {
  onLoad: 'login-required',
  silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
  checkLoginIframe: false,
  flow: 'standard',
  // Add for debugging
  enableLogging: true
}
```

## Development Notes

### Future Enhancements
- Add refresh token handling
- Implement role-based UI components
- Add loading states and better error handling
- Implement user preferences storage
- Add internationalization (i18n)

### Best Practices Implemented
- Standalone components for better tree-shaking
- Lazy loading for performance
- Proper error handling
- Responsive design
- Clean separation of concerns

## Environment Variables
Move hardcoded URLs to environment configuration:
```typescript
// environment.ts
export const environment = {
  production: false,
  keycloakUrl: 'http://localhost:8081',
  apiUrl: 'http://localhost:8080/api',
  realm: 'secure-hello-realm',
  clientId: 'secure-hello-frontend'
};
```

## License
This project is for educational purposes.
