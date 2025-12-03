import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, map, Observable, switchMap, tap, throwError } from 'rxjs';
import { API_PATHS_TOKEN } from '../config/api-paths.config';
import { AuthMode, CurrentUser } from '../models/auth.model';
import { JwtService } from './jwt.service';
import { NotificationService } from './notification.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly _authMode = signal<AuthMode>('login');
  private readonly _authDialogVisibility = signal<boolean>(false);
  private readonly http = inject(HttpClient);
  private readonly _currentUser = signal<CurrentUser | null>(null);
  private readonly jwtService = inject(JwtService);
  private readonly notificationService = inject(NotificationService);
  private readonly apiPaths = inject(API_PATHS_TOKEN);
  private readonly router = inject(Router);

  readonly isRegisteredMode = computed(() => this._authMode() === 'register');
  readonly isAuthDialogVisible = computed(() => this._authDialogVisibility());
  readonly isLoggedIn = computed(() => this._currentUser() !== null);
  readonly currentUser = computed(() => this._currentUser());
  readonly isLoggedIn$ = toObservable(this.isLoggedIn);

  toggleAuthMode(): void {
    this._authMode.update(prev => prev === 'login' ? 'register' : 'login');
  }

  setAuthVisibility(state: boolean): void {
    this._authMode.set('login');
    this._authDialogVisibility.set(state);
  }

  setCurrentUser(user: CurrentUser | null): void {
    this._currentUser.set(user);
  }

  initAuth(): Observable<CurrentUser> {
    return this.http.get<CurrentUser>(this.apiPaths.AUTH.ME).pipe(
      tap((user) => this.setCurrentUser(user))
    );
  }

  logout(): void {
    const prefix = 'auth.logout';
    this.http.get<{ message: string }>(this.apiPaths.AUTH.LOGOUT).pipe(
      switchMap((resp) => this.notificationService.notifySuccess(prefix)
        .pipe(map(() => resp)),
      ),
      catchError(() => {
        this.setAuthVisibility(true);
        return this.notificationService.notifyError(prefix);
      }),
      finalize(() => {
        this.jwtService.destroyToken();
        this.setCurrentUser(null);
        this.router.navigate(['home']);
      })
    ).subscribe();
  }
}
