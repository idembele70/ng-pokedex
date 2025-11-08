import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private readonly _isLoadingMore = signal<boolean>(false);
  private readonly _isAuthenticating = signal<boolean>(false);

  readonly isLoading = signal<boolean>(true);
  readonly isLoadingMore = computed(() => this._isLoadingMore());
  readonly isAuthenticating = computed(() => this._isAuthenticating());
  readonly DURATION = 500;

  setIsLoadingMore(state: boolean): void {
    this._isLoadingMore.set(state);
  }

  setIsAuthenticating(state: boolean): void {
    this._isAuthenticating.set(state);
  }
}
