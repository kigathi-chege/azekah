import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { PaginationService } from '../../providers/pagination.service';
import { PaginationData, PaginationMeta } from '../../core/types';

@Component({
  selector: 'ngz-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent  implements OnInit, OnChanges {
  meta: PaginationMeta = {
    per_page: 8,
    total: 0,
    current_page: 0,
    last_page: 0,
  };
  paginationService: PaginationService = new PaginationService();
  @Input() pagination_data?: PaginationData;
  page_limits: Array<number> = [5, 10, 20, 30, 40, 50];
  pages: any = [];
  currentPage: number = 0;
  isLastPage: boolean = false;
  isFirstPage: boolean = true;
  divider: boolean = true;

  @Output() newChangePageEvent = new EventEmitter<number>(true);

  ngOnInit(): void {
    this.bootstrap();
  }

  ngOnChanges() {
    if (this.pagination_data) {
      ({
        paginationMeta: this.meta,
        paginationService: this.paginationService,
      } = this.pagination_data);
    }
    this.bootstrap();
  }

  bootstrap() {
    this.paginationService.unsetPages();
    this.paginationService.setPages(this.meta.total, this.meta.per_page);
    this.pages = this.paginationService.getPages();
    this.currentPage = this.meta.current_page - 1;
    this.isLastPage = this.currentPage === this.meta.last_page;
    this.isFirstPage = this.currentPage === 0;
    this.divider = 'divider' in this.meta ? this.meta.divider! : this.divider;
  }

  changePage(page: number) {
    page = page + 1;
    this.newChangePageEvent.emit(page);
  }

  /**
   * This function changes the number of items per page.
   * Not currently implemented: would need to do a refetch.
   * @param limit
   */
  changePagination(limit: number) {
    this.meta.per_page = limit;
    this.paginationService.unsetPages();
    this.paginationService.setPages(this.meta.total, this.meta.per_page);
    this.pages = this.paginationService.getPages();
    this.changePage(0);
  }
}

