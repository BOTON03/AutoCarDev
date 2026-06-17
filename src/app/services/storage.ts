import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private memory = new Map<string, string>();
  private ready: Promise<void>;

  constructor() {
    this.ready = this.init();
  }

  private async init(): Promise<void> {
    try {
      const { keys } = await Preferences.keys();
      for (const key of keys) {
        const { value } = await Preferences.get({ key });
        if (value !== null) {
          this.memory.set(key, value);
        }
      }
    } catch {
      if (typeof window !== 'undefined' && window.localStorage) {
        for (let i = 0; i < window.localStorage.length; i++) {
          const key = window.localStorage.key(i);
          if (key) {
            const value = window.localStorage.getItem(key);
            if (value !== null) {
              this.memory.set(key, value);
            }
          }
        }
      }
    }
  }

  private async persist(key: string, value: string | null): Promise<void> {
    try {
      if (value === null) {
        await Preferences.remove({ key });
      } else {
        await Preferences.set({ key, value });
      }
    } catch {
      if (typeof window !== 'undefined' && window.localStorage) {
        if (value === null) {
          window.localStorage.removeItem(key);
        } else {
          window.localStorage.setItem(key, value);
        }
      }
    }
  }

  async get(key: string): Promise<any> {
    await this.ready;
    const value = this.memory.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set(key: string, value: any): Promise<void> {
    await this.ready;
    const serialized = JSON.stringify(value);
    this.memory.set(key, serialized);
    await this.persist(key, serialized);
  }

  async remove(key: string): Promise<void> {
    await this.ready;
    this.memory.delete(key);
    await this.persist(key, null);
  }

  async clear(): Promise<void> {
    await this.ready;
    this.memory.clear();
    try {
      await Preferences.clear();
    } catch {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.clear();
      }
    }
  }
}
