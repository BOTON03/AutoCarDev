import { Injectable } from '@angular/core';
import { StorageService } from './storage';

@Injectable({
  providedIn: 'root'  // ← Esto es crucial
})
export class RecordatorioService {
  constructor(private storage: StorageService) {}

  async generarRecordatoriosAutomaticos() {
    const mantenimientos = (await this.storage.get('mantenimientos')) || [];
    const vehiculos = (await this.storage.get('vehiculos')) || [];
    const recordatorios = (await this.storage.get('recordatorios')) || [];

    for (const mantenimiento of mantenimientos) {
      if (mantenimiento.recordatorioActivo && mantenimiento.proximaFecha) {
        const existe = recordatorios.some((r: any) => r.origen === 'mantenimiento' && r.idOrigen === mantenimiento.id);
        if (!existe) {
          recordatorios.push({
            id: Date.now() + Math.random(),
            tipo: 'Mantenimiento programado',
            descripcion: mantenimiento.descripcion,
            fecha: mantenimiento.proximaFecha,
            color: this.calcularColor(mantenimiento.proximaFecha),
            completado: false,
            origen: 'mantenimiento',
            idOrigen: mantenimiento.id
          });
        }
      }
    }

    const recordatoriosFijos = [
      { tipo: 'SOAT', meses: 12 },
      { tipo: 'Revisión técnico-mecánica', meses: 12 },
      { tipo: 'Seguro', meses: 6 },
      { tipo: 'Cambio de aceite', meses: 6 }
    ];

    for (const vehiculo of vehiculos) {
      for (const rf of recordatoriosFijos) {
        const fechaVencimiento = new Date();
        fechaVencimiento.setMonth(fechaVencimiento.getMonth() + rf.meses);
        const fechaStr = fechaVencimiento.toISOString().split('T')[0];
        
        const existe = recordatorios.some((r: any) => 
          r.tipo === rf.tipo && r.vehiculoId === vehiculo.id && !r.completado
        );
        
        if (!existe) {
          recordatorios.push({
            id: Date.now() + Math.random(),
            tipo: rf.tipo,
            descripcion: `${rf.tipo} para ${vehiculo.placa}`,
            fecha: fechaStr,
            color: this.calcularColor(fechaStr),
            completado: false,
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
    const fecha = new Date(recordatorio.fecha);
    fecha.setDate(fecha.getDate() + dias);
    recordatorio.fecha = fecha.toISOString().split('T')[0];
    recordatorio.color = this.calcularColor(recordatorio.fecha);
    const recordatorios = await this.storage.get('recordatorios');
    const index = recordatorios.findIndex((r: any) => r.id === recordatorio.id);
    recordatorios[index] = recordatorio;
    await this.storage.set('recordatorios', recordatorios);
    return recordatorios;
  }

  async marcarCompletado(recordatorio: any) {
    const recordatorios = await this.storage.get('recordatorios');
    const index = recordatorios.findIndex((r: any) => r.id === recordatorio.id);
    recordatorios[index].completado = true;
    await this.storage.set('recordatorios', recordatorios);
    return recordatorios;
  }
}