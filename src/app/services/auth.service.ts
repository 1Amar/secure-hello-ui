import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';

export interface UserInfo {
  username: string;
  email: string;
  name: string;
  picture?: string;
  provider: string;
}

export interface HelloResponse {
  message: string;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api';
  private authUrl = 'http://localhost:8080/auth';
  
  private currentUserSubject = new BehaviorSubject<UserInfo | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private keycloakService: KeycloakService
  ) {
    this.checkAuthenticationStatus();
  }

  // Check if user is authenticated (for both Google and Keycloak)
  private async checkAuthenticationStatus(): Promise<void> {
    try {
      // Check if authenticated via Keycloak
      if (this.keycloakService.isLoggedIn()) {
        const userInfo = await this.getUserInfo();
        this.currentUserSubject.next(userInfo);
        this.isAuthenticatedSubject.next(true);
        return;
      }
      
      // Check if authenticated via session (Google SSO)
      this.getUserInfo().then(userInfo => {
        if (userInfo && userInfo.username !== 'Anonymous') {
          this.currentUserSubject.next(userInfo);
          this.isAuthenticatedSubject.next(true);
        }
      }).catch(() => {
        this.isAuthenticatedSubject.next(false);
      });
    } catch (error) {
      console.error('Error checking authentication status:', error);
      this.isAuthenticatedSubject.next(false);
    }
  }

  // Login with Google (redirect to Spring Boot OAuth2 endpoint)
  // loginWithGoogle(): void {
  //   window.location.href = `${this.authUrl.replace('/auth', '')}/oauth2/authorization/google`;
  // }

  // Login with Keycloak
  async loginWithKeycloak(): Promise<void> {
    try {
      await this.keycloakService.login({
        redirectUri: window.location.origin + '/home'
      });
    } catch (error) {
      console.error('Keycloak login failed:', error);
    }
  }


async logout(): Promise<void> {
  try {
    if (this.keycloakService.isLoggedIn()) {
      // await this.keycloakService.logout(window.location.origin + '/logout');
      await this.keycloakService.logout(window.location.origin);
    }  } catch (error) {
    console.error('Logout failed:', error);
  } finally {
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }
}




  // Get user information
  async getUserInfo(): Promise<UserInfo> {
    try {
      let headers = new HttpHeaders();
      
      // Add Keycloak token if available
      if (this.keycloakService.isLoggedIn()) {
        const token = await this.keycloakService.getToken();
        headers = headers.set('Authorization', `Bearer ${token}`);
      }

      const userInfo = await this.http.get<UserInfo>(`${this.apiUrl}/user-info`, {
        headers,
        withCredentials: true
      }).toPromise();

      return userInfo || { username: 'Anonymous', email: '', name: '', provider: 'Unknown' };
    } catch (error) {
      console.error('Error fetching user info:', error);
      return { username: 'Anonymous', email: '', name: '', provider: 'Unknown' };
    }
  }

  // Get hello message (secured endpoint)
  async getHelloMessage(): Promise<HelloResponse> {
    try {
      let headers = new HttpHeaders();
      
      // Add Keycloak token if available
      if (this.keycloakService.isLoggedIn()) {
        const token = await this.keycloakService.getToken();
        headers = headers.set('Authorization', `Bearer ${token}`);
      }

      const response = await this.http.get<HelloResponse>(`${this.apiUrl}/hello`, {
        headers,
        withCredentials: true
      }).toPromise();

      return response || { message: 'Hello, World!', timestamp: Date.now() };
    } catch (error) {
      console.error('Error fetching hello message:', error);
      throw error;
    }
  }

  // Get public hello message
  getPublicHelloMessage(): Observable<HelloResponse> {
    return this.http.get<HelloResponse>(`${this.apiUrl}/public/hello`);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value || this.keycloakService.isLoggedIn();
  }

  // Get current user
  getCurrentUser(): UserInfo | null {
    return this.currentUserSubject.value;
  }

  //improvements 
  // Move hardcoded URLs to environment.ts in AuthService. From this file
}