import { Component, inject } from '@angular/core';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'pokeball-loader',
  standalone: true,
  imports: [],
  template: `
    <div class="loader-container" [class.is-visible]="loaderService.isLoading()">
      <div class="pokeball">
        <div class="pokeball-content">
          <div class="pokeball-content-center">
            <div class="pokeball-content-center-inner"></div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './pokeball-loader.component.scss',
})
export class PokeballLoaderComponent {
  protected readonly loaderService = inject(LoaderService);
}
