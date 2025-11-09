import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthMode, CurrentUser } from '../models/auth.model';
import { JwtService } from './jwt.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly _authMode = signal<AuthMode>('login');
  private readonly _authDialogVisibility = signal<boolean>(false);
  private readonly http = inject(HttpClient);
  private readonly _BASE_PATHNAME = 'auth';
  private readonly _currentUser = signal<CurrentUser | null>(null);
  private readonly jwtService = inject(JwtService);
  private readonly notificationService = inject(NotificationService);

  readonly isRegisteredMode = computed(() => this._authMode() === 'register');
  readonly isAuthDialogVisible = computed(() => this._authDialogVisibility());
  readonly isLoggedIn = computed(() => !!this._currentUser());
  readonly currentUser = computed(() => this._currentUser());

  toggleAuthMode(): void {
    this._authMode.update(prev => prev === 'login' ? 'register' : 'login');
  }

  setAuthVisibility(state: boolean): void {
    this._authMode.set('login');
    this._authDialogVisibility.set(state);
  }

  setCurrentUser(user: CurrentUser): void {
    this._currentUser.set(user);
  }

  initAuth(): void {
    if (!this.jwtService.getToken()) return;

    this.http.get<CurrentUser>(`${this._BASE_PATHNAME}/me`).pipe(
      catchError((err) => {
        if (err.url?.includes('auth/refresh')) {
          this.jwtService.destroyToken();
          this.setAuthVisibility(true);
          return this.notificationService.notifyError('auth.jwt.refreshToken');
        }
        return throwError(() => err);
      }),
    )
      .subscribe((user) => this._currentUser.set(user));
  }
}
