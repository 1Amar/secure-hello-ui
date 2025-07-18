import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    // First check if user is authenticated
    if (!this.authService.isAuthenticated()) {
      await this.authService.loginWithKeycloak();
      return false;
    }

    // Get required roles from route data
    const requiredRoles = route.data?.['roles'] as string[];
    
    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // No specific roles required
    }

    // Check if user has any of the required roles
    const hasRequiredRole = this.authService.hasAnyRole(requiredRoles);
    
    if (!hasRequiredRole) {
      // User doesn't have required role, redirect to home
      this.router.navigate(['/home']);
      return false;
    }

    return true;
  }
}