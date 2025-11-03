import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [
    TranslatePipe,
],
  template: `
    <form>
      <input
        type="search"
        name="name"
        #name
        autocomplete="off"
        [placeholder]="'searchBars.nameInput.placeholder' | translate"
      />
      <div>
        <input
          type="search"
          name="id"
          #id
          autocomplete="off"
          [placeholder]="'searchBars.idInput.placeholder' | translate"
        />
        <input
          type="search"
          name="type"
          #type
          autocomplete="off"
          [placeholder]="'searchBars.typeInput.placeholder' | translate"
        />
      </div>
    </form>
  `,
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {

}
