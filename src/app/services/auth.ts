import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from './storage';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private storage: StorageService, private router: Router) {}

  async register(user: any): Promise<void> {
    const users = (await this.storage.get('users')) || [];
    const exists = users.some((u: any) => u.email === user.email);
    if (exists) {
      throw new Error('El correo ya está registrado');
    }
    user.id = Date.now();
    users.push(user);
    await this.storage.set('users', users);
  }

  async login(email: string, password: string): Promise<boolean> {
    const users = (await this.storage.get('users')) || [];
    const user = users.find((u: any) => u.email === email && u.password === password);
    if (user) {
      await this.storage.set('currentUser', user);
      await this.storage.set('usuario', user);
      return true;
    }
    return false;
  }

  async logout(): Promise<void> {
    await this.storage.remove('currentUser');
    await this.storage.remove('usuario');
    this.router.navigate(['/login']);
  }

  async getCurrentUser(): Promise<any> {
    return (await this.storage.get('currentUser')) || (await this.storage.get('usuario'));
  }

  async isLoggedIn(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return !!user;
  }
}
