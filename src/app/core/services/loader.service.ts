import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private readonly _isLoadingMore = signal<boolean>(false);
  private readonly _isAuthenticating = signal<boolean>(false);
  private readonly _isLoading = signal<boolean>(true);
  private readonly _isSearching = signal<boolean>(false);
  private readonly _isTogglingLike = signal<boolean>(false);

  readonly isLoadingMore = computed(() => this._isLoadingMore());
  readonly isAuthenticating = computed(() => this._isAuthenticating());
  readonly isLoading = computed(() => this._isLoading());
  readonly isProcessing = computed(() => this._isLoadingMore() ||
    this._isAuthenticating() ||
    this._isLoading() ||
    this._isSearching() ||
    this._isTogglingLike()
  );
  readonly isSearching = computed(() => this._isSearching());
  readonly isTogglingLike = computed(() => this._isTogglingLike());
  readonly DURATION = 500;

  setIsLoading(state: boolean): void {
    this._isLoading.set(state);
  }

  setIsLoadingMore(state: boolean): void {
    this._isLoadingMore.set(state);
  }

  setIsAuthenticating(state: boolean): void {
    this._isAuthenticating.set(state);
  }

  setIsSearching(state: boolean): void {
    this._isSearching.set(state);
  }

  setIsTogglingLike(state: boolean): void {
    this._isTogglingLike.set(state);
  }
}
