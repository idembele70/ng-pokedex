import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs';
import { LoaderService } from '../../../../core/services/loader.service';
import { PokemonUtilities } from '../../../utilities/pokemon.utilities';
import { SearchInputDirective } from '../../directives/search-input.directive';
import { PokemonFilter } from '../../models/pokemon.model';
import { PokemonsService } from '../../services/pokemons.service';
@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [
    TranslatePipe,
    ReactiveFormsModule,
    SearchInputDirective,
  ],
  template: `
    <form [formGroup]="searchForm">
      <input
        appSearchInput
        name="name"
        [placeholder]="'searchBars.nameInput.placeholder' | translate"
        formControlName="name"
        />
      <div>
        <input
          appSearchInput
          inputmode="numeric"
          name="id"
          [placeholder]="'searchBars.idInput.placeholder' | translate"
          formControlName="id"
          maxlength="3"
        />
        <input
          appSearchInput
          name="type"
          [placeholder]="'searchBars.typeInput.placeholder' | translate"
          formControlName="type"
        />
      </div>
    </form>
  `,
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {
  private readonly DEBOUNCE_TIME = 250;
  private readonly fb = inject(FormBuilder);
  protected readonly searchForm: FormGroup;
  private readonly pokemonsService = inject(PokemonsService);
  private readonly loaderService = inject(LoaderService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  constructor() {
    const { queryParamMap } = this.route.snapshot;
    const queries = {
      id: queryParamMap.get('id') ?? '',
      name: queryParamMap.get('name') ?? '',
      type: queryParamMap.get('type') ?? '',
    };
    this.searchForm = this.fb.nonNullable.group(queries);
    this.pokemonsService.setPokemonFilters(queries);
    this.searchForm.valueChanges
      .pipe(
        debounceTime(this.DEBOUNCE_TIME),
        distinctUntilChanged((prev, curr) =>
          JSON.stringify(prev) === JSON.stringify(curr)),
        tap((values) => {
          this.loaderService.setIsSearching(true);
          this.filterPokemons(values);
        }),
        takeUntilDestroyed(),
      ).subscribe();
  }

  private filterPokemons(values: PokemonFilter): void {
    this.loaderService.setIsSearching(false);
    this.pokemonsService.setPokemonFilters(values);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: PokemonUtilities.omitNullishValue(values),
    });
    this.pokemonsService.filterPokemon();
  }

}
