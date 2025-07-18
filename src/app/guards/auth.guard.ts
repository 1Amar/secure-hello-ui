import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    if (this.authService.isAuthenticated()) {
      return true;
    }

    // Redirect to Keycloak login
    await this.authService.loginWithKeycloak();
    return false;
  }
}