import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-vehiculo-form',
  templateUrl: './vehiculo-form.component.html',
  styleUrls: ['./vehiculo-form.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class VehiculoFormComponent implements OnInit {

  @Input() vehiculo: any = null;

  esEdicion = false;
  anioActual = new Date().getFullYear();

  form = {
    placa:        '',
    marca:        '',
    modelo:       '',
    anio:         null as number | null,
    color:        '',
    combustible:  'Gasolina',
    kilometraje:  null as number | null,
    bateria:      null as number | null,
    estado:       'Activo'
  };

  combustibles = [
    { valor: 'Gasolina',   label: 'Gasolina',  icono: 'fas fa-gas-pump'   },
    { valor: 'Diesel',     label: 'Diésel',    icono: 'fas fa-droplet'    },
    { valor: 'Híbrido',    label: 'Híbrido',   icono: 'fas fa-leaf'       },
    { valor: 'Eléctrico',  label: 'Eléctrico', icono: 'fas fa-bolt'       },
  ];

  estados = [
    { valor: 'Activo',    label: 'Activo',    activeClass: '' },
    { valor: 'En Taller', label: 'En Taller', activeClass: 'chip-red' },
    { valor: 'Inactivo',  label: 'Inactivo',  activeClass: 'chip-gray' },
  ];

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    if (this.vehiculo) {
      this.esEdicion = true;
      this.form = { ...this.vehiculo };
    }
  }

  formValido(): boolean {
    return !!(
      this.form.placa.trim() &&
      this.form.marca.trim() &&
      this.form.modelo.trim() &&
      this.form.anio &&
      this.form.color.trim() &&
      this.form.combustible &&
      this.form.kilometraje !== null
    );
  }

  guardar() {
    if (!this.formValido()) return;

    const data = {
      ...this.form,
      id: this.vehiculo?.id || Date.now().toString(),
      placa: this.form.placa.toUpperCase().trim(),
      marca: this.form.marca.trim(),
      modelo: this.form.modelo.trim(),
      color: this.form.color.trim(),
    };

    this.modalController.dismiss(data);
  }

  cerrar() {
    this.modalController.dismiss(null);
  }
}