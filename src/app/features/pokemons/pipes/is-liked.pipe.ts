import { Pipe, PipeTransform } from '@angular/core';
import { Pokemon } from '../models/pokemon.model';

@Pipe({
  name: 'isLiked',
  standalone: true,
})
export class IsLikedPipe implements PipeTransform {

  transform(likedIds: Set<Pokemon['_id']>, pid: Pokemon['_id']): boolean {
    return likedIds.has(pid);
  }

}
