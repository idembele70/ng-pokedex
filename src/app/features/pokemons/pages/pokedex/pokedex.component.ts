import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LoaderService } from '../../../../core/services/loader.service';
import { PokeballLoaderComponent } from '../../../../shared/components/pokeball-loader/pokeball-loader.component';
import { CardItemComponent } from '../../components/card-item/card-item.component';
import { PokemonsService } from '../../services/pokemons.service';
import { SearchBarComponent } from "../../components/search-bar/search-bar.component";
import { ScrollTopButtonComponent } from "../../../../layouts/main-layout/scroll-top-button/scroll-top-button.component";
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-pokedex',
  standalone: true,
  imports: [
    CardItemComponent,
    PokeballLoaderComponent,
    TranslatePipe,
    SearchBarComponent,
    ScrollTopButtonComponent
  ],
  template: `
  <app-search-bar />
  @if (loaderService.isSearching() ||
    loaderService.isLoadingMore() &&
    pokemonsService.isCurrentPokemonsEmpty()
    ) {
    <pokeball-loader [notFixed]="true" />
  } @else {
    @for (pokemon of pokemonsService.currentPokemons(); track pokemon._id) {
      <app-card-item [pokemon]="pokemon" [isLoggedIn]="authService.isLoggedIn()" />
    }
  }
  @if(pokemonsService.isFiltering() && !loaderService.isProcessing()) {
    <h2>{{ 'pokemons.noResults' | translate}}</h2>
  } 
  @if(pokemonsService.isCurrentPokemonsEmpty() && !loaderService.isProcessing()) {
    <h2>{{ 'pokemons.emptyList' | translate}}</h2>
  }

  @if(!loaderService.isSearching() &&
    loaderService.isLoadingMore() &&
    !pokemonsService.isCurrentPokemonsEmpty()
    ) {
    <pokeball-loader
      [notFixed]="true"
      [hidden]="loaderService.isLoadingMore()" />
  }
  <app-scroll-top-button [isLastPage]="pokemonsService.isLastPage()"
    (triggerServiceLoadMorePokemons)="pokemonsService.loadMorePokemons()" />
  `,
  styles: `
  :host {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 32px;
    width: 100%;
    max-width: 985px;
    margin: 0 auto;
  }
  `
})
export class PokedexComponent {
  protected readonly pokemonsService = inject(PokemonsService);
  protected readonly loaderService = inject(LoaderService);
  protected readonly authService = inject(AuthService);

  ngOnInit(): void {
    this.loaderService.setIsLoadingMore(true);
  }
}
