import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { lastValueFrom } from 'rxjs';

export type StorageTypeMap = {
  activeChannelToken: string;
  authToken: string;
  uiLocale: string | undefined;
  orderListLastCustomFilters: any;
  activeTheme: string;
  livePreviewCollectionContents: boolean;
  accessToken: string;
  appHeaderHeight: string;
  routeArgs: string;
  auxiliaryToken: string;
  activeOrderId: string;
  cartTotalQuantity: string;
};

export type StorageLocationBasedTypeMap = {
  shippingTestOrder: any;
  shippingTestAddress: any;
};

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(private location: Location, private storageMap: StorageMap) {}
  /**
   * Set a key-value pair in the StorageMap
   */
  public async set<K extends keyof StorageTypeMap>(
    key: K,
    value: StorageTypeMap[K]
  ) {
    const valueName = this.valueName(key, value);
    await lastValueFrom(this.storageMap.set(key, valueName));
  }

  /**
   * Set a key-value pair in the browser's LocalStorage
   */
  public setForLocalStorage<K extends keyof StorageTypeMap>(
    key: K,
    value: StorageTypeMap[K]
  ) {
    const valueName = this.valueName(key, value);
    localStorage.setItem(key, valueName);
  }

  /**
   * Set a key-value pair specific to the current location (url)
   */
  public async setForCurrentLocation<
    K extends keyof StorageLocationBasedTypeMap
  >(key: K, value: StorageLocationBasedTypeMap[K]) {
    const compositeKey = this.getLocationBasedKey(key);
    await this.set(compositeKey as any, value);
  }

  /**
   * Set a key-value pair in the browser's SessionStorage
   */
  public setForSession<K extends keyof StorageTypeMap>(
    key: K,
    value: StorageTypeMap[K]
  ): void {
    const valueName = this.valueName(key, value);
    sessionStorage.setItem(key, valueName);
  }

  /**
   * Get the value of the given key from StorageMap, SessionStorage or LocalStorage.
   */
  public async get<K extends keyof StorageTypeMap>(key: K) {
    let item: string | undefined | null = await lastValueFrom(
      this.storageMap.get(key, { type: 'string' })
    );
    if (!item) {
      item = sessionStorage.getItem(key) || localStorage.getItem(key);
    }
    let result: any;
    try {
      const keyForParsed = this.getKeyForParsed(key);
      const valueWasParsed = localStorage.getItem(keyForParsed);
      if (valueWasParsed && valueWasParsed === 'true') {
        result = JSON.parse(item || 'null');
      } else {
        result = item;
      }
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.error(
        `Could not parse the localStorage value for "${key}" (${item})`
      );
    }
    return result;
  }

  /**
   * Get the value of the given key for the current location (url)
   */
  public async getForCurrentLocation<
    K extends keyof StorageLocationBasedTypeMap
  >(key: K) {
    const compositeKey = this.getLocationBasedKey(key);
    const value: StorageLocationBasedTypeMap[K] = await this.get(
      compositeKey as any
    );
    return value;
  }

  public async remove(key: keyof StorageTypeMap) {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
    await lastValueFrom(this.storageMap.delete(key));
  }

  private getLocationBasedKey(key: string) {
    const path = this.location.path();
    return key + path;
  }

  private valueName(key: string, value: any): string {
    const keyForParsed = this.getKeyForParsed(key);
    if (typeof value === 'string') {
      localStorage.setItem(keyForParsed, 'false');
      return value;
    }
    localStorage.setItem(keyForParsed, 'true');
    return JSON.stringify(value);
  }

  async clearStorage() {
    localStorage.clear();
    sessionStorage.clear();
    await lastValueFrom(this.storageMap.clear());
  }

  private getKeyForParsed(key: string) {
    return `${key}Parsed`;
  }
}
