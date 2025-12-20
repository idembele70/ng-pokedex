import { Directive, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: 'input[appSearchInput]',
  standalone: true,
  host: {
    '(keydown)': "keyDown($event)",
    '(input)': 'onInput($event)',
    'class': 'base-input',
    'type': 'search',
    '[name]': "name()",
    'autocomplete': 'off',
    '[value]': 'value'

  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchInputDirective),
      multi: true
    }
  ],
})
export class SearchInputDirective implements ControlValueAccessor {
  name = input.required<string>(); 
  protected value = '';

  onChange: (value: string) => void = () => { };
  onTouched: () => void = () => { }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  writeValue(value: string): void {
    if (value) {
      this.value = value;
    }
  }

  keyDown(event: KeyboardEvent) {
    const target = event.target as HTMLInputElement;
    const allowedKeys = target.name === 'id' ? /\d/ : /[a-zA-Z]/
    if (!allowedKeys.test(event.key)) {
      event.preventDefault();
      return;
    }
  }

  onInput(event: Event) {
    const { value } = event.target as HTMLInputElement;
    this.writeValue(value);
    this.onChange(value);
    this.onTouched();
  }
}
