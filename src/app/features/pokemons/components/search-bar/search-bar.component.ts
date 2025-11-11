import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged, finalize, tap } from 'rxjs';
import { PokemonsService } from '../../services/pokemons.service';
import { LoaderService } from '../../../../core/services/loader.service';
@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [
    TranslatePipe,
    ReactiveFormsModule,
  ],
  template: `
    <form>
      <input
        class="base-input"
        type="search"
        name="name"
        autocomplete="off"
        [placeholder]="'searchBars.nameInput.placeholder' | translate"
        [formControl]="nameInput"
      />
      <div>
        <input
          class="base-input"
          type="search"
          name="id"
          #id
          autocomplete="off"
          [placeholder]="'searchBars.idInput.placeholder' | translate"
        />
        <input
          class="base-input"
          type="search"
          name="type"
          #type
          autocomplete="off"
          [placeholder]="'searchBars.typeInput.placeholder' | translate"
        />
      </div>
    </form>
  `,
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent implements OnInit {
  private readonly DEBOUNCE_TIME = 250;
  protected readonly nameInput = new FormControl('');
  private readonly pokemonsService = inject(PokemonsService);
  private readonly loaderService = inject(LoaderService);

  ngOnInit(): void {
    this.nameInput?.valueChanges
      .pipe(
        debounceTime(this.DEBOUNCE_TIME),
        distinctUntilChanged(),
        tap(() => this.loaderService.setIsSearching(true)),
      )
      .subscribe(
        v => {
          this.pokemonsService.setPokemonFilters('name', v ?? '');
          this.pokemonsService.filterPokemon();
        }
      )
  }

}
