import { Component, DestroyRef, inject, Input, input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged, startWith, tap } from 'rxjs';
import { LoaderService } from '../../../../core/services/loader.service';
import { PokemonUtilities } from '../../../utilities/pokemon.utilities';
import { PokemonFilter } from '../../models/pokemon.model';
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
          inputmode="numeric"
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
  protected readonly searchForm: FormGroup;
  private readonly pokemonsService = inject(PokemonsService);
  private readonly loaderService = inject(LoaderService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  constructor() {
    this.searchForm = this.fb.nonNullable.group(this.pokemonsService.pokemonFilters());
  }

  ngOnInit(): void {
    this.searchForm.valueChanges
      .pipe(
        debounceTime(this.DEBOUNCE_TIME),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) ===
          JSON.stringify(curr)),
        tap((values) => {
          this.loaderService.setIsSearching(true)
          this.filterPokemons(values);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  private filterPokemons(values: PokemonFilter): void {
    const sanitizedValues = this.sanitizeUserInput(values);
    this.searchForm.patchValue(sanitizedValues, {
      emitEvent: false,
    });

    const hasValueChanged = this.hasValueChanged(values, sanitizedValues);
    if (hasValueChanged) {
      this.loaderService.setIsSearching(false);
      return;
    }

    const currentFilters = PokemonUtilities.omitNullishValue(sanitizedValues);
    this.pokemonsService.setPokemonFilters(currentFilters);
    this.router.navigate([], { queryParams: currentFilters });
    this.pokemonsService.filterPokemon();
  }

  private sanitizeUserInput(values: PokemonFilter) {
    const lettersRegex = /[^a-zA-Z]/g;
    return {
      name: values.name?.replaceAll(lettersRegex, ''),
      id: values.id?.replaceAll(/\D/g, ''),
      type: values.type?.replaceAll(lettersRegex, ''),
    };

  }

  private hasValueChanged(
    currentValues: PokemonFilter,
    sanitizedValues: PokemonFilter,
  ): boolean {
    return JSON.stringify(currentValues) !==
      JSON.stringify(sanitizedValues);
  }

}
