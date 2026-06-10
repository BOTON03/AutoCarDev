import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-mantenimiento-form',
  templateUrl: './mantenimiento-form.component.html',
  styleUrls: ['./mantenimiento-form.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class MantenimientoFormComponent implements OnInit {

  @Input() vehiculos: any[] = [];
  @Input() mantenimiento: any = null;

  esEdicion = false;

  form = {
    vehiculoId:        '',
    tipo:              'preventivo',
    descripcion:       '',
    fecha:             new Date().toISOString().split('T')[0],
    kilometraje:       null as number | null,
    costo:             null as number | null,
    lugar:             '',
    estado:            'pendiente',
    proximaFecha:      '',
    recordatorioActivo: false
  };

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    if (this.mantenimiento) {
      this.esEdicion = true;
      this.form = { ...this.mantenimiento };
    }
    if (this.vehiculos.length === 1) {
      this.form.vehiculoId = this.vehiculos[0].id;
    }
  }

  formValido(): boolean {
    return !!(
      this.form.vehiculoId &&
      this.form.tipo &&
      this.form.descripcion.trim() &&
      this.form.fecha &&
      this.form.kilometraje !== null &&
      this.form.costo !== null
    );
  }

  guardar() {
    if (!this.formValido()) return;

    const data = {
      ...this.form,
      id:          this.mantenimiento?.id || Date.now().toString(),
      descripcion: this.form.descripcion.trim(),
      lugar:       this.form.lugar.trim(),
    };

    this.modalController.dismiss(data);
  }

  cerrar() {
    this.modalController.dismiss(null);
  }
}