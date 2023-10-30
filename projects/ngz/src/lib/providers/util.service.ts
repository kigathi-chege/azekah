import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { StorageService } from './storage.service';
import { PageOptionAction } from '../core/types';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  constructor(
    private _location: Location,
    private router: Router,
    private storageService: StorageService
  ) {}

  backClicked() {
    this._location.back();
  }

  forwardClicked() {
    this._location.forward();
  }

  goTo(action: PageOptionAction) {
    switch (action.type) {
      case 'call-back':
        action.call && action.call!(action?.args);
        break;
      case 'page-navigation':
        if (action.args) this.setRouteArgs(action.args);
        this.router.navigate([action.page]);
    }
  }

  async getAppHeaderHeight() {
    const appHeaderHeight = await this.storageService.get('appHeaderHeight');
    return appHeaderHeight || '0px';
  }

  async setRouteArgs(args: any) {
    const setRouteArgs = await this.storageService.set('routeArgs', args);
    return setRouteArgs;
  }
}
