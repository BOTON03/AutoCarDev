import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { StorageService } from '../../services/storage';
import { AuthService } from '../../services/auth';
import { UiService } from '../../services/ui';
import { VehiculoFormComponent } from '../../components/vehiculo-form/vehiculo-form.component';

@Component({
  selector: 'app-vehiculos',
  templateUrl: './vehiculos.page.html',
  styleUrls: ['./vehiculos.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule]
})
export class VehiculosPage implements OnInit {

  vehiculos: any[] = [];
  activeTab: string = 'vehiculos';
  usuario: any;

  constructor(
    private storage: StorageService,
    private auth: AuthService,
    private ui: UiService,
    private modalController: ModalController,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.cargarVehiculos();
  }

  async ionViewWillEnter() {
    await this.cargarVehiculos();
  }

  async cargarVehiculos() {
    this.usuario = await this.auth.getCurrentUser();
    this.vehiculos = (await this.storage.get('vehiculos')) || [];
  }

  async nuevoVehiculo() {
    const modal = await this.modalController.create({
      component: VehiculoFormComponent
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data) {
      this.vehiculos.push(data);
      await this.storage.set('vehiculos', this.vehiculos);
      await this.cargarVehiculos();
    }
  }

  async editarVehiculo(vehiculo: any) {
    const modal = await this.modalController.create({
      component: VehiculoFormComponent,
      componentProps: { vehiculo }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data) {
      const index = this.vehiculos.findIndex(v => v.id === vehiculo.id);

      if (index !== -1) {
        this.vehiculos[index] = data;
        await this.storage.set('vehiculos', this.vehiculos);
        await this.cargarVehiculos();
      }
    }
  }

  async eliminarVehiculo(vehiculo: any) {
    const ok = await this.ui.confirm(`¿Eliminar vehículo ${vehiculo.placa}?`);
    if (ok) {
      this.vehiculos = this.vehiculos.filter(v => v.id !== vehiculo.id);
      await this.storage.set('vehiculos', this.vehiculos);
      await this.cargarVehiculos();
      await this.ui.showToast('Vehículo eliminado', 'success');
    }
  }

  verDetalle(vehiculo: any) {
    this.router.navigate(['/vehiculos', vehiculo.id]);
  }

  getIconClass(v: any): string {
    switch (v.combustible?.toLowerCase()) {
      case 'eléctrico':
        return 'icon-dark';

      case 'híbrido':
        return 'icon-blue';

      case 'gasolina':
        return 'icon-blue';

      case 'diesel':
        return 'icon-gray';

      default:
        return 'icon-blue';
    }
  }

  getStatusClass(estado: string): string {
    switch (estado?.toLowerCase()) {
      case 'activo':
        return 'badge-activo';

      case 'en taller':
        return 'badge-taller';

      default:
        return 'badge-inactivo';
    }
  }

  getFuelIcon(combustible: string): string {
    switch (combustible?.toLowerCase()) {
      case 'eléctrico':
        return 'fas fa-bolt';

      case 'híbrido':
        return 'fas fa-leaf';

      case 'diesel':
        return 'fas fa-droplet';

      default:
        return 'fas fa-gas-pump';
    }
  }

  getServiceClass(proximoService: string): string {
    if (!proximoService) {
      return 'service-ok';
    }

    return proximoService.toLowerCase() === 'vencido'
      ? 'service-vencido'
      : 'service-ok';
  }

  esElectrico(v: any): boolean {
    return v.combustible?.toLowerCase() === 'eléctrico';
  }
}
