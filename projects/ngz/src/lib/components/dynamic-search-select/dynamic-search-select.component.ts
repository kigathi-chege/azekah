import { Component, EventEmitter, Input, Output, ViewContainerRef } from '@angular/core';
import { FormInput } from '../../core/types';
import { SearchSelectInterface } from '../../interfaces/search-select-interface';

@Component({
  selector: 'lib-dynamic-search-select',
  templateUrl: './dynamic-search-select.component.html',
  styleUrls: ['./dynamic-search-select.component.css']
})
export class DynamicSearchSelectComponent {

  constructor(private containerRef: ViewContainerRef) {}

  @Input() formInput!: FormInput;
  @Output() onOptionSelect = new EventEmitter<FormInput>(true);

  ngOnInit(): void {
    this.loadComponent();
  }

  loadComponent(): void {
    const componentRef =
      this.containerRef.createComponent<SearchSelectInterface>(
        this.formInput.searchSelectComponent
      );
    componentRef.instance.context = this;
    componentRef.instance.hasBindOption = true;
    componentRef.instance.boundOnOptionSelected =
      this.onSearchSelectOptionSelected;
    if (this.formInput.searchSelectInput)
      componentRef.instance.searchSelectInput =
        this.formInput.searchSelectInput;
  }

  private onSearchSelectOptionSelected({ option, context }: any) {
    context.formInput.searchSelectOption = option;
    context.onOptionSelect.emit(context.formInput);
  }
}
