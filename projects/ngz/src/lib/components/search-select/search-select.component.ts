import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';
import { interval } from 'rxjs/internal/observable/interval';
import { debounce } from 'rxjs/operators';
import { SearchSelectInput, SearchSelectKeywordContext } from '../../core/types';
import { extractFromPath } from '../../helpers/lib.helper';

@Component({
  selector: 'ngz-search-select',
  templateUrl: './search-select.component.html',
  styleUrls: ['./search-select.component.css']
})
export class SearchSelectComponent  implements OnInit, OnChanges, OnDestroy {
  constructor() {}

  extractFromPath = extractFromPath;

  @Input() input: SearchSelectInput = {
    api: '',
    displayPath: 'name',
    selectedOptionPath: '',
  };

  @Input() context: any;

  @Output() onOptionSelected = new EventEmitter<any>(true);
  @Output() keywordSearch = new EventEmitter<SearchSelectKeywordContext>(true);

  selectedOption = {};
  showFilterMenu = false;
  options: any;
  keyword = '';
  debounceTime = 500;
  loading = false;
  urlParams: any = {};

  searchSelectForm: FormGroup = new FormGroup({
    keyword: new FormControl(),
  });

  observable: Subscription = new Subscription();

  ngOnInit(): void {
    this.observable = this.searchSelectForm.valueChanges
      .pipe(debounce(() => interval(this.debounceTime)))
      .subscribe((data) =>
        this.keywordSearch.emit({
          keyword: data.keyword,
          context: this.context,
        })
      );
  }

  ngOnChanges(): void {
    if (this.input.resetInput) {
      this.keyword = '';
      this.selectedOption = {};
    }
    if (this.input.options) {
      this.options = this.input.options;
    }
  }

  toggleFilterMenu = () => {
    this.showFilterMenu = !this.showFilterMenu;
  };

  selectOption(option: any) {
    this.selectedOption = option;
    this.toggleFilterMenu();
    this.onOptionSelected.emit(
      extractFromPath(this.input.selectedOptionPath, this.selectedOption)
    );
    this.input.displayText = extractFromPath(
      this.input.displayPath,
      this.selectedOption
    );
  }

  ngOnDestroy(): void {
    this.observable.unsubscribe();
  }
}

