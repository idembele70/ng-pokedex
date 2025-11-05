import { Component, inject } from '@angular/core';
import { LoaderService } from '../../../../core/services/loader.service';
import { PokeballLoaderComponent } from '../../../../shared/components/pokeball-loader/pokeball-loader.component';
import { CardItemComponent } from '../../components/card-item/card-item.component';
import { PokemonsService } from '../../services/pokemons.service';

@Component({
  selector: 'app-pokedex',
  standalone: true,
  imports: [
    CardItemComponent,
    PokeballLoaderComponent,
  ],
  template: `
  @for (pokemon of pokemonsService.currentPokemons(); track pokemon._id) {
    <app-card-item [pokemon]="pokemon" [priority]="$index <= pokemonsService.limitPerPage()" />
  }
  <pokeball-loader
    [notFixed]="true"
    [hidden]="loaderService.isLoadingMore()" />
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
  .loader-wrapper {
    flex: 1 1 100%; display: flex; justify-content: center; align-items: center;
    z-index:6;
  }
  `
})
export class PokedexComponent {
  protected readonly pokemonsService = inject(PokemonsService);
  protected readonly loaderService = inject(LoaderService);
}
