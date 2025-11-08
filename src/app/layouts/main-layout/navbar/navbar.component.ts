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
      <div class="login-btn-wrapper">
        <span role="button" class="login-btn"
          (click)="authService.setAuthVisibility(true)">
          {{ 'auth.button.login'  | translate }}
        </span>
      </div>
      <nav>
        <a class="btn"
          routerLink="home"
          routerLinkActive="active">{{ 'header.homePage' | translate }}</a>
        <a class="btn"
          routerLink="liked"
          routerLinkActive="active">{{ 'header.likedPage' | translate }}</a>
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
    
    .login-btn-wrapper {
      padding-top: 20px;
      padding-right: 12px;
      display: flex;
      justify-content: flex-end;
    }
    
    .login-btn {
      text-transform: uppercase;
      font-size: 14px;
      font-weight: bold;
      padding: 12px 30px;
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
}
