import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-recordatorio-form',
  templateUrl: './recordatorio-form.component.html',
  styleUrls: ['./recordatorio-form.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class RecordatorioFormComponent implements OnInit {

  @Input() vehiculos: any[]     = [];
  @Input() recordatorio: any    = null;

  esEdicion = false;
  hoy       = new Date().toISOString().split('T')[0];

  form = {
    vehiculoId:       '',
    tipo:             'seguro',
    titulo:           '',
    descripcion:      '',
    fechaVencimiento: '',
    diasAviso:        7,
    repeticion:       'ninguna',
    activo:           true,
    estado:           'pendiente'
  };

  tipos = [
    { valor: 'seguro',      label: 'Seguro',      titulo: 'Seguro Obligatorio (SOAT)', icono: 'fas fa-file-shield'        },
    { valor: 'tecnicmecan', label: 'Téc-Mecánica', titulo: 'Revisión Técnico-Mecánica', icono: 'fas fa-car-burst'           },
    { valor: 'impuesto',    label: 'Impuesto',    titulo: 'Impuesto Vehicular',         icono: 'fas fa-receipt'             },
    { valor: 'mantenimiento',label: 'Mantenimiento',titulo: 'Mantenimiento programado', icono: 'fas fa-screwdriver-wrench'  },
    { valor: 'otro',        label: 'Otro',        titulo: '',                           icono: 'fas fa-bell'                },
  ];

  anticipaciones = [
    { valor: 3,  label: '3 días'   },
    { valor: 7,  label: '1 semana' },
    { valor: 15, label: '15 días'  },
    { valor: 30, label: '1 mes'    },
  ];

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    if (this.recordatorio) {
      this.esEdicion = true;
      this.form = { ...this.recordatorio };
    }
    if (this.vehiculos.length === 1) {
      this.form.vehiculoId = this.vehiculos[0].id;
    }
  }

  getDiasRestantes(): number {
    if (!this.form.fechaVencimiento) return 0;
    const hoy   = new Date();
    const vence = new Date(this.form.fechaVencimiento);
    return Math.ceil((vence.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
  }

  getUrgenciaClass(): string {
    const dias = this.getDiasRestantes();
    if (dias < 10)  return 'urgencia-red';
    if (dias < 30)  return 'urgencia-yellow';
    return 'urgencia-green';
  }

  formValido(): boolean {
    return !!(
      this.form.vehiculoId &&
      this.form.tipo &&
      this.form.titulo.trim() &&
      this.form.fechaVencimiento
    );
  }

  guardar() {
    if (!this.formValido()) return;

    const data = {
      ...this.form,
      id:          this.recordatorio?.id || Date.now().toString(),
      titulo:      this.form.titulo.trim(),
      descripcion: this.form.descripcion.trim(),
    };

    this.modalController.dismiss(data);
  }

  cerrar() {
    this.modalController.dismiss(null);
  }
}