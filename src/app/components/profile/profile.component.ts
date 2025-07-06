import { Component, OnInit } from '@angular/core';
import { AuthService, UserInfo } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {
  currentUser: UserInfo | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  private async loadUserProfile(): Promise<void> {
    this.isLoading = true;
    this.error = null;

    try {
      this.currentUser = await this.authService.getUserInfo();
    } catch (error) {
      this.error = 'Failed to load user profile. Please try again.';
      console.error('Error loading user profile:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async refreshProfile(): Promise<void> {
    await this.loadUserProfile();
  }

  getProviderIcon(provider: string): string {
    switch (provider.toLowerCase()) {
      case 'google':
        return 'fab fa-google';
      case 'keycloak':
        return 'fas fa-key';
      default:
        return 'fas fa-user';
    }
  }

  getProviderColor(provider: string): string {
    switch (provider.toLowerCase()) {
      case 'google':
        return 'danger';
      case 'keycloak':
        return 'success';
      default:
        return 'primary';
    }
  }
}