import { CommonModule } from '@angular/common';
import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-primary-select',
  standalone: true,
  imports: [ FormsModule, CommonModule ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PrimarySelectComponent),
      multi: true
    }
  ],
  templateUrl: './primary-select.component.html',
  styleUrl: './primary-select.component.scss'
})
export class PrimarySelectComponent implements ControlValueAccessor {
  @Input() options: { value: any; label: string }[] = [];
  @Input() placeholder: string = 'Select an option';
  @Input() label: string = '';
  @Input() selectName: string = '';

  value: any;
  onChange = (value: any) => {};
  onTouched = () => {};

  onSelectChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.value = value;
    this.onChange(value);
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    //isDisabled ? this.control.disable() : this.control.enable();
  }
}
