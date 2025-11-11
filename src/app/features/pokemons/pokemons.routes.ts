import { Route } from "@angular/router";
import { authGuard } from "../../core/guards/auth.guard";
import { POKEMON_API_PATHS, POKEMON_API_PATHS_TOKEN } from "./config/pokemons-api-paths.config";
import { PokedexComponent } from "./pages/pokedex/pokedex.component";
import { PokemonsService } from "./services/pokemons.service";

export const POKEMONS_ROUTES: Route[] = [
  {
    path: '',
    children: [
      {
        path: 'home',
        component: PokedexComponent,
        providers: [
          PokemonsService,
          {
            provide: POKEMON_API_PATHS_TOKEN,
            useValue: POKEMON_API_PATHS,
          },
        ],
      },
      {
        path: 'liked',
        loadComponent: () => import('./pages/liked/liked.component').then(c => c.LikedComponent),
        canActivate: [authGuard],
      },
    ],
  },
]