import { Route } from "@angular/router";
import { authGuard } from "../../core/guards/auth.guard";
import { PokedexComponent } from "./pages/pokedex/pokedex.component";

export const POKEMONS_ROUTES: Route[] = [
  {
    path: '',
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