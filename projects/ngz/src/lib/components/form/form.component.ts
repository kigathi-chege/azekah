import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { isObjectEmpty } from '../../helpers/lib.helper';
import { AnonymousFn, FormFormat, FormInput } from '../../core/types';
import { toast } from '../../helpers/toaster';

@Component({
  selector: 'ngz-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent  implements OnInit, OnChanges {
  @Input() form: FormFormat = { form_inputs: [] };
  @Input() postURL: string | undefined;
  @Input() successNavigate = '/dashboard';
  @Input() options: any = {};
  @Input() boundOnSubmit?: AnonymousFn;
  @Input() hasBindOption = false;

  @Output() onSubmitEvent = new EventEmitter<any>(true);

  hasOptions = !isObjectEmpty(this.options);

  constructor(
    private formBuilder: FormBuilder,
    // private httpService: HttpService,
    private router: Router
  ) {
    this.form_group = this.formBuilder.group({});
  }

  form_elements: any = {};
  form_group: any = {};
  submit_callback: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['form']) {
      this.initForm();
    }
    if (changes['options']) {
      this.hasOptions = !isObjectEmpty(this.options);
    }
  }

  ngOnInit(): void {}

  initForm() {
    this.form_elements = {};
    for (let form_element of this.form.form_inputs) {
      if (form_element.type !== 'search-select') {
        const defaultValue =
          form_element.type === 'select'
            ? form_element.select_options?.find((option) => option.default)
                ?.value
            : form_element.default;

        this.form_elements[form_element.name] = defaultValue ?? null;
      }
    }
    this.form_group = this.formBuilder.group(this.form_elements);
  }

  onSubmit() {
    if (this.form_group.valid) {
      let data: any = {};
      for (let input of this.form.form_inputs) {
        switch (input.type) {
          case 'search-select':
            data[input.name] = input.searchSelectOption;
            break;
          default:
            data[input.name] = this.form_group.value[input.name];
        }
        if (input.required && !data[input.name]) {
          toast(
            'error',
            `${
              input.label?.label ||
              input.searchSelectInput?.label?.replace('Select', '') ||
              'Missing input'
            } is required`
          );
          return;
        }
      }

      if (!this.postURL) {
        this.hasBindOption
          ? this.boundOnSubmit!({ ...data, form: this.form_group })
          : this.onSubmitEvent.emit({ ...data, form: this.form_group });
        return;
      }

      // this.httpService
      //   .post({ url: this.postURL, urlType: 'constable', data })
      //   .subscribe({
      //     next: () => this.router.navigateByUrl(this.successNavigate),
      //   });
    }
  }

  inputFunc(f: any, e: any) {
    f(e);
  }

  helpFunc(f: any) {
    return f(this.form_group, this.form.context);
  }

  onSearchSelectOptionSelected(formInput: FormInput) {
    const inputIndex = this.form.form_inputs.findIndex(
      (input: FormInput) => input.name === formInput.name
    );
    this.form.form_inputs[inputIndex] = formInput;
  }
}

