import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  private readonly _storageKey = 'ng-pokedex_jwt-key';
  constructor() { }

  getToken(): string | null {
    return sessionStorage.getItem(this._storageKey);
  }

  saveToken(token: string): void {
    sessionStorage.setItem(this._storageKey, token);
  }

  destroyToken(): void {
    sessionStorage.removeItem(this._storageKey);
  }
}
