import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';
import { environment } from '../../environments/environment';

export interface UserInfo {
  username: string;
  email: string;
  name: string;
  picture?: string;
  provider: string;
  roles: string[];
}

export interface HelloResponse {
  message: string;
  timestamp: number;
}

export interface AdminDashboard {
  title: string;
  description: string;
  timestamp: number;
  users: UserSummary[];
}

export interface UserSummary {
  username: string;
  email: string;
  name: string;
  roles: string[];
}

export interface AdminResponse {
  message: string;
  timestamp: number;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  name: string;
  password: '', // <-- add this
  roles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private authUrl = environment.authUrl;


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
        await this.keycloakService.logout(window.location.origin);
      }
    } catch (error) {
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

      return userInfo || { username: 'Anonymous', email: '', name: '', provider: 'Unknown', roles: [] };
    } catch (error) {
      console.error('Error fetching user info:', error);
      return { username: 'Anonymous', email: '', name: '', provider: 'Unknown', roles: [] };
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

  // Admin-only methods
  async getAdminDashboard(): Promise<AdminDashboard> {
    try {
      let headers = new HttpHeaders();

      if (this.keycloakService.isLoggedIn()) {
        const token = await this.keycloakService.getToken();
        headers = headers.set('Authorization', `Bearer ${token}`);
      }

      const response = await this.http.get<AdminDashboard>(`${this.apiUrl}/admin/dashboard`, {
        headers,
        withCredentials: true
      }).toPromise();

      return response || { title: 'Admin Dashboard', description: '', timestamp: Date.now(), users: [] };
    } catch (error) {
      console.error('Error fetching admin dashboard:', error);
      throw error;
    }
  }

  async getAllUsers(): Promise<UserSummary[]> {
    try {
      let headers = new HttpHeaders();

      if (this.keycloakService.isLoggedIn()) {
        const token = await this.keycloakService.getToken();
        headers = headers.set('Authorization', `Bearer ${token}`);
      }

      const response = await this.http.get<UserSummary[]>(`${this.apiUrl}/admin/users`, {
        headers,
        withCredentials: true
      }).toPromise();

      return response || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async createUser(userRequest: CreateUserRequest): Promise<AdminResponse> {
    try {
      let headers = new HttpHeaders();

      if (this.keycloakService.isLoggedIn()) {
        const token = await this.keycloakService.getToken();
        headers = headers.set('Authorization', `Bearer ${token}`);
      }

      const response = await this.http.post<AdminResponse>(`${this.apiUrl}/admin/users`, userRequest, {
        headers,
        withCredentials: true
      }).toPromise();

      return response || { message: 'User created', timestamp: Date.now() };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async deleteUser(username: string): Promise<AdminResponse> {
    try {
      let headers = new HttpHeaders();

      if (this.keycloakService.isLoggedIn()) {
        const token = await this.keycloakService.getToken();
        headers = headers.set('Authorization', `Bearer ${token}`);
      }

      const response = await this.http.delete<AdminResponse>(`${this.apiUrl}/admin/users/${username}`, {
        headers,
        withCredentials: true
      }).toPromise();

      return response || { message: 'User deleted', timestamp: Date.now() };
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // Role checking methods
  hasRole(role: string): boolean {
    const currentUser = this.currentUserSubject.value;
    if (!currentUser || !currentUser.roles) {
      return false;
    }
    return currentUser.roles.includes(`ROLE_${role.toUpperCase()}`) ||
      currentUser.roles.includes(role.toUpperCase());
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.some(role => this.hasRole(role));
  }

  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  isUser(): boolean {
    return this.hasRole('USER');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value || this.keycloakService.isLoggedIn();
  }

  // Get current user
  getCurrentUser(): UserInfo | null {
    return this.currentUserSubject.value;
  }
}