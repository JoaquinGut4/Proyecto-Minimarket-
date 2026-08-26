import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { LoginResponse } from '../../compartido/modelos';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser: LoginResponse | null = null;
  private readonly STORAGE_KEY = 'kapaq_user';

  constructor(private api: ApiService) {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try { this.currentUser = JSON.parse(stored); } catch { this.clearSession(); }
    }
  }

  login(dni: string, password: string): Observable<LoginResponse> {
    return this.api.post<LoginResponse>('/encargados/login', { dni, password }).pipe(
      map(r => r.data),
      tap(user => {
        this.currentUser = user;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
      })
    );
  }

  logout(): void {
    this.clearSession();
  }

  getCurrentUser(): LoginResponse | null {
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  isAdmin(): boolean {
    return this.currentUser?.rol === 'ADMIN';
  }

  private clearSession(): void {
    this.currentUser = null;
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
