import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs';
import { LoaderService } from '../../../../core/services/loader.service';
import { PokemonFilter, PokemonFilterKeys } from '../../models/pokemon.model';
import { PokemonsService } from '../../services/pokemons.service';
@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [
    TranslatePipe,
    ReactiveFormsModule,
  ],
  template: `
    <form [formGroup]="searchForm">
      <input
        class="base-input"
        type="search"
        name="name"
        autocomplete="off"
        [placeholder]="'searchBars.nameInput.placeholder' | translate"
        formControlName="name"
      />
      <div>
        <input
          class="base-input"
          type="search"
          name="id"
          autocomplete="off"
          [placeholder]="'searchBars.idInput.placeholder' | translate"
          formControlName="id"
        />
        <input
          class="base-input"
          type="search"
          name="type"
          autocomplete="off"
          [placeholder]="'searchBars.typeInput.placeholder' | translate"
          formControlName="type"
        />
      </div>
    </form>
  `,
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent implements OnInit {
  private readonly DEBOUNCE_TIME = 250;
  private readonly fb = inject(FormBuilder);
  protected readonly searchForm = this.fb.nonNullable.group({
    name: [''],
    id: [''],
    type: [''],
  });
  private readonly pokemonsService = inject(PokemonsService);
  private readonly loaderService = inject(LoaderService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.searchForm.valueChanges
      .pipe(
        debounceTime(this.DEBOUNCE_TIME),
        distinctUntilChanged(),
        tap(() => this.loaderService.setIsSearching(true)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(
        values => {
          this.sanitizeUserInput(values);
        }
      )
  }

  private sanitizeUserInput(values: PokemonFilter): void {
    const lettersRegex = /[^a-zA-Z]/g 
    const sanitizedValues = {
      name: values.name?.replaceAll(lettersRegex, '') ?? '',
      id: values.id?.replaceAll(/\D/g, '') ?? '',
      type: values.type?.replaceAll(lettersRegex, '') ?? '',  
    };
    const currentValues = this.searchForm.value;
    const hasInvalidInput = Object.keys(sanitizedValues).some(
      key => sanitizedValues[key as PokemonFilterKeys] !== 
        currentValues[key as PokemonFilterKeys]
    );

    this.pokemonsService.setPokemonFilters(sanitizedValues);

    this.searchForm.setValue(sanitizedValues, {
      emitEvent: false,
    });

    if(hasInvalidInput) {
      this.loaderService.setIsSearching(false);
      return;
    }
      this.pokemonsService.filterPokemon();
  }
}
