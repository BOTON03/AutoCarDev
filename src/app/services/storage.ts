import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storage: Storage | null = null;

  constructor() {
    this.init();
  }

  async init() {
    if (typeof window !== 'undefined' && 'localStorage' in window) {
      this.storage = window.localStorage;
    }
  }

  async get(key: string): Promise<any> {
    if (!this.storage) return null;
    const value = this.storage.getItem(key);
    return value ? JSON.parse(value) : null;
  }

  async set(key: string, value: any): Promise<void> {
    if (!this.storage) return;
    this.storage.setItem(key, JSON.stringify(value));
  }

  async remove(key: string): Promise<void> {
    if (!this.storage) return;
    this.storage.removeItem(key);
  }

  async clear(): Promise<void> {
    if (!this.storage) return;
    this.storage.clear();
  }
}