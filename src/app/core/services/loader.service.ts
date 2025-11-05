import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private readonly _isLoadingMore = signal<boolean>(false);

  readonly isLoading = signal<boolean>(true);
  readonly isLoadingMore = computed(() => this._isLoadingMore());
  readonly DURATION = 500;

  setIsLoadingMore(state: boolean): void {
    this._isLoadingMore.set(state);
  }
}
