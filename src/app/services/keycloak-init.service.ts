import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root'
})
export class KeycloakInitService {

  constructor(private keycloakService: KeycloakService) { }

  async init(): Promise<boolean> {
    try {
      const isInitialized = await this.keycloakService.init({
        config: {
          url: 'http://localhost:8081',
          realm: 'secure-hello-realm',
          clientId: 'secure-hello-frontend'
        },
        initOptions: {
          // onLoad: 'check-sso',
          onLoad: 'login-required',  // ✅ forces redirect to Keycloak if not logged in
          silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
          checkLoginIframe: false,
          flow: 'standard'
        },
        enableBearerInterceptor: true,
        bearerExcludedUrls: ['/assets', '/public'],
        bearerPrefix: 'Bearer',
        loadUserProfileAtStartUp: true
      });

      console.log('Keycloak initialized successfully:', isInitialized);
      return isInitialized;
    } catch (error) {
      console.error('Failed to initialize Keycloak:', error);
      return false;
    }
  }
}