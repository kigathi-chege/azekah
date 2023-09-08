import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { CardFooterAction, CardFormat, CardListFormat, PaginationData } from '../../core/types';
import { PaginationService } from '../../providers/pagination.service';
import { getCardInput } from '../../helpers/data.helper';

@Component({
  selector: 'ngz-list-card',
  templateUrl: './list-card.component.html',
  styleUrls: ['./list-card.component.scss'],
})
export class ListCardComponent implements OnChanges {
  @Input() cardData: any;
  @Input() cardListFormat: CardListFormat = {
    loading: true,
    columns: {},
    keys: [''],
    style: 'vertical',
  };
  @Output() cardClickEmitter = new EventEmitter();
  @Output() footerActionEmitter = new EventEmitter();
  @Output() fetchPageData = new EventEmitter();
  cardInput: CardFormat = { loading: true, index: 0, style: 'vertical' };
  pagination_data?: PaginationData;
  top_image: any = false;
  getCardInput = getCardInput;

  constructor(public paginationService: PaginationService) {}

  ngOnChanges(): void {
    ({ loading: this.cardInput.loading, style: this.cardInput.style } =
      this.cardListFormat);
    if (this.cardListFormat.meta) {
      this.pagination_data = {
        paginationMeta: this.cardListFormat.meta,
        paginationService: this.paginationService,
      };
    }
  }

  changePage(page: number) {
    let skip = (page - 1) * this.cardListFormat.meta!.per_page;
    this.fetchPageData.emit({ skip, take: this.cardListFormat.meta!.per_page });
  }

  // changePageLimit(limit: number) {
  //   this.page_limit = limit;
  //   this.getTransactions(true, undefined, this.period.value, this.page_limit);
  // }

  public onCardClick(item_id: number) {
    this.cardClickEmitter.emit(item_id);
  }

  public onFooterAction(action: CardFooterAction) {
    this.footerActionEmitter.emit(action);
  }
}
