import { Routes } from '@angular/router';
import { POKEMONS_ROUTES } from './features/pokemons/pokemons.routes';

export const routes: Routes = [
  ...POKEMONS_ROUTES,
  {
    path: '**',
    redirectTo: 'home',
  },
];
