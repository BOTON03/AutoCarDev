import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { StorageService } from '../../services/storage';
import { GastoFormComponent } from '../../components/gasto-form/gasto-form.component';

@Component({
  selector: 'app-gastos',
  templateUrl: './gastos.page.html',
  styleUrls: ['./gastos.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule]
})
export class GastosPage implements OnInit {

  gastos: any[] = [];
  gastosFiltrados: any[] = [];
  vehiculos: any[] = [];
  usuario: any = null;

  periodo = 'mes';
  categoria = 'todos';
  totalMes = 0;
  activeTab: string = 'gastos';

  periodos = [
    { valor: 'mes',    nombre: 'Este mes' },
    { valor: '3meses', nombre: 'Últimos 3 meses' },
    { valor: '6meses', nombre: 'Últimos 6 meses' },
    { valor: 'año',    nombre: 'Último año' }
  ];

  categorias = [
    { valor: 'todos',       nombre: 'Todos' },
    { valor: 'combustible', nombre: 'Combustible' },
    { valor: 'seguro',      nombre: 'Seguro' },
    { valor: 'revision',    nombre: 'Revisión' },
    { valor: 'otros',       nombre: 'Otros' }
  ];

  constructor(
    private storage: StorageService,
    private modalController: ModalController
  ) {}

  async ngOnInit() {
    await this.cargarDatos();
  }

  async ionViewWillEnter() {
    await this.cargarDatos();
  }

  async cargarDatos() {
    this.gastos    = (await this.storage.get('gastos'))    || [];
    this.vehiculos = (await this.storage.get('vehiculos')) || [];
    this.usuario   = (await this.storage.get('usuario'))   || null;
    this.filtrarGastos();
  }

  setCategoria(cat: string) {
    this.categoria = cat;
    this.filtrarGastos();
  }

  filtrarGastos() {
    let filtrados = [...this.gastos];
    const hoy = new Date();
    const fechaLimite = new Date();

    switch (this.periodo) {
      case 'mes':    fechaLimite.setMonth(hoy.getMonth() - 1);       break;
      case '3meses': fechaLimite.setMonth(hoy.getMonth() - 3);       break;
      case '6meses': fechaLimite.setMonth(hoy.getMonth() - 6);       break;
      case 'año':    fechaLimite.setFullYear(hoy.getFullYear() - 1);  break;
    }

    filtrados = filtrados.filter(g => new Date(g.fecha) >= fechaLimite);

    if (this.categoria !== 'todos') {
      filtrados = filtrados.filter(g => g.categoria === this.categoria);
    }

    this.gastosFiltrados = filtrados.sort(
      (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    );

    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    this.totalMes = this.gastos
      .filter(g => new Date(g.fecha) >= inicioMes)
      .reduce((sum, g) => sum + g.monto, 0);
  }

  formatMonto(valor: number): string {
    return '$' + valor.toLocaleString('es-CO', { minimumFractionDigits: 0 });
  }

  getIconoCategoria(cat: string): string {
    const icons: Record<string, string> = {
      combustible: 'fas fa-gas-pump',
      seguro:      'fas fa-file-lines',
      revision:    'fas fa-screwdriver-wrench',
      otros:       'fas fa-basket-shopping'
    };
    return icons[cat] || 'fas fa-receipt';
  }

  getIconClass(cat: string): string {
    const clases: Record<string, string> = {
      combustible: 'icon-blue',
      seguro:      'icon-blue',
      revision:    'icon-dark',
      otros:       'icon-gray'
    };
    return clases[cat] || 'icon-gray';
  }

  getCategoriaLabel(cat: string): string {
    const labels: Record<string, string> = {
      combustible: 'Combustible',
      seguro:      'Seguro',
      revision:    'Revisión',
      otros:       'Otros'
    };
    return labels[cat] || cat;
  }

  getNombreVehiculo(vehiculoId: any): string {
    const v = this.vehiculos.find(v => v.id === vehiculoId);
    return v ? v.placa : 'Sin vehículo';
  }

  async nuevoGasto() {
    if (this.vehiculos.length === 0) {
      alert('Primero debe registrar un vehículo');
      return;
    }
    const modal = await this.modalController.create({
      component: GastoFormComponent,
      componentProps: { vehiculos: this.vehiculos }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      this.gastos.push(data);
      await this.storage.set('gastos', this.gastos);
      await this.cargarDatos();
    }
  }

  async eliminarGasto(gasto: any) {
    if (confirm('¿Eliminar este gasto?')) {
      this.gastos = this.gastos.filter(g => g.id !== gasto.id);
      await this.storage.set('gastos', this.gastos);
      await this.cargarDatos();
    }
  }
}