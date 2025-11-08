import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, timer } from 'rxjs';
import { DEFAULT_LANG, SUPPORTED_LANGS } from '../../config/i18n.config';
import { LoaderService } from '../../core/services/loader.service';
import { AuthDialogComponent } from '../../features/auth/components/auth-dialog/auth-dialog.component';
import { PokemonsService } from '../../features/pokemons/services/pokemons.service';
import { PokeballLoaderComponent } from '../../shared/components/pokeball-loader/pokeball-loader.component';
import { AuthService } from './../../core/services/auth.service';
import { NavbarComponent } from './navbar/navbar.component';
import { ScrollTopButtonComponent } from './scroll-top-button/scroll-top-button.component';
import { SearchBarComponent } from './search-bar/search-bar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    PokeballLoaderComponent,
    SearchBarComponent,
    ScrollTopButtonComponent,
    AuthDialogComponent,
  ],

  providers: [
    PokemonsService,
  ],
  template: `
    <app-navbar />
      @if (loaderService.isLoading()) {
        <pokeball-loader />
      } @else {
        <app-search-bar />
        <router-outlet (activate)="hideLoader()"
        (deactivate)="loaderService.isLoading.set(true)" />
        <app-scroll-top-button />
      }
      @if (authService.isAuthDialogVisible()) {
        <app-auth-dialog />
      }
  `,
  styles: ``
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  readonly loaderService = inject(LoaderService);
  private timerSub?: Subscription;
  private readonly translateService = inject(TranslateService);
  protected readonly authService = inject(AuthService);

  constructor() {
    this.loadLang();
  }

  ngOnInit(): void {
    this.hideLoader();
  }
  ngOnDestroy(): void {
    this.cleanUpTimerSubscription();
  }

  hideLoader() {
    this.cleanUpTimerSubscription();

    this.timerSub = timer(this.loaderService.DURATION)
      .subscribe(
        {
          next: () => this.loaderService.isLoading.set(false),
        }
      );
  }

  private cleanUpTimerSubscription() {
    if (this.timerSub)
      this.timerSub.unsubscribe();
  }

  private loadLang() {
    this.translateService.addLangs([...SUPPORTED_LANGS]);
    const browserLang = this.translateService.getBrowserLang();
    const langRegex = new RegExp(SUPPORTED_LANGS.join('|'));
    const lang = browserLang?.match(langRegex) ? browserLang : DEFAULT_LANG;
    this.translateService.use(lang);
  }
}
