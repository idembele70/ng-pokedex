import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RefreshTokenResponse } from '../models/auth.model';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root'
})
export class RefreshTokenService {
  private readonly http = inject(HttpClient);
  private readonly _API_URL = `${environment.API_URL}auth/refresh`;
  private readonly jwtService = inject(JwtService);

  refreshToken(): Observable<RefreshTokenResponse> {
    return this.http.get<RefreshTokenResponse>(this._API_URL, {
      withCredentials: true,
    }).pipe(
      tap((accessToken) => {
        this.jwtService.saveToken(accessToken.accessToken);
      }),
    );
  }
}
