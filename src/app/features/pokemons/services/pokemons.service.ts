import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, delay, finalize, tap } from 'rxjs';
import { LoaderService } from '../../../core/services/loader.service';
import { NotificationService } from '../../../core/services/notification.service';
import { POKEMON_API_PATHS_TOKEN } from '../config/pokemons-api-paths.config';
import { Pokemon, PokemonFilter, PokemonFilterKeys, PokemonPage } from '../models/pokemon.model';

@Injectable()
export class PokemonsService {
  private readonly httpClient = inject(HttpClient);
  private readonly pokemonApiPaths = inject(POKEMON_API_PATHS_TOKEN);
  private readonly _limitPerPage = signal(20);
  private readonly _currentPage = signal(1);
  private readonly _totalPages = signal(1);
  private readonly _currentPokemons = signal<Pokemon[]>([]);
  private readonly _pokemonFilters = signal<PokemonFilter>({});
  private readonly FILTER_DELAY = 100;

  readonly currentPokemons = computed(() => this._currentPokemons());
  readonly isLastPage = computed(() => this._currentPage() >= this._totalPages());
  readonly limitPerPage = computed(() => this._limitPerPage());
  readonly isFiltering = computed(() =>
    this._currentPokemons().length === 0 &&
    !this._isFilterEmpty
  );
  readonly isCurrentPokemonsEmpty = computed(() =>
    this._isFilterEmpty &&
    this._currentPokemons().length === 0
  );


  constructor(
    private readonly loaderService: LoaderService,
    private readonly notificationService: NotificationService,
  ) {
    this.fetchCurrentPage();
  }

  loadMorePokemons(): void {
    if (!this.isLastPage()) {
      this._currentPage.update(prev => prev + 1);
      this.fetchCurrentPage();
    }
  }

  setPokemonFilters(newFilters: PokemonFilter): void {
    this._pokemonFilters.set(newFilters);
  }

  filterPokemon(): void {
    this.httpClient.get<PokemonPage>(this.pokemonApiPaths.SEARCH, {
      params: this._params,
    }).pipe(
      delay(this.FILTER_DELAY),
      tap((res) => {
        this._currentPokemons.set(res.pokemons);
        this._currentPage.set(res.currentPage);
        this._totalPages.set(res.totalPages);
      }),
      catchError(() => this.notificationService.notifyError('pokemons.notification.search')),
      finalize(() => this.loaderService.setIsSearching(false)),
    ).subscribe();
  }

  private fetchCurrentPage(): void {
    const url = this.isFiltering()
      ? this.pokemonApiPaths.SEARCH
      : this.pokemonApiPaths.GET_ALL;
    
    this.loaderService.setIsLoadingMore(true);
    this.httpClient.get<PokemonPage>(url, {
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

  private get _params(): HttpParams {
    const params: Record<string, string> = {
      page: this._currentPage().toString(),
      limit: this._limitPerPage().toString(),
    };

    for (const [key, value] of Object.entries(this._pokemonFilters())) {
      if (
        value !== undefined &&
        value !== null
      )
        params[key] = value;
    }
    return new HttpParams({ fromObject: params });
  }

  private get _isFilterEmpty(): boolean {
    return Object.values(this._pokemonFilters() ?? {}).every(v => !v);
  }
}
