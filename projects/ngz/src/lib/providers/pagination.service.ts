import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PaginationService {
  pages: any = [];
  currentPage: number = 0;
  lastPage: boolean = false;
  firstPage: boolean = true;

  constructor() {}

  setPages(total: any, per_page?: number) {
    if (!per_page) {
      per_page = 8;
    }

    this.pages = [];
    let page = Math.ceil(total / per_page);
    for (let i = 0; i < page; i++) {
      this.pages.push(i);
    }
  }

  getPages() {
    return this.pages;
  }

  unsetPages() {
    this.pages = undefined;
  }

  getCurrentPage() {
    return this.currentPage;
  }

  isLastPage() {
    return this.lastPage;
  }

  isFirstPage() {
    return this.firstPage;
  }

  calculateLastPage(total: number, per_page: number) {
    return Math.ceil(total / per_page);
  }

  calculateCurrentPage(skip: number, per_page: number) {
    return skip / per_page + 1;
  }

  calculateNextPage(skip: number, take: number) {
    if (skip === 0) {
      return 1;
    }
    return Math.ceil(skip / take) + 1;
  }
}
