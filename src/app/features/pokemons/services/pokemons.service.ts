import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Pokemon, PokemonPage } from '../models/pokemon.model';

@Injectable()
export class PokemonsService {
  private readonly httpClient = inject(HttpClient);
  private readonly _API_URL = `${environment.API_URL}/pokemons/search`;
  private readonly _limitPerPage = signal(20);
  private readonly _currentPage = signal(1);
  private readonly _totalPages = signal(1);
  private readonly _currentPokemons = signal<Pokemon[]>([]);
  private readonly _PARAMS =  new HttpParams()
      .set('page', this._currentPage())
      .set('limit', this._limitPerPage());
  
  readonly currentPokemons = computed(() => this._currentPokemons());
  readonly currentPage = computed(() => this._currentPage());
  readonly totalPages = computed(() => this._totalPages());
  readonly limitPerPage = computed(() => this._limitPerPage());


  constructor(
  ) {
    this.getAllPokemons().subscribe(
      pageInfo => {
        this._currentPage.set(pageInfo.currentPage);
        this._totalPages.set(pageInfo.totalPages);
      });
    this.getCurrentPagePokemons();
  }

  getAllPokemons(): Observable<PokemonPage> {
    return this.httpClient.get<PokemonPage>(this._API_URL, {
      params: this._PARAMS
    });
  }


  getCurrentPagePokemons(): void {
    this.httpClient.get<PokemonPage>(this._API_URL, {
      params: this._PARAMS,
    }).pipe(
      tap((res) => {
        this._currentPokemons.update(prev => [...prev, ...res.pokemons]);
      })
    ).subscribe();
  }

  updatePageAndFetch() {
    if (this._currentPage() < this._totalPages()) {
      this._currentPage.set(this._currentPage() + 1);
      this.getCurrentPagePokemons();
    }
  }
}
