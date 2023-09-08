import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonSelectFormat, ButtonSelectOption } from '../../core/types';

@Component({
  selector: 'ngz-button-select',
  templateUrl: './button-select.component.html',
  styleUrls: ['./button-select.component.css']
})
export class ButtonSelectComponent {

  @Input() select!: ButtonSelectFormat;

  @Output() onSubmitEvent = new EventEmitter<ButtonSelectOption[]>(true);

  selectedOptions: ButtonSelectOption[] = [];

  toggleSelectOption(option: ButtonSelectOption) {
    if (option.selected) {
      this.removeSelection(option);
    } else {
      if (!this.select.multiselect && this.selectedOptions.length > 0) {
        for (let selectedOption of this.selectedOptions) {
          this.removeSelection(selectedOption);
        }
      }
      option.selected = true;
      this.selectedOptions.push(option);
    }
  }

  removeSelection(option: ButtonSelectOption) {
    const index = this.selectedOptions.indexOf(option);
    if (index > -1) {
      option.selected = false;
      this.selectedOptions.splice(index, 1);
    }
  }

  onSubmit() {
    this.onSubmitEvent.emit(this.selectedOptions);
  }
}
