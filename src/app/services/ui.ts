import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class UiService {
  constructor(
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  async showToast(message: string, color = 'primary'): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2500,
      color,
      position: 'top'
    });
    await toast.present();
  }

  async showAlert(message: string, header = 'Aviso'): Promise<void> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async confirm(message: string, header = 'Confirmar'): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      const alert = await this.alertController.create({
        header,
        message,
        buttons: [
          { text: 'Cancelar', role: 'cancel', handler: () => resolve(false) },
          { text: 'Confirmar', handler: () => resolve(true) }
        ]
      });
      await alert.present();
    });
  }
}
