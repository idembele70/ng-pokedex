import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';
import { LoaderService } from '../../../core/services/loader.service';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    TranslatePipe,
  ],
  template: `
    <header>
      <div class="user-info-wrapper">
          <h5
            [style.visibility]="!authService.currentUser()
              ? 'hidden'
              : 'visible'">
              {{ authService.currentUser()?.email}}
          </h5>
        <span role="button" class="login-btn"
          [ariaDisabled]="loaderService.isProcessing()"
          [class.disabled]="loaderService.isProcessing()"
          (click)="toggleAuth()">
          {{ 'auth.button.' + (authService.isLoggedIn()
            ? 'logout'
            : 'login')  | translate
          }}
        </span>
      </div>
      <nav>
        <a class="btn"
          [class.disabled]="loaderService.isProcessing()"
          [ariaDisabled]="loaderService.isProcessing()"
          routerLink="home"
          routerLinkActive="active">{{ 'header.homePage' | translate }}</a>
        @if (authService.isLoggedIn()) {
          <a class="btn"
            [class.disabled]="loaderService.isProcessing()"
            [ariaDisabled]="loaderService.isProcessing()"
          routerLink="liked"
          routerLinkActive="active">{{ 'header.likedPage' | translate }}</a>
          }
      </nav>
    </header>

  `,
  styles: [`
    nav {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px 38px;
      margin-bottom: 30px;
      flex-wrap: wrap;
    }

    .user-info-wrapper {
      padding: 12px 20px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 16px;
      @media (max-width: 250px) {
        padding-right: 0;
        justify-content: center;
      }

      h5 {
        font-size: 14px;
        font-weight: bold;
        margin: 0;
      }
    }

    .disabled {
      pointer-events: none;
      opacity: .5;
    }

    .login-btn {
      text-transform: uppercase;
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
      letter-spacing: 5px;
      @media (max-width: 250px) {
        letter-spacing: 3px;
      }
    }
  `]
})
export class NavbarComponent {
  protected readonly loaderService = inject(LoaderService);
  protected readonly authService = inject(AuthService);

  toggleAuth() {
    if (this.loaderService.isProcessing()) return;

    this.loaderService.setIsLoading(true);
    if (this.authService.isLoggedIn()) {
      this.authService.logout();
      this.loaderService.setIsLoading(false);
    }
    else {
      this.authService.setAuthVisibility(true);
      this.loaderService.setIsLoading(false);
    }
  }
}
