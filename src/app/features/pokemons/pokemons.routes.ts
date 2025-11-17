import { Route } from "@angular/router";
import { authGuard } from "../../core/guards/auth.guard";
import { LIKE_API_PATHS, LIKE_API_PATHS_TOKEN } from "./config/like-api-paths.config";
import { POKEMON_API_PATHS, POKEMON_API_PATHS_TOKEN } from "./config/pokemons-api-paths.config";
import { PokedexComponent } from "./pages/pokedex/pokedex.component";
import { PokemonLikeService } from "./services/pokemon-like.service";

export const POKEMONS_ROUTES: Route[] = [
  {
    path: '',
    providers: [
      PokemonLikeService,
      {
        provide: LIKE_API_PATHS_TOKEN,
        useValue: LIKE_API_PATHS,
      },
    ],
    children: [
      {
        path: 'home',
        component: PokedexComponent,
      },
      {
        path: 'liked',
        loadComponent: () => import('./pages/liked/liked.component').then(c => c.LikedComponent),
        canActivate: [authGuard],
      },
    ],
  },
]