import { Component, DestroyRef, HostBinding, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import { tap } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { LoaderService } from '../../../../core/services/loader.service';
import { ScrollTopButtonComponent } from "../../../../layouts/main-layout/scroll-top-button/scroll-top-button.component";
import { PokeballLoaderComponent } from '../../../../shared/components/pokeball-loader/pokeball-loader.component';
import { CardItemComponent } from '../../components/card-item/card-item.component';
import { SearchBarComponent } from "../../components/search-bar/search-bar.component";
import { IsLikedPipe } from '../../pipes/is-liked.pipe';
import { PokemonLikeService } from '../../services/pokemon-like.service';
import { PokemonsService } from '../../services/pokemons.service';

@Component({
  selector: 'app-pokedex',
  standalone: true,
  imports: [
    CardItemComponent,
    PokeballLoaderComponent,
    TranslatePipe,
    SearchBarComponent,
    ScrollTopButtonComponent,
    IsLikedPipe,
  ],
  template: `
  <app-search-bar />
  @if (loaderService.isSearching()) {
    <pokeball-loader [notFixed]="true" />
  } @else {
    @for (pokemon of pokemonsService.currentPokemons(); track pokemon._id) {
      <app-card-item [pokemon]="pokemon"
        (toggleFavorite)="pokemonLikeService.toggleLike($event)"
        [isFavorite]="pokemonLikeService.likedIds() | isLiked:pokemon['_id']"
        [isLoggedIn]="authService.isLoggedIn()" />
    }
  }
  @if(pokemonsService.isFiltering() && !loaderService.isProcessing()) {
    <h2>{{ 'pokemons.noResults' | translate}}</h2>
  } 
  @if(pokemonsService.isCurrentPokemonsEmpty() && !loaderService.isProcessing()) {
    <h2>{{ 'pokemons.emptyList' | translate}}</h2>
  }
  <app-scroll-top-button [isLastPage]="pokemonsService.isLastPage()"
    (triggerServiceLoadMorePokemons)="pokemonsService.loadMorePokemons()" />
  `,
  styles: ``,
})
export class PokedexComponent implements OnInit {
  protected readonly pokemonsService = inject(PokemonsService);
  protected readonly loaderService = inject(LoaderService);
  protected readonly authService = inject(AuthService);
  protected readonly pokemonLikeService = inject(PokemonLikeService);
  private readonly destroyRef = inject(DestroyRef);

  @HostBinding('class.card-item-container')
  protected readonly cardItemContainer = true;

  ngOnInit(): void {
    this.refreshPokemonsListeners();
  }

  private refreshPokemonsListeners() {
    this.authService.isLoggedIn$.pipe(
      takeUntilDestroyed(this.destroyRef),
      tap(() => {
        this.pokemonsService.resetState();
        this.pokemonsService.fetchCurrentPage();
      }),
    ).subscribe();
  }
}
