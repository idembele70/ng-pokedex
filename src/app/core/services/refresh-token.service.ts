import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { API_PATHS_TOKEN } from '../config/api-paths.config';
import { RefreshTokenResponse } from '../models/auth.model';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root',
})
export class RefreshTokenService {
  private readonly http = inject(HttpClient);
  private readonly apiPaths = inject(API_PATHS_TOKEN);
  private readonly jwtService = inject(JwtService);

  refreshToken(): Observable<RefreshTokenResponse> {
    return this.http.get<RefreshTokenResponse>(this.apiPaths.AUTH.REFRESH_TOKEN).pipe(
      tap((accessToken) => {
        this.jwtService.saveToken(accessToken.accessToken);
      }),
    );
  }
}
