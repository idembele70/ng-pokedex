import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, switchMap, tap } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { POKEMON_API_PATHS_TOKEN } from '../config/pokemons-api-paths.config';
import { Pokemon } from '../models/pokemon.model';

@Injectable({
  providedIn: null,
})
export class PokemonLikeService {
  private readonly apiPathsUrl = inject(POKEMON_API_PATHS_TOKEN);
  private readonly http = inject(HttpClient);
  private readonly notificationService = inject(NotificationService);
  private readonly _likedIds = signal<Set<Pokemon['_id']>>(new Set);
  private readonly authService = inject(AuthService);

  readonly likedIds = computed(() => this._likedIds());

  constructor() {
    this.authService.isLoggedIn$.subscribe(
      (isLogged) => {
        if (isLogged) this.getAllLike();
      }
    )
  }

  toggleLike(pokemonId: Pokemon['_id']): void {
    if (this.likedIds().has(pokemonId)) {
      this.delete(pokemonId);
    } else {
      this.add(pokemonId);
    }
  }

  getAllLike(): void {
    this.http.get<Array<Pokemon['_id']>>(this.apiPathsUrl.LIKE).pipe(
      tap((ids) => this._likedIds.set(new Set(ids))),
      catchError(() => this.notificationService.notifyError('pokemons.getAllLike')),
    ).subscribe();
  }

  private add(pokemonId: Pokemon['_id']): void {
    const prefix = 'pokemons.notification.like'
    this.http.post<{ liked: boolean }>(`${this.apiPathsUrl.LIKE}/${pokemonId}`, {}).pipe(
      catchError(() => this.notificationService.notifyError(prefix)),
      switchMap(() => this.notificationService.notifySuccess(prefix)),
      tap(() => this.addToLikedIds(pokemonId))
    ).subscribe();
  }

  private delete(pokemonId: Pokemon['_id']): void {
    const prefix = 'pokemons.notification.dislike';
    this.http.delete(`${this.apiPathsUrl.LIKE}/${pokemonId}`).pipe(
      catchError(() => this.notificationService.notifyError(prefix)),
      switchMap(() => this.notificationService.notifySuccess(prefix)),
      tap(() => this.removeFromLikedIds(pokemonId)),
    ).subscribe()
  }

  private addToLikedIds(id: Pokemon['_id']): void {
    this._likedIds.update(prev => {
      const next = new Set(prev);
      next.add(id);
      return next
    })
  }
  private removeFromLikedIds(id: Pokemon['_id']): void {
    this._likedIds.update(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next
    })
  }
}
