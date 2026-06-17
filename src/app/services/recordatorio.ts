import { Injectable } from '@angular/core';
import { StorageService } from './storage';

@Injectable({
  providedIn: 'root'
})
export class RecordatorioService {
  constructor(private storage: StorageService) {}

  async generarRecordatoriosAutomaticos() {
    const mantenimientos = (await this.storage.get('mantenimientos')) || [];
    const vehiculos = (await this.storage.get('vehiculos')) || [];
    const recordatorios = (await this.storage.get('recordatorios')) || [];

    for (const mantenimiento of mantenimientos) {
      if (mantenimiento.recordatorioActivo && mantenimiento.proximaFecha) {
        const existe = recordatorios.some(
          (r: any) => r.origen === 'mantenimiento' && r.idOrigen === mantenimiento.id
        );
        if (!existe) {
          recordatorios.push({
            id: Date.now() + Math.random(),
            tipo: 'mantenimiento',
            titulo: mantenimiento.descripcion || 'Mantenimiento programado',
            descripcion: mantenimiento.descripcion,
            fechaVencimiento: mantenimiento.proximaFecha,
            diasAviso: 7,
            repeticion: 'ninguna',
            activo: true,
            estado: 'pendiente',
            vehiculoId: mantenimiento.vehiculoId,
            origen: 'mantenimiento',
            idOrigen: mantenimiento.id
          });
        }
      }
    }

    const recordatoriosFijos = [
      { tipo: 'seguro', titulo: 'Seguro Obligatorio (SOAT)', meses: 12 },
      { tipo: 'tecnicmecan', titulo: 'Revisión Técnico-Mecánica', meses: 12 },
      { tipo: 'seguro', titulo: 'Seguro', meses: 6 },
      { tipo: 'mantenimiento', titulo: 'Cambio de aceite', meses: 6 }
    ];

    for (const vehiculo of vehiculos) {
      for (const rf of recordatoriosFijos) {
        const fechaVencimiento = new Date();
        fechaVencimiento.setMonth(fechaVencimiento.getMonth() + rf.meses);
        const fechaStr = fechaVencimiento.toISOString().split('T')[0];

        const existe = recordatorios.some(
          (r: any) =>
            r.titulo === rf.titulo &&
            r.vehiculoId === vehiculo.id &&
            r.estado !== 'completado'
        );

        if (!existe) {
          recordatorios.push({
            id: Date.now() + Math.random(),
            tipo: rf.tipo,
            titulo: rf.titulo,
            descripcion: `${rf.titulo} para ${vehiculo.placa}`,
            fechaVencimiento: fechaStr,
            diasAviso: 7,
            repeticion: 'ninguna',
            activo: true,
            estado: 'pendiente',
            vehiculoId: vehiculo.id,
            origen: 'fijo'
          });
        }
      }
    }

    await this.storage.set('recordatorios', recordatorios);
    return recordatorios;
  }

  calcularColor(fechaStr: string): string {
    const hoy = new Date();
    const vencimiento = new Date(fechaStr);
    const diffDays = Math.ceil((vencimiento.getTime() - hoy.getTime()) / (1000 * 3600 * 24));

    if (diffDays > 30) return '#4CAF50';
    if (diffDays >= 10) return '#FFC107';
    return '#F44336';
  }

  async posponerRecordatorio(recordatorio: any, dias: number) {
    const fecha = new Date(recordatorio.fechaVencimiento);
    fecha.setDate(fecha.getDate() + dias);
    recordatorio.fechaVencimiento = fecha.toISOString().split('T')[0];
    const recordatorios = (await this.storage.get('recordatorios')) || [];
    const index = recordatorios.findIndex((r: any) => r.id === recordatorio.id);
    if (index !== -1) {
      recordatorios[index] = recordatorio;
      await this.storage.set('recordatorios', recordatorios);
    }
    return recordatorios;
  }

  async marcarCompletado(recordatorio: any) {
    const recordatorios = (await this.storage.get('recordatorios')) || [];
    const index = recordatorios.findIndex((r: any) => r.id === recordatorio.id);
    if (index !== -1) {
      recordatorios[index].estado = 'completado';
      await this.storage.set('recordatorios', recordatorios);
    }
    return recordatorios;
  }
}
