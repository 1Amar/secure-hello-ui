import { Component, OnInit } from '@angular/core';
import { AuthService, UserInfo, HelloResponse } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { AsyncPipe } from '@angular/common';  // For async pipe in template if needed

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  currentUser: UserInfo | null = null;
  helloMessage: HelloResponse | null = null;
  publicMessage: HelloResponse | null = null;
  isLoading = false;
  error: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadMessages();
  }

  private loadUserData(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  private async loadMessages(): Promise<void> {
    this.isLoading = true;
    this.error = null;

    try {
      // Load secured hello message
      this.helloMessage = await this.authService.getHelloMessage();
      
      // Load public hello message
      this.authService.getPublicHelloMessage().subscribe(
        response => {
          this.publicMessage = response;
        },
        error => {
          console.error('Error loading public message:', error);
        }
      );
    } catch (error) {
      this.error = 'Failed to load messages. Please try again.';
      console.error('Error loading messages:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async refreshMessages(): Promise<void> {
    await this.loadMessages();
  }

  formatTimestamp(timestamp: number): string {
    return new Date(timestamp).toLocaleString();
  }
}