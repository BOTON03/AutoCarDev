import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../services/auth';
import { UiService } from '../../services/ui';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class RegisterPage {
  nombre = '';
  email = '';
  password = '';
  confirmPassword = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private ui: UiService
  ) {}

  async registrar() {
    if (this.password !== this.confirmPassword) {
      await this.ui.showAlert('Las contraseñas no coinciden');
      return;
    }
    try {
      await this.auth.register({ nombre: this.nombre, email: this.email, password: this.password });
      await this.ui.showToast('Usuario registrado', 'success');
      this.router.navigate(['/login']);
    } catch (error: any) {
      await this.ui.showAlert(error.message || 'No se pudo registrar el usuario');
    }
  }
}
