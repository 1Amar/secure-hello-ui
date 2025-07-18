import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  AuthService, 
  UserInfo, 
  AdminDashboard, 
  UserSummary, 
  CreateUserRequest, 
  AdminResponse 
} from '../../services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  currentUser: UserInfo | null = null;
  dashboard: AdminDashboard | null = null;
  users: UserSummary[] = [];
  isLoading = false;
  error: string | null = null;
  successMessage: string | null = null;
  
  // Form for creating new user
  showCreateUserForm = false;
  newUser: CreateUserRequest = {
    username: '',
    email: '',
    name: '',
    password: '',
    roles: ['USER']
  };

  availableRoles = ['USER', 'ADMIN'];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadAdminData();
  }

  private loadUserData(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      
      // Redirect if user is not admin
      if (user && !this.authService.isAdmin()) {
        console.warn('User is not an admin, this should not happen due to route guard');
      }
    });
  }

  private async loadAdminData(): Promise<void> {
    this.isLoading = true;
    this.error = null;

    try {
      // Load dashboard data
      this.dashboard = await this.authService.getAdminDashboard();
      
      // Load users
      this.users = await this.authService.getAllUsers();
    } catch (error) {
      this.error = 'Failed to load admin data. Please try again.';
      console.error('Error loading admin data:', error);
    } finally {
      this.isLoading = false;
    }
  }

  formatTimestamp(timestamp: number): string {
    return new Date(timestamp).toLocaleString();
  }

  toggleCreateUserForm(): void {
    this.showCreateUserForm = !this.showCreateUserForm;
    if (!this.showCreateUserForm) {
      this.resetForm();
    }
  }

  private resetForm(): void {
    this.newUser = {
      username: '',
      email: '',
      name: '',
      password: '',
      roles: ['USER']
    };
    this.error = null;
    this.successMessage = null;
  }

  onRoleChange(role: string, checked: boolean): void {
    if (checked) {
      if (!this.newUser.roles.includes(role)) {
        this.newUser.roles.push(role);
      }
    } else {
      this.newUser.roles = this.newUser.roles.filter(r => r !== role);
    }
  }

  isRoleSelected(role: string): boolean {
    return this.newUser.roles.includes(role);
  }

  async createUser(): Promise<void> {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.successMessage = null;

    try {
      const response = await this.authService.createUser(this.newUser);
      this.successMessage = response.message;
      this.resetForm();
      this.showCreateUserForm = false;
      
      // Reload users list
      this.users = await this.authService.getAllUsers();
    } catch (error) {
      this.error = 'Failed to create user. Please try again.';
      console.error('Error creating user:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private validateForm(): boolean {
    if (!this.newUser.username.trim()) {
      this.error = 'Username is required';
      return false;
    }
    if (!this.newUser.email.trim()) {
      this.error = 'Email is required';
      return false;
    }
    if (!this.newUser.name.trim()) {
      this.error = 'Name is required';
      return false;
    }
    if (this.newUser.roles.length === 0) {
      this.error = 'At least one role must be selected';
      return false;
    }
    return true;
  }

  async deleteUser(username: string): Promise<void> {
    if (!confirm(`Are you sure you want to delete user "${username}"?`)) {
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.successMessage = null;

    try {
      const response = await this.authService.deleteUser(username);
      this.successMessage = response.message;
      
      // Reload users list
      this.users = await this.authService.getAllUsers();
    } catch (error) {
      this.error = 'Failed to delete user. Please try again.';
      console.error('Error deleting user:', error);
    } finally {
      this.isLoading = false;
    }
  }

  getRoleDisplayName(role: string): string {
    return role.replace('ROLE_', '');
  }

  getRoleBadgeClass(role: string): string {
    if (role.includes('ADMIN')) {
      return 'badge bg-danger';
    }
    return 'badge bg-primary';
  }
}