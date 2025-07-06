import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isLoading = false;
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Redirect if already authenticated
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/home']);
    }
  }

  async loginWithGoogle(): Promise<void> {
    this.isLoading = true;
    this.error = null;
    
    try {
      this.authService.loginWithGoogle();
    } catch (error) {
      this.error = 'Google login failed. Please try again.';
      console.error('Google login error:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async loginWithKeycloak(): Promise<void> {
    this.isLoading = true;
    this.error = null;
    
    try {
      await this.authService.loginWithKeycloak();
      this.router.navigate(['/home']);
    } catch (error) {
      this.error = 'Keycloak login failed. Please try again.';
      console.error('Keycloak login error:', error);
    } finally {
      this.isLoading = false;
    }
  }
}