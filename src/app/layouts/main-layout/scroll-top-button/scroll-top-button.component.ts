import { DOCUMENT } from '@angular/common';
import { Component, Inject, input, NgZone, OnDestroy, OnInit, output, Renderer2, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription, timer } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { LoaderService } from '../../../core/services/loader.service';

@Component({
  selector: 'app-scroll-top-button',
  standalone: true,
  imports: [
    TranslatePipe,
  ],
  template: `
  <button [title]="'scrollTopButton.title' | translate"
  [attr.aria-hidden]="isHidden()"
  [attr.focusable]="!isHidden()"
  [hidden]="isHidden() || loaderService.isLoadingMore()"
  (click)="scrollToTop($event)"
  >
    <svg color="white"
      height="24"
      width="24"
      data-prefix="fas"
      data-icon="chevron-up"
      class="svg-inline--fa fa-chevron-up"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"><path fill="currentColor" d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"></path>
    </svg>
  </button>
  `,
  styles: `
    button {
      width: 48px;
      height: 48px;
      background-color: rgb(196, 196, 196);
      border: 1px solid rgb(196, 196, 196);
      opacity: 1;
      border-radius: 50%;
      position: fixed;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      padding: 0px;
      cursor: pointer;
      transition: 1s;
      visibility: visible;
      z-index: 5;
      outline: none;

      &:hover {
        background-color: rgb(196, 196, 196);
      }
      &:focus {
        box-shadow: 0 0 0 0.25rem rgba(83, 118, 252, 0.5);
      }
    }
  `,
})
export class ScrollTopButtonComponent implements OnInit, OnDestroy {
  private unListenScroll?: () => void;
  private scrollToTopTimeoutId?: ReturnType<typeof setTimeout>;
  private timerSub?: Subscription;
  private readonly SCROLL_TO_TOP_DELAY = 500;
  private readonly SCROLL_THRESHOLD = 130;
  readonly isHidden = signal<boolean>(true);
  isLastPage = input<boolean>(false);
  triggerServiceLoadMorePokemons = output<void>();

  constructor(
    private readonly renderer: Renderer2,
    private readonly ngZone: NgZone,
    @Inject(DOCUMENT) private readonly document: Document,
    protected readonly loaderService: LoaderService,
    private readonly authService: AuthService,
  ) { }

  scrollToTop(ev: Event) {
    ev.preventDefault();
    this.clearScrollToTopTimeout();
    this.scrollToTopTimeoutId = setTimeout(() => {
      this.document.scrollingElement?.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }, this.SCROLL_TO_TOP_DELAY);
  }

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.listenScroll();
    });
  }

  ngOnDestroy(): void {
    this.unListenScroll?.();
    this.clearScrollToTopTimeout();
    this.cleanUpTimerSubscription();
  }

  private listenScroll() {
    this.unListenScroll = this.renderer.listen(this.document, 'scroll', () => {
      this.loadMorePokemon();
      this.toggleScrollToTopBtn();
    });
  }

  private clearScrollToTopTimeout() {
    if (this.scrollToTopTimeoutId)
      clearTimeout(this.scrollToTopTimeoutId);
  }

  private toggleScrollToTopBtn() {
    const scrollTop = this.document.documentElement.scrollTop;
    if (this.authService.isAuthDialogVisible()) return;

    if (scrollTop > 300 && this.isHidden()) {
      this.ngZone.run(() => this.isHidden.set(false));
    } else if (scrollTop < 300 && !this.isHidden()) {
      this.ngZone.run(() => this.isHidden.set(true));
    }
  }

  private loadMorePokemon() {
    const { scrollHeight, scrollTop, clientHeight } = this.document.documentElement;
    const scrollMaxHeight = scrollHeight - clientHeight;
    const scrollPosition = Math.ceil(scrollTop);

    if (
      scrollPosition + this.SCROLL_THRESHOLD >= scrollMaxHeight &&
      !this.isLastPage() &&
      !this.loaderService.isLoadingMore() &&
      !this.authService.isAuthDialogVisible()
    ) {
      this.cleanUpTimerSubscription();
      this.ngZone.run(() => {
        this.loaderService.setIsLoadingMore(true);
        this.timerSub = timer(this.loaderService.DURATION).subscribe(
          () => this.triggerServiceLoadMorePokemons.emit());
      });
    }
  }

  private cleanUpTimerSubscription() {
    if (this.timerSub)
      this.timerSub.unsubscribe();
  }
}
