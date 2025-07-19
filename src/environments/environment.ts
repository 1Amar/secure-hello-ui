export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  authUrl: 'http://localhost:8080/auth',
  keycloak: {
    url: 'http://localhost:8081',
    realm: 'secure-hello-realm',
    clientId: 'secure-hello-frontend'
  }
};