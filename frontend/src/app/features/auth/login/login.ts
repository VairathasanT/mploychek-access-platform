import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth';
import { UserRole } from '../../../core/models/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  userId = '';
  password = '';
  role: UserRole = 'GENERAL_USER';
  showPassword = false;

  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.userId = '';
    this.password = '';
    this.role = 'GENERAL_USER';
    this.showPassword = false;
    this.loading = false;
    this.errorMessage = '';
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  login(): void {
    this.errorMessage = '';

    if (!this.userId || !this.password) {
      this.errorMessage = 'Please enter your User ID and password.';
      return;
    }

    this.loading = true;

    this.authService.login({
      userId: this.userId.trim(),
      password: this.password,
      role: this.role
    }).subscribe({
      next: (response) => {
        this.loading = false;

        if (response.success) {
          this.userId = '';
          this.password = '';
          this.router.navigate(['/dashboard']);
        } else {
          this.password = '';
          this.errorMessage = response.message;
        }
      },
      error: (error) => {
        this.loading = false;
        this.password = '';
        this.errorMessage =
          error?.error?.message || 'Login failed. Please try again.';
      }
    });
  }
}