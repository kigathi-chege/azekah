import { PaginationService } from "../providers/pagination.service";

export interface JSONValue {
  [key: string]: string | number | boolean | JSONValueObject | JSONValueArray;
}

export interface JSONValueObject {
  [key: string]: JSONValue;
}

export interface JSONValueArray extends Array<JSONValue> {}

export interface StringOrObject {
  [x: string]: string[] | string;
}

export interface Obj {
  [x: string]: string | string[] | number | number[] | boolean | boolean[];
}

export interface ArrayOfObjects extends Array<Obj | Record<string, Obj>> {}

export type ID = number | string;

export type ToasterPositions = 'top-end';

export interface ToasterCustomClasses {
  confirmButton?: string;
  cancelButton?: string;
}

export type ToasterType = 'error' | 'success' | 'warning' | 'info' | 'question';

export type UrlType = 'mradi' | 'constable';

export type AnonymousFn = (...args: any) => any;

export type HeaderType = 'minimal' | 'default' | 'store-front';

export interface ToasterOptions {
  toast?: boolean;
  position?: ToasterPositions;
  showConfirmButton?: boolean;
  showCancelButton?: boolean;
  timer?: number;
  timerProgressBar?: boolean;
  customClass?: ToasterCustomClasses;
  buttonsStyling?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  reverseButtons?: boolean;
}

export interface ToasterResult {
  isConfirmed?: boolean;
  isDenied?: boolean;
  isDismissed?: boolean;
  dismiss?: string;
}

export interface CardChatFormat {
  columns: CardChatColumnFormat[];
  loading: boolean;
  chatName: string;
  chatIcon: string;
  chatTime: string;
  class?: string;
}

export interface CardChatColumnFormat {
  owner: boolean;
  message: string;
  time: string;
  id: number;
}

export interface CardListFormat {
  columns: ColumnFormat;
  keys: string[];
  meta?: PaginationMeta;
  loading: boolean;
  style: CardStyleFormat;
  horizontalCardStyleRatio?: HorizontalCardStyleRatios;
  topImageWrapperClass?: string;
  bodyWrapperClass?: string;
  footer?: CardFooterDescription;
  class?: string;
}

export type CardStyleFormat = 'horizontal' | 'vertical';

export type HorizontalCardStyleRatios = '1:11' | '2:10' | '3:9' | '4:8';

export interface CardFormat {
  loading: boolean;
  index: number | string;
  header?: HeaderDescription;
  footer?: CardFooterFormat;
  top_image?: SimpleDescription;
  title?: ColumnWithBadgeDescription;
  subtitle?: CardDescription;
  text?: CardDescription;
  sub_text?: SubTextDescription;
  style: CardStyleFormat;
  horizontalCardStyleRatio?: HorizontalCardStyleRatios;
  topImageWrapperClass?: string;
  bodyWrapperClass?: string;
  card_title_class?: string;
  card_subtitle_class?: string;
  card_text_class?: string;
  card_sub_text_class?: string;
  card_body_class?: string;
  card_header_class?: string;
  card_whole_class?: string;
  card_shadow_color?: string;
}

export interface CardDescriptor {
  value: string | string[];
  class_?: string | string[];
  class_specific?: string | string[];
  pipe?: any;
  pipe_args?: string[];
  appends?: AppendDescriptor;
}

export interface CardDescription extends CardDescriptor {
  prefix?: CardDescriptor;
  alt?: string[] | string;
}

export interface AppendDescriptor extends CardDescriptor {
  type: AppendType;
  conditional?: boolean;
}

export interface ColumnWithBadgeDescription extends CardDescription {
  badge?: SimpleDescription;
}

export interface HeaderDescription extends CardDescription {
  image?: SimpleDescription;
  badge?: SimpleDescription;
}

export interface SubTextDescription extends CardDescription {
  position?: 'start' | 'end' | 'distribute';
}

export interface SimpleDescription {
  value: string;
  class_?: string;
}

export interface KeyValueDescription {
  value: string;
  key: string;
}

export interface ComplexDescription {
  raw?: boolean;
  rawValue?: string;
  conditional?: boolean;
  alt?: boolean;
  column?: string | string[];
  class_?: string;
}

export interface SimpleImageDescription extends SimpleDescription {
  width?: string;
  height?: string;
}

export interface ColumnFormat {
  header?: ColumnHeaderDescription;
  title?: ColumnWithBadgeDescriptor;
  subtitle?: ColumnDescription;
  text?: ColumnDescription;
  sub_text?: SubTextDescriptor;
  top_image?: ComplexDescription;
  toggle?: ToggleFormat;
  card_title_class?: string;
  card_subtitle_class?: string;
  card_text_class?: string;
  card_sub_text_class?: string;
  card_body_class?: string;
  card_header_class?: string;
  card_whole_class?: CardWholeClassDescription[];
  card_shadow_color?: string;
}

export interface SubTextDescriptor extends ColumnDescription {
  position?: 'start' | 'end' | 'distribute';
}

export interface ColumnWithBadgeDescriptor extends ColumnDescription {
  badge?: ComplexDescription;
}

export interface ColumnHeaderDescription extends ColumnDescription {
  image?: ComplexDescription;
  badge?: ComplexDescription;
}

export interface CardWholeClassDescription {
  raw?: boolean;
  rawValue?: string;
  column?: string | string[];
  appendRawToColumn?: string;
}

export interface ColumnDescription extends PrefixFormat {
  prefix?: PrefixFormat;
  alt?: string[] | string;
}

export interface PrefixFormat {
  raw?: boolean;
  column?: string[] | string;
  rawValue?: string[] | string;
  separator?: DescriptionSeparators;
  class_?: string[] | string;
  class_specific?: string | string[];
  pipe?: any;
  pipe_args?: string[];
  appends?: AppendDescription;
}

export interface AppendDescription extends PrefixFormat {
  type: AppendType;
  conditional?: boolean;
}

export type DescriptionSeparators = 'space' | 'new-line';

export type AppendType = 'pre' | 'post' | 'truncate';

export type CardFooterActions =
  | 'delete'
  | 'edit'
  | 'toggle'
  | 'like'
  | 'unlike'
  | 'comment'
  | 'cart'
  | 'comment'
  | 'text-display';

export interface CardFooterAction {
  action: CardFooterActions;
  class_?: string;
  toasty?: boolean;
  args?: any;
  position?: 'start' | 'center' | 'end';
  label?: string;
  column?: string | string[];
  conditions?: CardFooterActionColumnConditions[];
}

export interface CardFooterActionColumnConditions {
  value: string;
  class_?: string;
  replaceWith?: string;
}

export interface CardFooterUserAction {
  instance: any;
  action: CardFooterAction;
}

export interface ToggleFormat {
  value: string;
  on_label: string;
  off_label: string;
}

export interface CardFooterFormat {
  loading: boolean;
  cardFooterActions: CardFooterAction[];
  style: CardStyleFormat;
  border?: boolean;
  id: string | number;
  class_?: string;
  options_class_?: string;
}

export interface CardFooterDescription {
  cardFooterActions: CardFooterAction[];
  border?: boolean;
  class_?: string;
  options_class_?: string;
}

export interface EditFormat {
  url: string;
}

export interface DeleteFormat {
  url: string;
}

export interface PaginationMeta {
  total: number;
  current_page: number;
  last_page: number;
  per_page: number;
  divider?: boolean;
}

export interface PageOptionFormat {
  optionsClass?: string;
  title?: PageOptionTitlesFormat;
  subtitle?: PageOptionTitlesFormat;
  refresh?: boolean;
  navigation?: boolean;
  endOptions?: PageOption[];
  startOptions?: PageOption[];
  centerOptions?: PageOption[];
}

export interface PageOption {
  widget?: 'text' | 'button' | 'switch' | 'image';
  label?: string;
  action?: PageOptionAction;
  class?: string;
  icon?: string;
  attributes?: KeyValueDescription[];
  image?: SimpleImageDescription;
}

export interface PageOptionAction {
  type: 'page-navigation' | 'call-back';
  page?: string;
  call?: AnonymousFn;
  args?: JSONValue | AnonymousFn | object;
}

export interface PageOptionTitlesFormat {
  value: string;
  class_?: string;
  position?: 'start' | 'center' | 'end';
}

export interface FormInputOptions {
  input?: AnonymousFn;
  keypress?: AnonymousFn;
  paste?: AnonymousFn;
  required?: boolean;
  help?: AnonymousFn;
  error?: string;
}

export interface FormInput {
  type: FormInputType;
  textarea_rows?: number;
  searchSelectComponent?: any;
  searchSelectInput?: ExtendsSearchSelectInput;
  searchSelectOption?: any;
  name: string;
  label?: LabelFormat;
  id: string;
  place_holder?: string;
  labelAfter?: boolean;
  formControl?: boolean;
  required?: boolean;
  options?: FormInputOptions;
  default?: any;
  input_class?: string;
  input_wrapper_class?: string;
  select_options?: SelectInputOption[];
}

export type FormInputType =
  | 'text'
  | 'number'
  | 'textarea'
  | 'checkbox'
  | 'select'
  | 'email'
  | 'password'
  | 'search-select';

export type ClearErrorHelpInputsFormat = string[] | '*';

export interface ErrorHelpFormat {
  input: string;
  message: string;
}

export interface ButtonSelectOption {
  label: string;
  value: string;
  selected?: boolean;
}

export interface ButtonSelectFormat {
  wrapper_class?: string;
  header?: string;
  subheader?: string;
  multiselect: boolean;
  options: ButtonSelectOption[];
}

export interface SelectInputOption {
  value: string;
  label: string;
  default?: boolean;
}

export interface LabelFormat {
  labelAfter?: boolean;
  for?: string;
  class?: string;
  label: string;
}

export interface FormFormatOptions {
  form_header?: string;
  context?: any;
  form_class?: string;
  form_wrapper_class?: string;
  no_submit_button?: boolean;
  submit_button_label?: string;
  submit_button_class?: string;
  submit_button_label_class?: string;
}

export interface FormFormat extends FormFormatOptions {
  form_inputs: FormInput[];
}

export interface ExtendsSearchSelectInput {
  label?: string;
  displayText?: string;
  isDisabled?: boolean;
  clearFilter?: boolean;
  getObj?: boolean;
  getData?: AnonymousFn;
  context?: any;
  options?: any;
  displayPath?: string;
  selectedOptionPath?: string;
}

export interface SearchSelectInput {
  api?: string;
  isGql?: boolean;
  label?: string;
  displayText?: string;
  displayPath: string;
  resetInput?: boolean;
  formSelectSmall?: string;
  isDisabled?: boolean;
  options?: any;
  selectedOptionPath: string;
}

export interface SearchSelectComponentRefArgs {
  component: any;
  optionIdentifier: string;
  label: string;
  onOptionSelected?: AnonymousFn;
  required?: boolean;
  selected_option?: any;
}

export type CompoundSearchSelectComponentRefArgs = SearchSelectComponentRefArgs[];

export interface SearchSelectKeywordContext {
  keyword: string;
  context: any;
}

export interface PaginationData {
  paginationService: PaginationService;
  paginationMeta: PaginationMeta;
}