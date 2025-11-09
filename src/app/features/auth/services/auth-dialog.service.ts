import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, switchMap, tap } from 'rxjs';
import { API_PATHS } from '../../../core/constants/api-paths';
import { AuthService } from '../../../core/services/auth.service';
import { JwtService } from '../../../core/services/jwt.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthPayload, LoginResponse, RegisterResponse } from '../models/auth-dialog.model';

@Injectable()
export class AuthDialogService {
  constructor(
    private readonly http: HttpClient,
    private readonly notificationService: NotificationService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) { }

  register(payload: AuthPayload): Observable<RegisterResponse> {
    const prefix = 'auth.register';
    return this.http.post<RegisterResponse>(API_PATHS.AUTH.REGISTER, payload, {
      headers: this._headers,
    }).pipe(
      switchMap((resp) => {
        this.authService.toggleAuthMode();
        return this.notificationService.notifySuccess(prefix).pipe(
          map(() => resp),
        );
      }),
      catchError(() => this.notificationService.notifyError(prefix)),
    );
  }

  login(payload: AuthPayload): Observable<string> {
    const prefix = 'auth.login';
    return this.http.post<LoginResponse>(API_PATHS.AUTH.LOGIN, payload, {
      headers: this._headers,
    }).pipe(
      tap(({ accessToken, email, userId }) => {
        this.jwtService.saveToken(accessToken);
        this.authService.setCurrentUser({
          email,
          userId,
        });
        this.authService.setAuthVisibility(false);
      }),
      switchMap(() => this.notificationService.notifySuccess(prefix)),
      catchError(() => this.notificationService.notifyError(prefix)),
    );
  }

  private get _headers(): HttpHeaders {
    return new HttpHeaders()
      .set('content-type', 'application/json')
  }
}
