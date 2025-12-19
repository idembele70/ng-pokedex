import { HttpClient, HttpParams } from "@angular/common/http";
import { fakeAsync, TestBed, tick } from "@angular/core/testing";
import { provideTranslateService } from "@ngx-translate/core";
import { provideToastr } from "ngx-toastr";
import { of } from "rxjs";
import { POKEMON_API_PATHS, POKEMON_API_PATHS_TOKEN } from "../config/pokemons-api-paths.config";
import { Pokemon, PokemonFilterKeys } from "../models/pokemon.model";
import { PokemonsService } from "./pokemons.service";

describe('PokemonsService', () => {
  let service: PokemonsService;
  const mockPokemons: Pokemon[] = [
    {
      _id: "692486f93ed56d18b59dc29d",
      id: "001",
      name: "Bulbasaur",
      img: "http://img.pokemondb.net/artwork/bulbasaur.jpg",
      type: [
        "Grass",
        "Poison"
      ],
      likeCount: 1,
      updatedAt: "2025-11-24T19:08:20.721Z"
    },
    {
      _id: "692486f93ed56d18b59dc29e",
      id: "002",
      name: "Ivysaur",
      img: "http://img.pokemondb.net/artwork/ivysaur.jpg",
      type: [
        "Grass",
        "Poison"
      ],
      likeCount: 0,
      updatedAt: "2025-11-27T22:04:57.822Z"
    },
  ]
  const mockHttpClient = {
    get: (url: string, options: { params: HttpParams }) => {
      switch (url) {
        case 'pokemons': {
          return of({
            currentPage: options.params.get('page'),
            totalItems: 2,
            totalPages: 2,
            pokemons: mockPokemons,
          });
        }
        case 'pokemons/search': {
          const filterByField = (pokemon: Pokemon, fieldName: PokemonFilterKeys, searchTerm: string | null): boolean => {
            if (fieldName === 'type') {
              return pokemon[fieldName].some(
                t => t.toLowerCase().includes((searchTerm ?? '').toLowerCase())
              );
            } else {
              return pokemon[fieldName].toLowerCase().includes((searchTerm ?? '').toLowerCase())
            }
          }
          const filterPokemon = (pokemons: Pokemon[], params: HttpParams): Pokemon[] => {
            return pokemons
              .filter(p => filterByField(p, 'name', params.get('name')))
              .filter(p => filterByField(p, 'id', params.get('id')))
              .filter(p => filterByField(p, 'type', params.get('type')));
          }
          const filteredPokemons = filterPokemon(mockPokemons, options.params);
          return of({
            currentPage: options.params.get('page'),
            totalItems: filteredPokemons.length,
            totalPages: 1,
            pokemons: filteredPokemons,
          });
        }
        case 'pokemons/likes': {
          const getLikedPokemons = (pokemons: Pokemon[]): Pokemon[] =>
            pokemons.filter(p => p.likeCount > 0);
          const likedPokemons = getLikedPokemons(mockPokemons);
          return of({
            currentPage: options.params.get('page'),
            totalItems: likedPokemons.length,
            totalPages: 1,
            pokemons: likedPokemons,
          });
        }
        default:
          return of(null);
      }
    },
  }
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PokemonsService,
        {
          provide: HttpClient,
          useValue: mockHttpClient,
        },
        provideToastr(),
        provideTranslateService(),
        {
          provide: POKEMON_API_PATHS_TOKEN,
          useValue: POKEMON_API_PATHS,
        },
      ],
    });
    service = TestBed.inject(PokemonsService);
  })

  describe('loadMorePokemons', () => {
    let fetchCurrentPageSpy: jasmine.Spy<() => void>;
    beforeEach(() => {
      fetchCurrentPageSpy = spyOn(service, 'fetchCurrentPage').and.callThrough();
    });
    it('should not load pokemons when on last page', () => {
      service.loadMorePokemons();
      expect(fetchCurrentPageSpy).not.toHaveBeenCalled();
    });

    it('should load more pokemons and increment page when not on last page', () => {
      service.fetchCurrentPage();
      expect(service.isLastPage()).toBeFalse();
      expect(fetchCurrentPageSpy).toHaveBeenCalledTimes(1);
      service.loadMorePokemons();
      expect(fetchCurrentPageSpy).toHaveBeenCalledTimes(2);
      expect(service.isLastPage()).toBeTrue();
    });
  });

  describe('setPokemonFilters', () => {
    let resetStateSpy: jasmine.Spy<() => void>;

    beforeEach(() => {
      resetStateSpy = spyOn(service, 'resetState');
    })
    it('should set a name filter', () => {
      service.setPokemonFilters({
        name: 'Bulbasaur',
      });
      expect(resetStateSpy).toHaveBeenCalled();
      expect(service.pokemonFilters()).toEqual({
        name: 'Bulbasaur',
      })

    });
    it('should set a filter for id', () => {
      service.setPokemonFilters({
        id: '001',
      });
      expect(resetStateSpy).toHaveBeenCalledTimes(1);
      expect(service.pokemonFilters()).toEqual({
        id: '001',
      });
    });
    it('should set type filter', () => {
      service.setPokemonFilters({
        type: 'poison',
      });
      expect(resetStateSpy).toHaveBeenCalledTimes(1);
      expect(service.pokemonFilters()).toEqual({
        type: 'poison',
      });
    });

    it('should set an id, type and name filter', () => {
      service.setPokemonFilters({
        name: 'Bulbasaur',
        type: 'poison',
        id: '001',
      });
      expect(resetStateSpy).toHaveBeenCalledTimes(1);
      expect(service.pokemonFilters()).toEqual({
        name: 'Bulbasaur',
        type: 'poison',
        id: '001',
      });
    });
  });

  describe('filterPokemon', () => {
    it('should filter pokemons by name', fakeAsync(() => {
      service.setPokemonFilters({
        name: 'Bulbasaur',
      });
      service.filterPokemon();
      tick(100);
      expect(service.currentPokemons().length).toBe(1);
      expect(service.currentPokemons()).toEqual([mockPokemons[0]]);

    }))
    it('should filter by id', fakeAsync(() => {
      service.setPokemonFilters({
        id: '00',
      });
      service.filterPokemon();
      tick(100);
      expect(service.currentPokemons().length).toBe(2);
      expect(service.currentPokemons()).toEqual(mockPokemons);
    }))
    it('should filter by type', fakeAsync(() => {
      service.setPokemonFilters({
        type: 'poison',
      });
      service.filterPokemon();
      tick(100);
      expect(service.currentPokemons().length).toBe(2);
      expect(service.currentPokemons()).toEqual(mockPokemons);
    }));
    it('should filter by uppercase name & id and type', fakeAsync(() => {
      service.setPokemonFilters({
        name: 'BULBASAUR',
        id: '001',
        type: 'GRASS',
      });
      service.filterPokemon();
      tick(100);
      expect(service.currentPokemons().length).toBe(1);
      expect(service.currentPokemons()[0]).toEqual(mockPokemons[0]);
    }));
  });

  describe('loadMoreLikedPokemons', () => {
    let fetchLikedPokemonsSpy: jasmine.Spy<() => void>;

    beforeEach(() => {
      fetchLikedPokemonsSpy = spyOn(service, 'fetchLikedPokemons');
    });

    it('should not load more liked pokemons', () => {
      service.loadMoreLikedPokemons();
      expect(fetchLikedPokemonsSpy).not.toHaveBeenCalled();
    });

    it('should load more liked pokemons', () => {
      service.fetchCurrentPage();
      expect(service.isLastPage()).toBeFalse();
      service.loadMoreLikedPokemons();
      expect(service.isLastPage()).toBeTrue();
      expect(fetchLikedPokemonsSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('fetchLikedPokemons', () => {
    it('should get liked pokemons', () => {
      service.fetchLikedPokemons();
      expect(service.currentPokemons().length).toBe(1);
      expect(service.currentPokemons()[0]).toEqual(mockPokemons[0]);
    });
  });

  describe('fetchCurrentPage', () => {
    it('should get all pokemons when filter is empty', () => {
      service.setPokemonFilters({});
      service.fetchCurrentPage();
      expect(service.currentPokemons().length).toBe(2);
      expect(service.currentPokemons()).toEqual(mockPokemons);
    });
    it('should filter pokemons when filter is non-empty', () => {
      service.setPokemonFilters({
        name: 'Bulbasaur',
      });
      service.fetchCurrentPage();
      expect(service.currentPokemons().length).toBe(1);
      expect(service.currentPokemons()[0]).toEqual(mockPokemons[0]);
    });
  });
  describe('resetState', () => {
    it('should reset default states', () => {
      service.fetchCurrentPage();
      service.setLimitPerPage(40);
      expect(service.currentPokemons().length).toBe(2);
      expect(service.isLastPage()).toBeFalse();
      expect(service.limitPerPage()).toBe(40);
      expect(service.pokemonFilters()).toEqual({});
      service.resetState();
      expect(service.currentPokemons().length).toBe(0);
      expect(service.isLastPage()).toBeTrue();
      expect(service.limitPerPage()).toBe(20);
      expect(service.pokemonFilters()).toEqual({});
    });
    it('should reset pokemon filter states', () => {
      service.setPokemonFilters({
        name: 'Bulbasaur',
        type: 'grass',
        id: '001',
      });
      expect(service.pokemonFilters()).toEqual({
        name: 'Bulbasaur',
        type: 'grass',
        id: '001',
      });
      service.resetState();
      expect(service.pokemonFilters()).toEqual({});
    });
  });
  describe('setLimitPerPage', () => {
    it('should set limit to 40', () => {
      expect(service.limitPerPage()).toEqual(20);
      service.setLimitPerPage(40);
      expect(service.limitPerPage()).toBe(40);
    });
  });
});

