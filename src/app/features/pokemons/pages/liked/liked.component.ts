import { Component, HostBinding, inject, OnInit } from '@angular/core';
import { LoaderService } from '../../../../core/services/loader.service';
import { ScrollTopButtonComponent } from '../../../../layouts/main-layout/scroll-top-button/scroll-top-button.component';
import { CardItemComponent } from "../../components/card-item/card-item.component";
import { IsLikedPipe } from '../../pipes/is-liked.pipe';
import { PokemonLikeService } from '../../services/pokemon-like.service';
import { PokemonsService } from '../../services/pokemons.service';
import { AuthService } from './../../../../core/services/auth.service';

@Component({
  selector: 'app-liked',
  standalone: true,
  imports: [
    CardItemComponent,
    IsLikedPipe,
    ScrollTopButtonComponent,
  ],
  templateUrl: './liked.component.html',
  styleUrl: './liked.component.scss',
})
export class LikedComponent implements OnInit {
  protected readonly pokemonsService = inject(PokemonsService);
  protected readonly pokemonLikeService = inject(PokemonLikeService);
  protected readonly authService = inject(AuthService);
  protected loaderService = inject(LoaderService);

  @HostBinding('class.card-item-container')
  protected readonly cardItemContainer = true;

  ngOnInit() {
    this.pokemonsService.resetState();
    this.pokemonsService.fetchLikedPokemons();
  }
}
