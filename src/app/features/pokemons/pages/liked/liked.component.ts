import { Component, DestroyRef, HostBinding, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import { tap } from 'rxjs';
import { LoaderService } from '../../../../core/services/loader.service';
import { ScrollTopButtonComponent } from '../../../../layouts/main-layout/scroll-top-button/scroll-top-button.component';
import { CardItemComponent } from "../../components/card-item/card-item.component";
import { IsDislikedPipe } from '../../pipes/is-disliked.pipe';
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
    IsDislikedPipe,
    TranslatePipe,
  ],
  templateUrl: './liked.component.html',
  styleUrl: './liked.component.scss',
})
export class LikedComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly THRESHOLD = 10;
  protected readonly pokemonsService = inject(PokemonsService);
  protected readonly pokemonLikeService = inject(PokemonLikeService);
  protected readonly authService = inject(AuthService);
  protected loaderService = inject(LoaderService);

  @HostBinding('class.card-item-container')
  protected readonly cardItemContainer = true;

  ngOnInit() {
    this.pokemonsService.resetState();
    this.pokemonLikeService.resetState();
    this.pokemonsService.fetchLikedPokemons();
    this.loadMoreLikedPokemonsListener();
  }

  private loadMoreLikedPokemonsListener(): void {
    this.pokemonLikeService.dislikedIds$.pipe(
      takeUntilDestroyed(this.destroyRef),
      tap((ids) => {
        if (ids.size % this.THRESHOLD === 0 &&
          !this.pokemonsService.isLastPage()
        ) {
          this.pokemonsService.setLimitPerPage(this.THRESHOLD);
          this.pokemonsService.loadMoreLikedPokemons();
        }
      })
    ).subscribe();
  }
}
