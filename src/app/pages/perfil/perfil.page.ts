import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';
import { StorageService } from '../../services/storage';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule]
})
export class PerfilPage implements OnInit {

  usuario: any    = null;
  vehiculos: any[] = [];
  activeTab       = 'perfil';

  notificaciones  = true;
  unidades        = 'km';
  moneda          = 'COP';

  constructor(
    private storage: StorageService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.cargarDatos();
  }

  async ionViewWillEnter() {
    await this.cargarDatos();
  }

  async cargarDatos() {
    this.usuario    = (await this.storage.get('usuario'))    || null;
    this.vehiculos  = (await this.storage.get('vehiculos'))  || [];
    const config    = (await this.storage.get('config'))     || {};
    this.notificaciones = config.notificaciones ?? true;
    this.unidades       = config.unidades        ?? 'km';
    this.moneda         = config.moneda          ?? 'COP';
  }

  getIniciales(): string {
    if (!this.usuario?.nombre) return 'US';
    const partes = this.usuario.nombre.trim().split(' ');
    if (partes.length >= 2) {
      return (partes[0][0] + partes[1][0]).toUpperCase();
    }
    return partes[0].substring(0, 2).toUpperCase();
  }

  async guardarConfig() {
    await this.storage.set('config', {
      notificaciones: this.notificaciones,
      unidades:       this.unidades,
      moneda:         this.moneda
    });
  }

  async cambiarUnidades() {
    this.unidades = this.unidades === 'km' ? 'mi' : 'km';
    await this.guardarConfig();
  }

  async cambiarMoneda() {
    const opciones = ['COP', 'USD', 'EUR', 'MXN'];
    const idx = opciones.indexOf(this.moneda);
    this.moneda = opciones[(idx + 1) % opciones.length];
    await this.guardarConfig();
  }

  async respaldarDatos() {
    alert('Función de respaldo próximamente');
  }

  editarPerfil() {
    alert('Editar perfil próximamente');
  }

  async cerrarSesion() {
    if (confirm('¿Cerrar sesión?')) {
      await this.storage.set('usuario', null);
      this.router.navigate(['/login']);
    }
  }
}