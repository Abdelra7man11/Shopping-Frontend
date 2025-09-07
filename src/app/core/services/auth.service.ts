import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { IUser } from '../models/user';
import { IAddress } from '../models/address';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/Authentication`;

  constructor(
    private http: HttpClient,
    private _localStorage: LocalStorageService
  ) {}
  // Login
  login(credentials: { email: string; password: string }) {
    return this.http.post<IUser>(`${this.apiUrl}/Login`, credentials).pipe(
      tap((user) => {
        console.log('User from backend:', user);
        this._localStorage.set('token', user.token);
        this._localStorage.set('email', user.email);
        this._localStorage.set('displayName', user.displayName);
      })
    );
  }

  // Register
  register(data: { email: string; password: string; displayName: string }) {
    return this.http.post<IUser>(`${this.apiUrl}/Register`, data).pipe(
      tap((user) => {
        console.log('Registered user:', user);
        this._localStorage.set('token', user.token);
        this._localStorage.set('email', user.email);
        this._localStorage.set('displayName', user.displayName);
      })
    );
  }
  // Check Email
  checkEmail(email: string) {
    return this.http.get<boolean>(`${this.apiUrl}/emailexists?Email=${email}`);
  }

  // Get current user
  getCurrentUser() {
    return this.http.get<IUser>(`${this.apiUrl}/CurrentUser`);
  }

  // Get current user address
  getCurrentUserAddress() {
    return this.http.get<IAddress>(`${this.apiUrl}/Address`);
  }

  // Update current user address
  updateCurrentUserAddress(address: IAddress) {
    return this.http.put<IAddress>(`${this.apiUrl}/Address`, address);
  }

  logout() {
    localStorage.removeItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  get(key: string) {
    let localStorage = this.getLocalStorage();
    localStorage.getItem(key);
  }

  set(key: string, value: string) {
    let localStorage = this.getLocalStorage();
    localStorage.setItem(key, value);
  }

  private getLocalStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage;
    }
    throw new Error('No Local Storage Provided.');
  }
}
