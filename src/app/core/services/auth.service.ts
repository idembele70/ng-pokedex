import { computed, Injectable, signal } from '@angular/core';
import { AuthMode } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly _authMode = signal<AuthMode>('login');
  private readonly _authDialogVisibility = signal<boolean>(false);

  readonly isRegisteredMode = computed(() => this._authMode() === 'register');
  readonly isAuthDialogVisible = computed(() => this._authDialogVisibility());

  toggleAuthMode(): void {
    this._authMode.update(prev => prev === 'login' ? 'register' : 'login');
  }

  setAuthVisibility(state: boolean): void {
    this._authMode.set('login');
    this._authDialogVisibility.set(state);
  }
}
