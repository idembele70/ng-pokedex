import { Component, inject } from '@angular/core';
import { LoaderService } from '../../../../core/services/loader.service';
import { PokeballLoaderComponent } from '../../../../shared/components/pokeball-loader/pokeball-loader.component';
import { CardItemComponent } from '../../components/card-item/card-item.component';
import { PokemonsService } from '../../services/pokemons.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-pokedex',
  standalone: true,
  imports: [
    CardItemComponent,
    PokeballLoaderComponent,
    TranslatePipe,
  ],
  template: `
  @for (pokemon of pokemonsService.currentPokemons(); track pokemon._id) {
    <app-card-item [pokemon]="pokemon" [priority]="$index <= pokemonsService.limitPerPage()" />
  }
  @if(pokemonsService.currentPokemons().length === 0 &&
    !loaderService.isLoadingMore()) {
    <h2>{{ 'pokemons.emptyList' | translate}}</h2>
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
  `
})
export class PokedexComponent {
  protected readonly pokemonsService = inject(PokemonsService);
  protected readonly loaderService = inject(LoaderService);
}
