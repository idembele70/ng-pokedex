import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { NavbarComponent } from "./core/components/navbar/navbar.component";
import { PokeballLoaderComponent } from './shared/components/pokeball-loader/pokeball-loader.component';
import { LoaderService } from './shared/services/loader.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    PokeballLoaderComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnDestroy, OnInit {
  readonly loaderService = inject(LoaderService);
  private timerSub?: Subscription;

  ngOnInit(): void {
    this.hideLoader();
  }
  ngOnDestroy(): void {
    this.cleanUpSubscription();
  }

  hideLoader() {
    this.timerSub?.unsubscribe();
    this.timerSub = timer(this.loaderService.DURATION)
      .subscribe(
        {
          next: () => this.loaderService.isLoading.set(false), 
          error: () => console.error('Error encountered cannot hide loader'),
        }
      );
  }

  private cleanUpSubscription() {
    this.timerSub?.unsubscribe();
  }
}
