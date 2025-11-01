import { Routes } from '@angular/router';
import { PokedexComponent } from './features/pokedex/pokedex.component';
import { LikedComponent } from './features/liked/liked.component';

export const routes: Routes = [
  {
    path: 'pokedex',
    component: PokedexComponent,
  },
  {
    path: 'liked',
    component: LikedComponent,
  },
  {
    path: '**',
    redirectTo: 'pokedex',
  },
];
