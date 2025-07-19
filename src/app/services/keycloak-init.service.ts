import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KeycloakInitService {

  constructor(private keycloakService: KeycloakService) { }

  async init(): Promise<boolean> {
    try {
      const isInitialized = await this.keycloakService.init({
        // config: {
        //   url: 'http://localhost:8081',
        //   realm: 'secure-hello-realm',
        //   clientId: 'secure-hello-frontend'
        // },
        config: {
          url: environment.keycloak.url,
          realm: environment.keycloak.realm,
          clientId: environment.keycloak.clientId
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

      // ⏳ Start refresh loop
      this.startTokenRefresh();

      return isInitialized;
    } catch (error) {
      console.error('Failed to initialize Keycloak:', error);
      return false;
    }
  }

  private startTokenRefresh(): void {
    const refreshIntervalInSeconds = 10;

    setInterval(async () => {
      try {
        const refreshed = await this.keycloakService.updateToken(30); // refresh if token will expire in next 30s
        if (refreshed) {
          console.log('🔁 Token refreshed');
        }
      } catch (error) {
        console.warn('⚠️ Token refresh failed, logging out...');
        this.keycloakService.logout();
      }
    }, refreshIntervalInSeconds * 1000);
  }
}