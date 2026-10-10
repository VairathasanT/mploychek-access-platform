import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';

import {
  UserService,
  CreateUserRequest,
  UpdateUserRequest
} from '../../../core/services/user';

import { User, UserRole } from '../../../core/models/user';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.css'
})
export class AdminUsers {
  private readonly userService = inject(UserService);
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly router = inject(Router);

  users: User[] = [];

  loading = true;
  saving = false;

  errorMessage = '';
  successMessage = '';

  showForm = false;
  editingUser: User | null = null;
  userPendingDeletion: User | null = null;
  deletingUserId: string | null = null;

  form = {
    userId: '',
    name: '',
    email: '',
    password: '',
    role: 'GENERAL_USER' as UserRole
  };

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.errorMessage = '';

    this.changeDetector.detectChanges();

    this.userService
      .getUsers()
      .pipe(
        finalize(() => {
          this.loading = false;
          this.changeDetector.detectChanges();
        })
      )
      .subscribe({
        next: (response) => {
          console.log('Users API response:', response);

          this.users = response.data ?? [];

          console.log('Users loaded:', this.users);

          this.changeDetector.detectChanges();
        },

        error: (error) => {
          console.error('Users API error:', error);

          this.errorMessage =
            error?.error?.message ||
            'Unable to load users.';

          this.changeDetector.detectChanges();
        }
      });
  }

  openAddForm(): void {
    this.editingUser = null;

    this.form = {
      userId: '',
      name: '',
      email: '',
      password: '',
      role: 'GENERAL_USER'
    };

    this.errorMessage = '';
    this.successMessage = '';
    this.showForm = true;

    this.changeDetector.detectChanges();
  }

  openEditForm(user: User): void {
    this.editingUser = user;

    this.form = {
      userId: user.userId,
      name: user.name,
      email: user.email,
      password: '',
      role: user.role
    };

    this.errorMessage = '';
    this.successMessage = '';
    this.showForm = true;

    this.changeDetector.detectChanges();
  }

  closeForm(): void {
    this.showForm = false;
    this.editingUser = null;
    this.errorMessage = '';

    this.changeDetector.detectChanges();
  }

  saveUser(): void {
  this.errorMessage = '';
  this.successMessage = '';

  if (!this.form.name.trim() || !this.form.email.trim()) {
    this.errorMessage = 'Name and email are required.';
    this.changeDetector.detectChanges();
    return;
  }

  // =========================
  // CREATE USER
  // =========================
  if (!this.editingUser) {
    if (!this.form.userId.trim() || !this.form.password) {
      this.errorMessage =
        'User ID and password are required for a new user.';
      this.changeDetector.detectChanges();
      return;
    }

    const data: CreateUserRequest = {
      userId: this.form.userId.trim(),
      name: this.form.name.trim(),
      email: this.form.email.trim(),
      password: this.form.password,
      role: this.form.role
    };

    this.saving = true;
    this.changeDetector.detectChanges();

    this.userService.createUser(data).subscribe({
      next: (response) => {
        console.log('Create user API response:', response);

        // Add returned user to the table immediately
        if (response.data) {
          this.users = [response.data, ...this.users];
        }

        this.successMessage =
          response.message || 'User created successfully.';

        // IMPORTANT: close form
        this.showForm = false;
        this.editingUser = null;

        // IMPORTANT: stop Saving...
        this.saving = false;

        // Reset form
        this.form = {
          userId: '',
          name: '',
          email: '',
          password: '',
          role: 'GENERAL_USER'
        };

        // IMPORTANT: force Angular UI update
        this.changeDetector.detectChanges();

        console.log('Create complete. Form closed.');
      },

      error: (error) => {
        console.error('Create user error:', error);

        this.errorMessage =
          error?.error?.message ||
          'Unable to create user.';

        this.saving = false;

        this.changeDetector.detectChanges();
      }
    });

    return;
  }

  // =========================
  // UPDATE USER
  // =========================
  const id =
    this.editingUser.id ||
    this.editingUser._id ||
    '';

  if (!id) {
    this.errorMessage = 'User ID is missing.';
    this.changeDetector.detectChanges();
    return;
  }

  const data: UpdateUserRequest = {
    name: this.form.name.trim(),
    email: this.form.email.trim(),
    role: this.form.role
  };

  this.saving = true;
  this.changeDetector.detectChanges();

  this.userService.updateUser(id, data).subscribe({
    next: (response) => {
      console.log('Update user API response:', response);

      if (response.data) {
        this.users = this.users.map((user) => {
          const userId = user.id || user._id;

          return userId === id
            ? response.data
            : user;
        });
      }

      this.successMessage =
        response.message || 'User updated successfully.';

      this.showForm = false;
      this.editingUser = null;
      this.saving = false;

      this.changeDetector.detectChanges();

      console.log('Update complete. Form closed.');
    },

    error: (error) => {
      console.error('Update user error:', error);

      this.errorMessage =
        error?.error?.message ||
        'Unable to update user.';

      this.saving = false;

      this.changeDetector.detectChanges();
    }
  });
}

  deleteUser(user: User): void {
    const userId = user.id || user._id;

    if (!userId) {
      this.errorMessage = 'User ID is missing.';
      this.changeDetector.detectChanges();
      return;
    }

    this.userPendingDeletion = user;
    this.errorMessage = '';
    this.successMessage = '';
    this.changeDetector.detectChanges();
  }

  cancelDelete(): void {
    this.userPendingDeletion = null;
  }

  confirmDelete(): void {
    const user = this.userPendingDeletion;
    const userId = user?.id || user?._id;

    if (!user || !userId || this.deletingUserId) {
      return;
    }

    this.deletingUserId = userId;
    this.errorMessage = '';
    this.successMessage = '';
    this.changeDetector.detectChanges();

    this.userService.deleteUser(userId).subscribe({
      next: (response) => {
        this.users = this.users.filter((item) => {
          const itemId = item.id || item._id;
          return itemId !== userId;
        });

        this.successMessage =
          response.message || 'User deleted successfully.';
        this.userPendingDeletion = null;
        this.deletingUserId = null;
        this.changeDetector.detectChanges();
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'Unable to delete user.';
        this.deletingUserId = null;
        this.changeDetector.detectChanges();
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}

  
