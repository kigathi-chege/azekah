import { FormGroup } from '@angular/forms';
import { FormInput, FormFormatOptions, ClearErrorHelpInputsFormat, FormFormat, ErrorHelpFormat } from '../core/types';

export function prepareErrorHelpMessages(result: any) {
  const errorKeys = Object.keys(result);
  const errors = [];
  for (let errorKey of errorKeys) {
    errors.push({ input: errorKey, message: result[errorKey][0] });
  }
  return errors;
}

export function setErrorHelp(
  form: FormGroup,
  formInputs: FormInput[],
  errors: ErrorHelpFormat[],
  formFormatOptions?: FormFormatOptions
) {
  // TODO: Kigathi - 4 July 2023 - Ensure that when set errors, form status is also updated to invalid to prevent submission.
  for (let formInput of formInputs) {
    formInput.default = form.value[formInput.name];
    const error = errors.find(
      (error: ErrorHelpFormat) => error.input === formInput.name
    );
    if (error) {
      formInput.default = form.value[formInput.name];
      formInput.options = {
        ...formInput.options,
        error: error.message,
      };
    }
  }
  return setForm(formInputs, formFormatOptions);
}

export function confirmErrorHelp(input: string, formInputs: FormInput[]) {
  const formInput = formInputs.find(
    (formInput: FormInput) => formInput.name === input
  );

  if (!formInput) return false;
  if (formInput.options?.error) return true;

  return false;
}

export function clearErrorHelp(
  form: FormGroup,
  formInputs: FormInput[],
  inputs: ClearErrorHelpInputsFormat,
  formFormatOptions?: FormFormatOptions
) {
  for (let formInput of formInputs) {
    formInput.default = form.value[formInput.name];
    if (typeof inputs === 'string') {
      formInput.options = {
        ...formInput.options,
        error: undefined,
      };
    } else {
      if (inputs.includes(formInput.name)) {
        formInput.options = {
          ...formInput.options,
          error: undefined,
        };
      }
    }
  }
  return setForm(formInputs, formFormatOptions);
}

export function setForm(
  form_inputs: FormInput[],
  form_format_options?: FormFormatOptions
): FormFormat {
  return { form_inputs, ...form_format_options };
}
