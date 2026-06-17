import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { StorageService } from '../../services/storage';
import { RecordatorioService } from '../../services/recordatorio';
import { NotificationService } from '../../services/notification';
import { UiService } from '../../services/ui';
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
    private recordatorioService: RecordatorioService,
    private notificationService: NotificationService,
    private ui: UiService,
    private modalController: ModalController
  ) {}

  async ngOnInit() {
    await this.cargarDatos();
  }

  async ionViewWillEnter() {
    await this.cargarDatos();
  }

  async cargarDatos() {
    await this.recordatorioService.generarRecordatoriosAutomaticos();
    const todos = (await this.storage.get('recordatorios')) || [];
    this.recordatorios = todos.filter((r: any) => r.estado !== 'completado');
    this.vehiculos     = (await this.storage.get('vehiculos'))     || [];
    this.vehiculosActivos = this.vehiculos.filter(
      v => v.estado?.toLowerCase() === 'activo'
    ).length;
    this.recordatorios.sort(
      (a, b) => new Date(a.fechaVencimiento).getTime() - new Date(b.fechaVencimiento).getTime()
    );
    await this.notificationService.syncRecordatorios(todos);
  }

  async nuevoRecordatorio() {
    if (this.vehiculos.length === 0) {
      await this.ui.showAlert('Primero debe registrar un vehículo');
      return;
    }

    const modal = await this.modalController.create({
      component: RecordatorioFormComponent,
      componentProps: { vehiculos: this.vehiculos }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      const todos = (await this.storage.get('recordatorios')) || [];
      todos.push(data);
      await this.storage.set('recordatorios', todos);
      await this.cargarDatos();
      await this.ui.showToast('Recordatorio creado', 'success');
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
      const todos = (await this.storage.get('recordatorios')) || [];
      const index = todos.findIndex((rec: any) => rec.id === r.id);
      if (index !== -1) {
        todos[index] = data;
        await this.storage.set('recordatorios', todos);
        await this.cargarDatos();
        await this.ui.showToast('Recordatorio actualizado', 'success');
      }
    }
  }

  async completar(r: any) {
    await this.recordatorioService.marcarCompletado(r);
    await this.notificationService.cancelReminder(r.id);
    await this.cargarDatos();
    await this.ui.showToast('Recordatorio completado', 'success');
  }

  async posponer(r: any) {
    await this.recordatorioService.posponerRecordatorio(r, 7);
    await this.cargarDatos();
    await this.ui.showToast('Recordatorio pospuesto 7 días', 'warning');
  }

  async eliminarRecordatorio(r: any) {
    const ok = await this.ui.confirm('¿Eliminar este recordatorio?');
    if (ok) {
      const todos = (await this.storage.get('recordatorios')) || [];
      const actualizados = todos.filter((rec: any) => rec.id !== r.id);
      await this.storage.set('recordatorios', actualizados);
      await this.notificationService.cancelReminder(r.id);
      await this.cargarDatos();
      await this.ui.showToast('Recordatorio eliminado', 'success');
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

  getDiasTexto(r: any): string {
    const dias = this.getDiasRestantes(r);
    if (dias < 0) return 'Vencido';
    if (dias === 0) return 'Hoy';
    if (dias === 1) return '1 día';
    return `${dias} días`;
  }
}
