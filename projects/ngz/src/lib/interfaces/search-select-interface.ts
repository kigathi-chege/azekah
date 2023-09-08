import { AnonymousFn, ExtendsSearchSelectInput } from '../core/types';

export interface SearchSelectInterface {
  hasBindOption: boolean;
  boundOnOptionSelected: AnonymousFn;
  searchSelectInput: ExtendsSearchSelectInput;
  context: any;
  detectChanges: AnonymousFn;
}
