import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { StorageService } from '../../services/storage';
import { RecordatorioService } from '../../services/recordatorio';
import { MantenimientoFormComponent } from '../../components/mantenimiento-form/mantenimiento-form.component';

@Component({
  selector: 'app-mantenimientos',
  templateUrl: './mantenimientos.page.html',
  styleUrls: ['./mantenimientos.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule]
})
export class MantenimientosPage implements OnInit {

  mantenimientos: any[] = [];
  mantenimientosFiltrados: any[] = [];
  vehiculos: any[] = [];
  filtroActual = 'todos';
  activeTab: string = 'mantenimientos';

  constructor(
    private storage: StorageService,
    private modalController: ModalController,
    @Inject(RecordatorioService) private recordatorioService: RecordatorioService
  ) {}

  async ngOnInit() {
    await this.cargarDatos();
  }

  async ionViewWillEnter() {
    await this.cargarDatos();
  }

  async cargarDatos() {
    this.mantenimientos = (await this.storage.get('mantenimientos')) || [];
    this.vehiculos      = (await this.storage.get('vehiculos'))      || [];
    this.aplicarFiltro();
  }

  aplicarFiltro() {
    if (this.filtroActual === 'todos') {
      this.mantenimientosFiltrados = [...this.mantenimientos];
    } else {
      this.mantenimientosFiltrados = this.mantenimientos.filter(
        m => m.tipo === this.filtroActual
      );
    }
    this.mantenimientosFiltrados.sort(
      (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    );
  }

  get mantenimientosPendientes() {
    return this.mantenimientos.filter(m => m.estado === 'pendiente');
  }

  get mantenimientosCompletados() {
    return this.mantenimientos.filter(m => m.estado === 'completado');
  }

  filtrarPorTipo(tipo: string) {
    this.filtroActual = tipo;
    this.aplicarFiltro();
  }

  getMantIcon(tipo: string): string {
    switch (tipo?.toLowerCase()) {
      case 'preventivo':  return 'fas fa-screwdriver-wrench';
      case 'correctivo':  return 'fas fa-gear';
      case 'frenos':      return 'fas fa-circle-stop';
      case 'aceite':      return 'fas fa-oil-can';
      default:            return 'fas fa-screwdriver-wrench';
    }
  }

  getEstadoClass(estado: string): string {
    return estado?.toLowerCase() === 'completado'
      ? 'badge-completado'
      : 'badge-pendiente';
  }

  getPlacaVehiculo(vehiculoId: any): string {
    const v = this.vehiculos.find(v => v.id === vehiculoId);
    return v ? v.placa : 'Sin vehículo';
  }

  getNombreVehiculo(vehiculoId: any): string {
    const v = this.vehiculos.find(v => v.id === vehiculoId);
    return v ? `${v.placa} - ${v.marca}` : 'No especificado';
  }

  async nuevoMantenimiento() {
    if (this.vehiculos.length === 0) {
      alert('Primero debe registrar un vehículo');
      return;
    }
    const modal = await this.modalController.create({
      component: MantenimientoFormComponent,
      componentProps: { vehiculos: this.vehiculos }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      this.mantenimientos.push(data);
      await this.storage.set('mantenimientos', this.mantenimientos);
      await this.recordatorioService.generarRecordatoriosAutomaticos();
      await this.cargarDatos();
    }
  }

  async cambiarEstado(mantenimiento: any) {
    mantenimiento.estado = mantenimiento.estado === 'completado'
      ? 'pendiente'
      : 'completado';
    await this.storage.set('mantenimientos', this.mantenimientos);
    await this.cargarDatos();
  }

  async eliminarMantenimiento(mantenimiento: any) {
    if (confirm('¿Eliminar este mantenimiento?')) {
      this.mantenimientos = this.mantenimientos.filter(
        m => m.id !== mantenimiento.id
      );
      await this.storage.set('mantenimientos', this.mantenimientos);
      await this.cargarDatos();
    }
  }

  verDetalles(mantenimiento: any) {
    console.log('Ver detalles de:', mantenimiento);
  }
}