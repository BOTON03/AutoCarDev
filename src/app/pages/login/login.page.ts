import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class LoginPage {
  modo = 'login';
  loginEmail = '';
  loginPassword = '';
  nombre = '';
  emailRegistro = '';
  passwordRegistro = '';

  constructor(private auth: AuthService, private router: Router) {}

  async iniciarSesion() {
    if (!this.loginEmail || !this.loginPassword) {
      alert('Complete todos los campos');
      return;
    }
    const ok = await this.auth.login(this.loginEmail, this.loginPassword);
    if (ok) {
      this.router.navigate(['/dashboard']);
    } else {
      alert('Credenciales incorrectas');
    }
  }

  async registrar() {
    if (!this.nombre || !this.emailRegistro || !this.passwordRegistro) {
      alert('Complete todos los campos');
      return;
    }
    await this.auth.register({
      nombre: this.nombre,
      email: this.emailRegistro,
      password: this.passwordRegistro
    });
    alert('Usuario registrado. Inicia sesión.');
    this.modo = 'login';
    this.loginEmail = this.emailRegistro;
  }
}