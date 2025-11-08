import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, switchMap, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { authPayload, RegisterResponse } from '../models/auth-dialog.model';

@Injectable()
export class AuthDialogService {
  private readonly _BASE_URL = `${environment.API_URL}/auth`;

  constructor(
    private readonly http: HttpClient,
    private readonly notificationService: NotificationService,
    private readonly authService: AuthService,
  ) { }

  register(payload: authPayload): Observable<RegisterResponse> {
    const prefix = 'auth.register';
    return this.http.post<RegisterResponse>(`${this._BASE_URL}/register`, payload, {
      headers: this._headers,
    }).pipe(
      switchMap(() => this.notificationService.notifySuccess(prefix)),
      tap(() => this.authService.toggleAuthMode()),
      catchError(() => this.notificationService.notifyError(prefix)),
    );
  }

  private get _headers(): HttpHeaders {
    return new HttpHeaders()
      .set('content-type', 'application/json')
  }
}
