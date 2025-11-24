import { I18nPluralPipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, HostBinding, input, OnDestroy, OnInit, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Pokemon } from '../../models/pokemon.model';
import { TypeColorPipe } from './../../pipes/type-color.pipe';

@Component({
  selector: 'app-card-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TypeColorPipe,
    TranslatePipe,
    NgOptimizedImage,
    I18nPluralPipe
  ],
  template: `
      <div class="img-wrapper">
        @if (!isLoggedIn()) {
          <span [title]="'pokemons.card.like.title' | translate"
            class="like-wrapper">{{ 
              (pokemon().likeCount || '') +
              (pokemon().likeCount ? ' ' : '') +
              (('pokemons.card.like.' + (pokemon().likeCount | i18nPlural: likeMapping)) | translate) }}</span>
        }
        <img
          [ngSrc]="pokemon().img"
          [alt]="pokemon().name"
          width="100"
          height="100"
          (error)="pokemon().img = 'assets/images/error-404.png'"
          />
      </div>
      <div class="content-wrapper">
        <div class="title-wrapper">
          <h5 class="id">{{ pokemon().id }}</h5>
          <h5 class="name">{{ pokemon().name }}</h5>
        </div>
        <div class="type-wrapper">
          @for(type of pokemon().type; track type){
            <h6 class="type-item"
              [style.backgroundColor]="type | typeColor">
              {{ type }}
            </h6>
          }
        </div>
      </div>
      @if (isLoggedIn()) {
        <div role="button"
          (click)="toggleFavorite.emit(this.pokemon()['_id'])"
          tabindex="0"
          [attr.aria-disabled]="isProcessing() || isDisliked()"
          [style.pointer-events]="isProcessing() || isDisliked() ? 'none' : 'initial'"
          class="thumb-up-wrapper"
          [class.favorite]="isFavorite()"
          [title]="('pokemons.card.favoriteBtn.' +
            (isFavorite() ? 'remove' : 'add')) | translate"
          >
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M14.551 5.83017C14.0928 5.29173 13.3818 5.17752 12.8131 5.14488C12.2759 5.11225 11.5333 5.12857 10.6012 5.21015C10.8224 4.23116 11.1858 2.6811 11.3279 1.91423C11.4859 1.06578 11.012 0.315222 10.2062 0.0704757C9.43206 -0.157954 8.6737 0.184691 8.40512 0.86998L8.31032 1.09841C7.88375 2.24056 6.73041 5.2591 4.85032 5.81386C4.85032 5.81386 4.85032 5.81386 4.83452 5.81386C4.51854 5.45489 4.07617 5.24278 3.57059 5.24278H1.7063C0.758356 5.24278 0 6.02597 0 7.00495V12.8952C0 13.8742 0.758356 14.6574 1.7063 14.6574H3.58639C4.09196 14.6574 4.55014 14.4289 4.86612 14.07C5.79827 14.2658 9.43206 15 11.7229 15C12.5603 15 14.2982 15 14.5036 13.042C14.5984 12.2262 14.8827 9.46873 14.9775 7.91867C15.0565 6.90706 14.9301 6.27072 14.551 5.83017ZM3.58639 13.6457H1.7063C1.29553 13.6457 0.963745 13.3031 0.963745 12.8789V6.98864C0.963745 6.56441 1.29553 6.22177 1.7063 6.22177H3.58639C3.99717 6.22177 4.32895 6.56441 4.32895 6.98864V12.8789C4.32895 13.3031 3.99717 13.6457 3.58639 13.6457ZM14.0296 7.82078C13.919 9.37084 13.6346 12.112 13.5556 12.9115C13.4766 13.6457 13.1922 13.9721 11.7229 13.9721C9.70064 13.9721 6.44603 13.352 5.2769 13.1073C5.2927 13.0257 5.2927 12.9441 5.2927 12.8625V6.98864C5.2927 6.89074 5.2769 6.79284 5.2611 6.71126C7.50457 5.92807 8.6895 2.81163 9.19507 1.45737L9.27407 1.24526C9.38466 0.951562 9.73224 0.967879 9.90603 1.03314C10.0324 1.06578 10.4432 1.22894 10.3484 1.73475C10.1746 2.71374 9.63745 4.98172 9.47945 5.66701C9.44786 5.83017 9.47945 5.99334 9.59005 6.10755C9.68484 6.22177 9.84284 6.28703 10.0008 6.27072C10.9014 6.17282 11.6439 6.12387 12.2127 6.12387C12.4023 6.12387 12.5761 6.12387 12.7183 6.14018C13.287 6.17282 13.6188 6.28703 13.7926 6.48283C14.0138 6.71126 14.077 7.1518 14.0296 7.82078Z"
            [attr.fill]=" isFavorite() ? '#FFFFFF' : '#E4E4E4'"></path>
          </svg>
        </div>
      }
  `,
  styles: `
    :host {
      width: 90vw;
      max-width: 307px;
      display:flex;
      align-items: center;
      justify-content: center;
      flex-wrap:wrap;
      background-color: rgb(255, 255, 255);
      box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 20px -3px;
      border-radius: 18px;
      min-height: 168px;
      gap: 32px;
      padding: 25px 35px 25px 25px;
      box-sizing: border-box;
      position: relative;
      transition: 350ms linear;
    }

    .like-wrapper {
      position: absolute;
      right: 14px;
      top: 12px;
      font-size: 12px;
      color: #2F2F2F;
      cursor: default;
    }

    .img-wrapper {
      flex: 1 1 0%;
      max-height: 117px;
      min-width: 46px;
      max-width: 126px;
      display: flex;
      justify-content: center
    }

    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }

    .content-wrapper {
      flex: 1 1 0%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 6px;
    }

    .title-wrapper {
      display: flex;
      gap: 7px;
    }

    h5 {
      font-size: 12px;
      line-height: 14px;
      letter-spacing: 0.04em;
      margin: 0;

      &.id {
        color: rgb(158, 158, 158);
        font-weight: 900;
      }

      &.name {
        text-transform: uppercase;
        color: rgb(0, 0, 0);
        font-weight: 900;
      }
    }

    .type-wrapper {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .type-item {
      border-radius: 9.5px;
      font-size: 8px;
      line-height: 9px;
      letter-spacing: 0.04em;
      color: rgb(255, 255, 255);
      padding: 4px 10px;
      text-align: center;
      text-transform: uppercase;
      font-weight: 900;
      margin: 0;
    }

    .thumb-up-wrapper {
      position: absolute;
      border: 1px solid rgb(228, 228, 228);
      box-sizing: border-box;
      bottom: 10px;
      right: 10px;
      height: 29px;
      width: 29px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      &:not(.favorite) {
        background: transparent;
      }

      &.favorite {
        background: linear-gradient(202.48deg, rgb(242, 242, 242) 7.57%, rgb(207, 207, 207) 90.41%);
      }

      &:hover {
        background: rgba(0, 0, 0, 0.5);
      }
    }
    `
})
export class CardItemComponent implements OnInit, OnDestroy {
  private readonly HIDE_CARD_DELAY = 350;
  private timeoutId: ReturnType<typeof setTimeout> | null = null;
  pokemon = input.required<Pokemon>();
  isFavorite = input<boolean>(false);
  isLoggedIn = input<boolean>(false);
  isDisliked = input<boolean>(false);
  isProcessing = input<boolean>(false);
  toggleFavorite = output<Pokemon['_id']>();
  likeMapping: Record<string, string> = {
    '=0': 'empty',
    '=1': 'single',
    'other': 'multiple'
  }

  constructor() {
    effect(() => {
      if (this.isDisliked()) {
        this.cleanupTimeout()
        this.opacity = 0;
        this.timeoutId = setTimeout(() => {
          this.display = 'none';
        }, this.HIDE_CARD_DELAY);
      }
    })
  }

  @HostBinding('style.opacity')
  protected opacity = 0;
  @HostBinding('style.display')
  protected display = 'flex';

  ngOnInit(): void {
    this.timeoutId = setTimeout(() => {
      this.opacity = 1;
    });
  }

  ngOnDestroy(): void {
    this.cleanupTimeout();
  }

  cleanupTimeout(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}
