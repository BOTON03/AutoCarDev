  import { Component, OnInit } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { FormsModule } from '@angular/forms';
  import { RouterLink } from '@angular/router';
  import { IonicModule } from '@ionic/angular';

  import { addIcons } from 'ionicons';
  import {
    carOutline,
    constructOutline,
    cashOutline,
    notificationsOutline,
    statsChartOutline,
    personOutline,
    calendarOutline,
    carSportOutline
  } from 'ionicons/icons';

  import { StorageService } from '../../services/storage';
  import { AuthService } from '../../services/auth';

  @Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.page.html',
    styleUrls: ['./dashboard.page.scss'],
    standalone: true,
    imports: [
      CommonModule,
      FormsModule,
      IonicModule,
      RouterLink
    ]
  })
  export class DashboardPage implements OnInit {

    usuario: any = null;
    vehiculos: any[] = [];
    vehiculoPrincipal: any = null;
    totalGastosMes = 0;
    totalGastosMesAnterior = 0;
    proximoMantenimiento: { titulo: string; dias: number } | null = null;

    activeTab: string = 'vehiculos';

menu = [
  { nombre: 'Vehículos',      icono: 'fas fa-car-side',            color: 'vehiculos',     ruta: '/vehiculos' },
  { nombre: 'Mantenimientos', icono: 'fas fa-screwdriver-wrench',  color: 'mantenimiento', ruta: '/mantenimientos' },
  { nombre: 'Gastos',         icono: 'fas fa-money-bill-wave',     color: 'gastos',        ruta: '/gastos' },
  { nombre: 'Recordatorios',  icono: 'fas fa-bell',                color: 'alertas',       ruta: '/recordatorios' },
  { nombre: 'Estadísticas',   icono: 'fas fa-chart-bar',           color: 'estadisticas',  ruta: '/estadisticas' },
  { nombre: 'Perfil',         icono: 'fas fa-user',                color: 'perfil',        ruta: '/perfil' },
];

    constructor(private storage: StorageService, private auth: AuthService) {

      addIcons({
        carOutline,
        constructOutline,
        cashOutline,
        notificationsOutline,
        statsChartOutline,
        personOutline,
        calendarOutline,
        carSportOutline
      });

    }

    async ngOnInit() {
      await this.cargarDatos();
    }

    async ionViewWillEnter() {
      await this.cargarDatos();
    }

    async cargarDatos() {

      this.usuario = await this.auth.getCurrentUser();

      this.vehiculos =
        (await this.storage.get('vehiculos')) || [];

      if (this.vehiculos.length > 0) {
        this.vehiculoPrincipal = this.vehiculos[0];
      }

      const gastos =
        (await this.storage.get('gastos')) || [];

      const ahora = new Date();
      const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
      const inicioMesAnterior = new Date(ahora.getFullYear(), ahora.getMonth() - 1, 1);
      const finMesAnterior = new Date(ahora.getFullYear(), ahora.getMonth(), 0, 23, 59, 59);

      this.totalGastosMes = gastos
        .filter((g: any) => new Date(g.fecha) >= inicioMes)
        .reduce((total: number, g: any) => total + Number(g.monto), 0);

      this.totalGastosMesAnterior = gastos
        .filter((g: any) => {
          const fecha = new Date(g.fecha);
          return fecha >= inicioMesAnterior && fecha <= finMesAnterior;
        })
        .reduce((total: number, g: any) => total + Number(g.monto), 0);

      await this.cargarProximoMantenimiento();
    }

    private async cargarProximoMantenimiento() {
      const recordatorios = (await this.storage.get('recordatorios')) || [];
      const pendientes = recordatorios
        .filter((r: any) => r.estado !== 'completado' && r.fechaVencimiento)
        .sort(
          (a: any, b: any) =>
            new Date(a.fechaVencimiento).getTime() - new Date(b.fechaVencimiento).getTime()
        );

      if (pendientes.length === 0) {
        this.proximoMantenimiento = null;
        return;
      }

      const proximo = pendientes[0];
      const dias = Math.ceil(
        (new Date(proximo.fechaVencimiento).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );

      this.proximoMantenimiento = {
        titulo: proximo.titulo || 'Mantenimiento programado',
        dias
      };
    }

    get variacionGastosTexto(): string {
      if (this.totalGastosMesAnterior === 0) {
        return this.totalGastosMes > 0
          ? 'Sin datos del mes anterior'
          : 'Sin gastos registrados este mes';
      }

      const variacion = Math.round(
        ((this.totalGastosMes - this.totalGastosMesAnterior) / this.totalGastosMesAnterior) * 100
      );

      if (variacion === 0) {
        return 'Igual que el mes pasado';
      }

      const signo = variacion > 0 ? 'más' : 'menos';
      return `${Math.abs(variacion)}% ${signo} que el mes pasado`;
    }

    get proximoMantenimientoTexto(): string {
      if (!this.proximoMantenimiento) {
        return 'Sin mantenimientos próximos';
      }

      const { titulo, dias } = this.proximoMantenimiento;
      if (dias < 0) {
        return `${titulo} - Vencido`;
      }
      if (dias === 0) {
        return `${titulo} - Hoy`;
      }
      if (dias === 1) {
        return `${titulo} - En 1 día`;
      }
      return `${titulo} - En ${dias} días`;
    }

  }