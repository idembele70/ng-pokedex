import { Route } from "@angular/router";
import { PokedexComponent } from "./pages/pokedex/pokedex.component";

export const POKEMONS_ROUTES: Route[] = [
  {
    path: 'home',
    component: PokedexComponent,
  },
  {
    path: 'liked',
    loadComponent: () => import('./pages/liked/liked.component').then(c => c.LikedComponent),
  },
]