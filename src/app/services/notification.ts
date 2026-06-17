import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { StorageService } from './storage';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private initialized = false;

  constructor(private storage: StorageService) {}

  async init(): Promise<void> {
    if (this.initialized || !Capacitor.isNativePlatform()) {
      return;
    }

    const perm = await LocalNotifications.checkPermissions();
    if (perm.display !== 'granted') {
      await LocalNotifications.requestPermissions();
    }
    this.initialized = true;
  }

  async syncRecordatorios(recordatorios: any[]): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    const config = (await this.storage.get('config')) || {};
    if (config.notificaciones === false) {
      await this.cancelAllReminders(recordatorios);
      return;
    }

    await this.init();
    await this.cancelAllReminders(recordatorios);

    const pendientes = recordatorios.filter(
      r => r.activo !== false && r.estado !== 'completado' && r.fechaVencimiento
    );

    const notifications = pendientes
      .map(r => this.buildNotification(r))
      .filter((n): n is NonNullable<typeof n> => n !== null);

    if (notifications.length > 0) {
      await LocalNotifications.schedule({ notifications });
    }
  }

  private async cancelAllReminders(recordatorios: any[]): Promise<void> {
    const ids = recordatorios.map(r => ({ id: this.toNotificationId(r.id) }));
    if (ids.length > 0) {
      await LocalNotifications.cancel({ notifications: ids });
    }
  }

  async cancelReminder(recordatorioId: string | number): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    await LocalNotifications.cancel({
      notifications: [{ id: this.toNotificationId(recordatorioId) }]
    });
  }

  private buildNotification(recordatorio: any) {
    const fechaVence = new Date(recordatorio.fechaVencimiento);
    const aviso = new Date(fechaVence);
    aviso.setDate(aviso.getDate() - (recordatorio.diasAviso || 7));
    aviso.setHours(9, 0, 0, 0);

    if (aviso.getTime() <= Date.now()) {
      return null;
    }

    return {
      id: this.toNotificationId(recordatorio.id),
      title: recordatorio.titulo || 'Recordatorio AutoCare',
      body: recordatorio.descripcion || `Vence el ${recordatorio.fechaVencimiento}`,
      schedule: { at: aviso }
    };
  }

  private toNotificationId(id: string | number): number {
    const str = String(id);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash) % 2147483646 + 1;
  }
}
