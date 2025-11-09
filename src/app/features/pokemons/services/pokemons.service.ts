import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, tap } from 'rxjs';
import { LoaderService } from '../../../core/services/loader.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Pokemon, PokemonPage } from '../models/pokemon.model';

@Injectable()
export class PokemonsService {
  private readonly httpClient = inject(HttpClient);
  private readonly _BASE_PATHNAME = 'pokemons/search';
  private readonly _limitPerPage = signal(20);
  private readonly _currentPage = signal(1);
  private readonly _totalPages = signal(1);
  private readonly _currentPokemons = signal<Pokemon[]>([]);

  readonly currentPokemons = computed(() => this._currentPokemons());
  readonly isLastPage = computed(() => this._currentPage() >= this._totalPages());
  readonly limitPerPage = computed(() => this._limitPerPage());

  constructor(
    private readonly loaderService: LoaderService,
    private readonly notificationService: NotificationService,
  ) {
    this.fetchCurrentPage();
  }

  loadMorePokemons():void {
    if (!this.isLastPage()) {
      this._currentPage.update(prev => prev + 1);
      this.fetchCurrentPage();
    }
  }

  private get _params(): HttpParams {
    return new HttpParams()
      .set('page', this._currentPage())
      .set('limit', this._limitPerPage());
  }

  private fetchCurrentPage(): void {
    this.loaderService.setIsLoadingMore(true);
    this.httpClient.get<PokemonPage>(this._BASE_PATHNAME, {
      params: this._params
    }).pipe(
      tap((res) => {
        this._currentPokemons.update(prev => [...prev, ...res.pokemons]);
        this._currentPage.set(res.currentPage);
        this._totalPages.set(res.totalPages);
      }),
      catchError(() => this.notificationService.notifyError('pokemons.notification.fetchCurrentPage')),
      finalize(() => this.loaderService.setIsLoadingMore(false)),
    ).subscribe();
  }
}
