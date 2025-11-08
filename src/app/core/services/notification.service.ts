import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, Observable, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private readonly toastr: ToastrService,
    private readonly translate: TranslateService,
  ) { }

  notifySuccess(prefix: string): Observable<string> {
    const suffix = '.messages.success';
    return this.translate.get(`${prefix}${suffix}`).pipe(
      tap((message) => this.toastr.success(message))
    )
  }

  notifyError(prefix: string): Observable<never> {
    const suffix = '.messages.error';

    return this.translate.get(`${prefix}${suffix}`).pipe(
      tap((message) => this.toastr.error(message)),
      switchMap(() => EMPTY),
    );
  }
}
