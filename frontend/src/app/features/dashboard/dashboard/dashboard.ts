import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthService } from '../../../core/services/auth';
import { RecordService } from '../../../core/services/record';
import { User } from '../../../core/models/user';
import { Record } from '../../../core/models/record';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  private readonly authService = inject(AuthService);
  private readonly recordService = inject(RecordService);
  private readonly router = inject(Router);
  private readonly changeDetector = inject(ChangeDetectorRef);

  user: User | null = this.authService.getUser();

  records: Record[] = [];
  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadRecords();
  }

  loadRecords(): void {
    this.loading = true;
    this.errorMessage = '';

    this.recordService
      .getRecords(2000)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.changeDetector.detectChanges();
        })
      )
      .subscribe({
        next: (response) => {
          console.log('RECORDS RESPONSE:', response);

          this.records = response.data || [];

          console.log('RECORDS ARRAY:', this.records);
          console.log('RECORD COUNT:', this.records.length);

          this.changeDetector.detectChanges();
        },

        error: (error) => {
          console.error('RECORDS ERROR:', error);

          this.errorMessage =
            error?.error?.message ||
            'Unable to load records. Please try again.';

          this.changeDetector.detectChanges();
        }
      });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  openUserManagement(): void {
  this.router.navigate(['/admin/users']);
}
}