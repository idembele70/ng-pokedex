import { Pipe, PipeTransform } from '@angular/core';
import { Pokemon } from '../models/pokemon.model';

@Pipe({
  name: 'isDisliked',
  standalone: true
})
export class IsDislikedPipe implements PipeTransform {

  transform(id: Pokemon['_id'], dislikedIds: Set<Pokemon['_id']>): boolean {
    return dislikedIds.has(id);
  }

}
