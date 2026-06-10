import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-gasto-form',
  templateUrl: './gasto-form.component.html',
  styleUrls: ['./gasto-form.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class GastoFormComponent implements OnInit {

  @Input() vehiculos: any[] = [];

  form = {
    vehiculoId:  '',
    descripcion: '',
    categoria:   'combustible',
    monto:       null as number | null,
    fecha:       new Date().toISOString().split('T')[0],
    notas:       ''
  };

  categorias = [
    { valor: 'combustible', label: 'Combustible', icono: 'fas fa-gas-pump'         },
    { valor: 'seguro',      label: 'Seguro',      icono: 'fas fa-file-lines'        },
    { valor: 'revision',    label: 'Revisión',    icono: 'fas fa-screwdriver-wrench'},
    { valor: 'otros',       label: 'Otros',       icono: 'fas fa-basket-shopping'   },
  ];
esEdicion: any;

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    if (this.vehiculos.length === 1) {
      this.form.vehiculoId = this.vehiculos[0].id;
    }
  }

  formValido(): boolean {
    return !!(
      this.form.vehiculoId &&
      this.form.descripcion.trim() &&
      this.form.categoria &&
      this.form.monto !== null &&
      this.form.monto > 0 &&
      this.form.fecha
    );
  }

  guardar() {
    if (!this.formValido()) return;

    const data = {
      ...this.form,
      id:          Date.now().toString(),
      descripcion: this.form.descripcion.trim(),
      notas:       this.form.notas.trim(),
    };

    this.modalController.dismiss(data);
  }

  cerrar() {
    this.modalController.dismiss(null);
  }
}