import { Component, ElementRef, HostBinding, inject, NgZone, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { finalize, pipe, Subscription } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { LoaderService } from '../../../../core/services/loader.service';
import { PokeballLoaderComponent } from '../../../../shared/components/pokeball-loader/pokeball-loader.component';
import { AuthDialogService } from '../../services/auth-dialog.service';
import { passwordMatchValidator } from '../../validators/password-match.validator';

@Component({
  selector: 'app-auth-dialog',
  standalone: true,
  imports: [
    TranslatePipe,
    ReactiveFormsModule,
    PokeballLoaderComponent,
  ],
  providers: [
    AuthDialogService,
  ],
  template: `
      <form [formGroup]="authForm"
        (ngSubmit)="onSubmit()"
        class="auth-wrapper">
          <pokeball-loader [isSmall]="true" />
        <div class="row">
          <input
            class="base-input"
            autocomplete="off"
            [placeholder]="'auth.email.placeholder' | translate"
            type="email"
            formControlName="email"
            name="email" />
            @if (authForm.get('email'); as emailControl) {
              @if (emailControl.dirty && emailControl.hasError('required')) {
                <span class="error">{{ 'auth.email.error.required' | translate}}</span>
              } @else if (emailControl.touched && emailControl.hasError('email')) {
                <span class="error">{{ 'auth.email.error.invalid' | translate}}</span>
              }
            }
        </div>
        <div class="row">
          <input
            class="base-input"
            autocomplete="off"
            type="password"
            [placeholder]="'auth.password.placeholder' | translate"
            formControlName="password"
            name="password" />
            @if (authForm.get('password'); as passwordControl) {
              @if (passwordControl.dirty && passwordControl.hasError('minlength')) {
                <span class="error">
                {{ 'auth.password.error.minLength' |
                  translate:{ min: PASSWORD_MIN_LENGTH}
                }}
                </span>
              } @else if (passwordControl.touched && passwordControl.hasError('required')) {
                <span class="error">
                {{ 'auth.password.error.required' | translate }}
                </span>
              }
            }
        </div>
        @if (authService.isRegisteredMode()) {
          <div class="row">
            <input
              class="base-input"
              autocomplete="off"
              [placeholder]="'auth.confirmPassword.placeholder' | translate"
              type="password"
              formControlName="confirmPassword"
              name="confirmPassword" />
              @if (passwordMisMatchError) {
                <span class="error">
                  {{ 'auth.password.error.passwordsMisMatch' | translate}}
                </span>
              }
          </div>
        }
        <button class="btn" 
          [disabled]="authForm.invalid || authForm.disabled"
          type="submit">{{ 'auth.button.' + 
            (authService.isRegisteredMode() ?  'register' : 'login') | translate
          }}</button>
          <span role="button"
            aria-label="toggle auth mode"
            tabindex="0"
            (click)="toggleAuthMode()">
            {{
              'auth.button.prefix.or' | translate
            }}
            {{ 'auth.button.' +
              (authService.isRegisteredMode() ? 'login': 'register') | translate
            }}
          </span>
      </form>
    `,
  styles: `
    .row {
      width: 95%;
      max-width: 270px;
      margin-bottom: 21px;
  
      & input {
        max-width: 100%;
        box-sizing: border-box;

        &:disabled {
          cursor: not-allowed;
        }
      }

      & .error {
        color: crimson;
      }
    }

    button:disabled {
      cursor: not-allowed;
    }
  
    span[role="button"] {
      color: #6D6D6D;
      letter-spacing: 2px;
      font-size: 12px;
      cursor: pointer;
      margin-top: 20px;
    }
    `
})

export class AuthDialogComponent implements OnInit, OnDestroy {
  private readonly ngZone = inject(NgZone);
  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly fb = inject(FormBuilder);
  private readonly authDialogService = inject(AuthDialogService);
  readonly loaderService = inject(LoaderService);
  private unlistenContainerClick?: () => void;
  private authSubscription?: Subscription;
  readonly authService = inject(AuthService);
  readonly PASSWORD_MIN_LENGTH = 8;
  readonly authForm = this.fb.nonNullable.group(
    {
      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(this.PASSWORD_MIN_LENGTH),
        ],
      ],
      confirmPassword: [''],
    }
  );

  @HostBinding('class.auth-wrapper-blur')
  blur: boolean = true;

  toggleAuthMode() {
    this.authService.toggleAuthMode();
    if (this.authService.isRegisteredMode()) {
      this.authForm.addValidators(passwordMatchValidator);
    } else {
      this.authForm.removeValidators(passwordMatchValidator);
    }
    this.authForm.updateValueAndValidity();
  }

  get passwordMisMatchError(): boolean {
    const password = this.authForm.get('password');
    const confirmPassword = this.authForm.get('confirmPassword');
    if (!password || !confirmPassword)
      return false;

    return password?.dirty &&
      confirmPassword?.dirty &&
      this.authForm.hasError('passwordsMisMatch');
  }

  onSubmit() {
    if (this.authForm.invalid) return;

    this.loaderService.setIsAuthenticating(true);
    this.authForm.disable({ emitEvent: false });
    this.authSubscription?.unsubscribe();
    const { confirmPassword, ...authPayload } = this.authForm.getRawValue();
    if (this.authService.isRegisteredMode()) {
      this.authSubscription = this.authDialogService.register(authPayload)
        .pipe(this.finalizeAuth()).subscribe(() => this.resetForm());
    } else {
      this.authSubscription = this.authDialogService.login(authPayload)
        .pipe(this.finalizeAuth()).subscribe(() => this.resetForm());
    }
  }

  ngOnInit(): void {
    this.listenContainerClick();
  }

  ngOnDestroy(): void {
    this.cleanup()
  }

  private listenContainerClick(): void {
    this.ngZone.runOutsideAngular(() => {
      this.unlistenContainerClick = this.renderer.listen(
        this.el.nativeElement, 'click', (event: MouseEvent) => {
          const container = event.target as HTMLElement;
          if (this.loaderService.isAuthenticating()) return;

          if (container.classList.contains('auth-wrapper-blur')) {
            this.ngZone.run(() => this.authService.setAuthVisibility(false));
          }
        })
    })
  }

  private cleanup(): void {
    this.unlistenContainerClick?.();
    this.authSubscription?.unsubscribe();
  }

  private finalizeAuth() {
    return pipe(
      finalize(() => {
        this.authForm.enable({ emitEvent: false });
        this.loaderService.setIsAuthenticating(false);
      })
    );
  }

  private resetForm(): void {
    this.authForm.reset({}, { emitEvent: false });
  }
}
