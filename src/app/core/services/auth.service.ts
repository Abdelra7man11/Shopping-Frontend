import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../models/user';
import { environment } from '../../environments/environment.development';
import { StorageService } from './StorageService';

interface LoginRequest {
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private storage = inject(StorageService);
  private apiUrl = `${environment.apiUrl}/Authentication`;

  private loggedIn = new BehaviorSubject<boolean>(!!this.getToken());
  isLoggedIn$ = this.loggedIn.asObservable();

  login(credentials: LoginRequest): Observable<IUser> {
    return this.http.post<IUser>(`${this.apiUrl}/login`, credentials).pipe(
      tap((user) => {
        if (user.token) {
          this.storage.setItem('token', user.token);
          this.storage.setItem('user', JSON.stringify(user));
          this.loggedIn.next(true);
        }
      })
    );
  }

  register(data: { email: string; password: string; displayName: string }) {
    return this.http.post<IUser>(`${this.apiUrl}/Register`, data).pipe(
      tap((user) => {
        if (user.token) {
          this.storage.setItem('token', user.token);
          this.storage.setItem('user', JSON.stringify(user));
          this.loggedIn.next(true);
        }
      })
    );
  }

  logout() {
    this.storage.removeItem('token');
    this.storage.removeItem('user');
    this.loggedIn.next(false);
  }

  getToken(): string | null {
    return this.storage.getItem('token');
  }

  getUser(): IUser | null {
    const stored = this.storage.getItem('user');
    return stored ? (JSON.parse(stored) as IUser) : null;
  }
}
