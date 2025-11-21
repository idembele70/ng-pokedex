import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { catchError, filter, finalize, map, switchMap, tap } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { LIKE_API_PATHS_TOKEN } from '../config/like-api-paths.config';
import { Pokemon } from '../models/pokemon.model';
import { LoaderService } from '../../../core/services/loader.service';

@Injectable({
  providedIn: null,
})
export class PokemonLikeService {
  private readonly apiPathsUrl = inject(LIKE_API_PATHS_TOKEN);
  private readonly http = inject(HttpClient);
  private readonly notificationService = inject(NotificationService);
  private readonly _likedIds = signal<Set<Pokemon['_id']>>(new Set);
  private readonly authService = inject(AuthService);
  private readonly _currentUrl$ = inject(Router).events
    .pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(navEnd => navEnd['url']),
    );
  private readonly _currentUrl = toSignal(this._currentUrl$, { initialValue: '' });
  private readonly HIDE_CARD_ON_DISLIKE_URLS = ['/liked'];
  private readonly _dislikedIds = signal<Set<Pokemon['_id']>>(new Set);
  private readonly loaderService = inject(LoaderService);

  readonly likedIds = computed(() => this._likedIds());
  readonly dislikedIds = computed(() => this._dislikedIds());
  readonly dislikedIds$ = toObservable(this._dislikedIds);

  constructor() {
    this.authService.isLoggedIn$.subscribe(
      (isLogged) => {
        if (isLogged) this.getAllLike();
      }
    );
  }

  toggleLike(pokemonId: Pokemon['_id']): void {
    this.loaderService.setIsTogglingLike(true);
    if (this.likedIds().has(pokemonId)) {
      this.delete(pokemonId);
    } else {
      this.add(pokemonId);
    }
  }

  getAllLike(): void {
    this.http.get<Array<Pokemon['_id']>>(this.apiPathsUrl.GET_USER_LIKE_IDS).pipe(
      tap((ids) => this._likedIds.set(new Set(ids))),
      catchError(() => this.notificationService.notifyError('pokemons.getAllLike')),
    ).subscribe();
  }

  resetState() {
    this._dislikedIds.set(new Set);
  }

  private add(pokemonId: Pokemon['_id']): void {
    const prefix = 'pokemons.notification.like'
    this.http.post<{ liked: boolean }>(`${this.apiPathsUrl.GET_USER_LIKE_IDS}/${pokemonId}`, {}).pipe(
      catchError(() => this.notificationService.notifyError(prefix)),
      switchMap(() => this.notificationService.notifySuccess(prefix)),
      tap(() => this.addToLikedIds(pokemonId)),
      finalize(() => this.loaderService.setIsTogglingLike(false)),
    ).subscribe();
  }

  private delete(pokemonId: Pokemon['_id']): void {
    const prefix = 'pokemons.notification.dislike';
    this.http.delete(`${this.apiPathsUrl.TOGGLE_LIKE}/${pokemonId}`).pipe(
      catchError(() => this.notificationService.notifyError(prefix)),
      switchMap(() => this.notificationService.notifySuccess(prefix)),
      tap(() => {
        this.removeFromLikedIds(pokemonId);
        if (this.HIDE_CARD_ON_DISLIKE_URLS.includes(this._currentUrl())) {
          const next = new Set(this._dislikedIds());
          next.add(pokemonId);
          this._dislikedIds.set(next);
        }
      }),
      finalize(() => this.loaderService.setIsTogglingLike(false)),
    ).subscribe();
  }

  private addToLikedIds(id: Pokemon['_id']): void {
    this._likedIds.update(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    })
  }
  private removeFromLikedIds(id: Pokemon['_id']): void {
    this._likedIds.update(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    })
  }
}
