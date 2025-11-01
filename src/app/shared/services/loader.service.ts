import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  readonly isLoading = signal<boolean>(true);
  readonly DURATION = 1500;
  constructor() { }
}
