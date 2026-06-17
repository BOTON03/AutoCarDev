import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { StorageService } from '../../services/storage';
import { RecordatorioFormComponent } from '../../components/recordatorio-form/recordatorio-form.component';

@Component({
  selector: 'app-recordatorios',
  templateUrl: './recordatorios.page.html',
  styleUrls: ['./recordatorios.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule]
})
export class RecordatoriosPage implements OnInit {

  recordatorios: any[] = [];
  vehiculos: any[]     = [];
  vehiculosActivos     = 0;
  activeTab: string    = 'alertas';

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
    this.recordatorios = (await this.storage.get('recordatorios')) || [];
    this.vehiculos     = (await this.storage.get('vehiculos'))     || [];
    this.vehiculosActivos = this.vehiculos.filter(
      v => v.estado?.toLowerCase() === 'activo'
    ).length;
    this.recordatorios.sort(
      (a, b) => new Date(a.fechaVencimiento).getTime() - new Date(b.fechaVencimiento).getTime()
    );
  }

  async nuevoRecordatorio() {
    if (this.vehiculos.length === 0) {
      alert('Primero debe registrar un vehículo');
      return;
    }

    const modal = await this.modalController.create({
      component: RecordatorioFormComponent,
      componentProps: { vehiculos: this.vehiculos }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.recordatorios.push(data);
      await this.storage.set('recordatorios', this.recordatorios);
      await this.cargarDatos();
    }
  }

  async editarRecordatorio(r: any) {
    const modal = await this.modalController.create({
      component: RecordatorioFormComponent,
      componentProps: {
        vehiculos:     this.vehiculos,
        recordatorio:  r
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      const index = this.recordatorios.findIndex(rec => rec.id === r.id);
      if (index !== -1) {
        this.recordatorios[index] = data;
        await this.storage.set('recordatorios', this.recordatorios);
        await this.cargarDatos();
      }
    }
  }

  async completar(r: any) {
    r.estado = 'completado';
    await this.storage.set('recordatorios', this.recordatorios);
    await this.cargarDatos();
  }

  async posponer(r: any) {
    const fecha = new Date(r.fechaVencimiento);
    fecha.setDate(fecha.getDate() + 7);
    r.fechaVencimiento = fecha.toISOString();
    await this.storage.set('recordatorios', this.recordatorios);
    await this.cargarDatos();
  }

  async eliminarRecordatorio(r: any) {
    if (confirm('¿Eliminar este recordatorio?')) {
      this.recordatorios = this.recordatorios.filter(rec => rec.id !== r.id);
      await this.storage.set('recordatorios', this.recordatorios);
      await this.cargarDatos();
    }
  }

  getDiasRestantes(r: any): number {
    const hoy   = new Date();
    const vence = new Date(r.fechaVencimiento);
    return Math.ceil((vence.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
  }

  getUrgencia(r: any): 'red' | 'yellow' | 'green' {
    const dias = this.getDiasRestantes(r);
    if (dias < 10) return 'red';
    if (dias < 30) return 'yellow';
    return 'green';
  }

  getCardClass(_r: any): string    { return ''; }
  getBorderClass(r: any): string  { return `border-${this.getUrgencia(r)}`; }
  getIconBgClass(r: any): string  { return `icon-bg-${this.getUrgencia(r)}`; }
  getIconColorClass(r: any): string { return `icon-color-${this.getUrgencia(r)}`; }
  getDiasBadgeClass(r: any): string { return `badge-${this.getUrgencia(r)}`; }

  getPlaca(r: any): string {
    const v = this.vehiculos.find(v => v.id === r.vehiculoId);
    return v ? v.placa : '';
  }
}