import { Routes } from '@angular/router';
import { POKEMONS_ROUTES } from './features/pokemons/pokemons.routes';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  ...POKEMONS_ROUTES,
  {
    path: '**',
    redirectTo: 'home',
  },
];
