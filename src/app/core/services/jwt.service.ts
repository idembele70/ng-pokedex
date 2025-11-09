import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  private readonly _storageKey = 'ng-pokedex_jwt-key';
  constructor() { }

  getToken(): string | null {
    return localStorage.getItem(this._storageKey);
  }

  saveToken(token: string): void {
    localStorage.setItem(this._storageKey, token);
  }

  destroyToken(): void {
    localStorage.removeItem(this._storageKey);
  }
}
