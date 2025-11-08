import { Component, inject, input } from '@angular/core';
import { LoaderService } from '../../../core/services/loader.service';

@Component({
  selector: 'pokeball-loader',
  standalone: true,
  imports: [],
  template: `
    <div class="loader-container"
      [class.fixed]="loaderService.isLoading() ||
        loaderService.isAuthenticating()"
      [class.not-fixed]="notFixed()"
      [class.small]="isSmall()"
      [class.is-visible]="loaderService.isLoading() ||
        loaderService.isLoadingMore() ||
        loaderService.isAuthenticating()">
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
  notFixed = input<boolean>(false);
  isSmall = input<boolean>(false);
}
