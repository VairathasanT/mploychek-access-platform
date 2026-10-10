import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Record } from '../models/record';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecordService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/records`;
  
  getRecords(delay = 2000): Observable<{
    success: boolean;
    message: string;
    meta: {
      role: string;
      delay: number;
      count: number;
    };
    data: Record[];
  }> {
    return this.http.get<{
      success: boolean;
      message: string;
      meta: {
        role: string;
        delay: number;
        count: number;
      };
      data: Record[];
    }>(`${this.apiUrl}?delay=${delay}`);
  }
}