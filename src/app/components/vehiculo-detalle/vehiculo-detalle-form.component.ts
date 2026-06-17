import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../services/storage';
import { VehiculoFormComponent } from '../../components/vehiculo-form/vehiculo-form.component';
import { MantenimientoFormComponent } from '../../components/mantenimiento-form/mantenimiento-form.component';
import { UiService } from '../../services/ui';

@Component({
  selector: 'app-vehiculo-detalle',
  templateUrl: './vehiculo-detalle-form.component.html',
  styleUrls: ['./vehiculo-detalle-form.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class VehiculoDetallePage implements OnInit {

  vehiculo: any       = null;
  mantenimientos: any[] = [];
  gastos: any[]         = [];
  todosVehiculos: any[] = [];
  gastoTotal            = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storage: StorageService,
    private modalController: ModalController,
    private ui: UiService
  ) {}

  async ngOnInit() {
    await this.cargarDatos();
  }

  async ionViewWillEnter() {
    await this.cargarDatos();
  }

  async cargarDatos() {
    const id = this.route.snapshot.paramMap.get('id');
    this.todosVehiculos = (await this.storage.get('vehiculos'))      || [];
    const todosMant     = (await this.storage.get('mantenimientos')) || [];
    const todosGastos   = (await this.storage.get('gastos'))         || [];

    this.vehiculo = this.todosVehiculos.find(v => String(v.id) === id) || null;

    if (this.vehiculo) {
      this.mantenimientos = todosMant
        .filter((m: any) => String(m.vehiculoId) === id)
        .sort((a: any, b: any) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

      this.gastos = todosGastos
        .filter((g: any) => String(g.vehiculoId) === id)
        .sort((a: any, b: any) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
        .slice(0, 5);

      this.gastoTotal = todosGastos
        .filter((g: any) => String(g.vehiculoId) === id)
        .reduce((sum: number, g: any) => sum + (g.monto || 0), 0);
    }
  }

  volver() {
    this.router.navigate(['/vehiculos']);
  }

  async editar() {
    if (!this.vehiculo) return;
    const modal = await this.modalController.create({
      component: VehiculoFormComponent,
      componentProps: { vehiculo: this.vehiculo }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      const idx = this.todosVehiculos.findIndex(v => v.id === data.id);
      if (idx !== -1) {
        this.todosVehiculos[idx] = data;
        await this.storage.set('vehiculos', this.todosVehiculos);
        await this.cargarDatos();
      }
    }
  }

  async eliminar() {
    if (!this.vehiculo) return;
    const ok = await this.ui.confirm(`¿Eliminar vehículo ${this.vehiculo.placa}?`);
    if (ok) {
      const actualizados = this.todosVehiculos.filter(v => v.id !== this.vehiculo.id);
      await this.storage.set('vehiculos', actualizados);
      await this.ui.showToast('Vehículo eliminado', 'success');
      this.router.navigate(['/vehiculos']);
    }
  }

  async nuevoMantenimiento() {
    const modal = await this.modalController.create({
      component: MantenimientoFormComponent,
      componentProps: {
        vehiculos: this.todosVehiculos,
        mantenimiento: { vehiculoId: this.vehiculo?.id }
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      const todos = (await this.storage.get('mantenimientos')) || [];
      todos.push(data);
      await this.storage.set('mantenimientos', todos);
      await this.cargarDatos();
    }
  }

  getHeroClass(): string { return ''; }

  getIconClass(): string {
    switch (this.vehiculo?.combustible?.toLowerCase()) {
      case 'eléctrico': return 'icon-dark';
      case 'diesel':    return 'icon-gray';
      default:          return 'icon-blue';
    }
  }

  getStatusClass(): string {
    switch (this.vehiculo?.estado?.toLowerCase()) {
      case 'activo':    return 'badge-activo';
      case 'en taller': return 'badge-taller';
      default:          return 'badge-inactivo';
    }
  }

  getFuelIcon(): string {
    switch (this.vehiculo?.combustible?.toLowerCase()) {
      case 'eléctrico': return 'fas fa-bolt';
      case 'híbrido':   return 'fas fa-leaf';
      case 'diesel':    return 'fas fa-droplet';
      default:          return 'fas fa-gas-pump';
    }
  }

  getServiceClass(): string {
    const s = this.vehiculo?.proximoService;
    return s?.toLowerCase() === 'vencido' ? 'service-vencido' : 'service-ok';
  }

  esElectrico(): boolean {
    return this.vehiculo?.combustible?.toLowerCase() === 'eléctrico';
  }

  getGastoIcon(cat: string): string {
    const map: Record<string, string> = {
      combustible: 'fas fa-gas-pump',
      seguro:      'fas fa-file-lines',
      revision:    'fas fa-screwdriver-wrench',
      otros:       'fas fa-basket-shopping'
    };
    return map[cat] || 'fas fa-receipt';
  }

  getGastoIconClass(cat: string): string {
    const map: Record<string, string> = {
      combustible: 'gasto-icon-blue',
      seguro:      'gasto-icon-purple',
      revision:    'gasto-icon-dark',
      otros:       'gasto-icon-gray'
    };
    return map[cat] || 'gasto-icon-gray';
  }
}