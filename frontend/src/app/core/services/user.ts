import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User, UserRole } from '../models/user';
import { environment } from '../../../environments/environment';

export interface CreateUserRequest {
  userId: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserRequest {
  name: string;
  email: string;
  role: UserRole;
}

export interface UsersResponse {
  success: boolean;
  message: string;
  data: User[];
}

export interface UserResponse {
  success: boolean;
  message: string;
  data: User;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/users`;

  getUsers(): Observable<UsersResponse> {
    return this.http.get<UsersResponse>(this.apiUrl);
  }

  createUser(data: CreateUserRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(this.apiUrl, data);
  }

  updateUser(
    id: string,
    data: UpdateUserRequest
  ): Observable<UserResponse> {
    return this.http.put<UserResponse>(
      `${this.apiUrl}/${id}`,
      data
    );
  }

  deleteUser(id: string): Observable<UserResponse> {
    return this.http.delete<UserResponse>(
      `${this.apiUrl}/${id}`
    );
  }
}