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

    activeTab: string = 'vehiculos';

menu = [
  { nombre: 'Vehículos',      icono: 'fas fa-car-side',            color: 'vehiculos',     ruta: '/vehiculos' },
  { nombre: 'Mantenimientos', icono: 'fas fa-screwdriver-wrench',  color: 'mantenimiento', ruta: '/mantenimientos' },
  { nombre: 'Gastos',         icono: 'fas fa-money-bill-wave',     color: 'gastos',        ruta: '/gastos' },
  { nombre: 'Recordatorios',  icono: 'fas fa-bell',                color: 'alertas',       ruta: '/recordatorios' },
  { nombre: 'Estadísticas',   icono: 'fas fa-chart-bar',           color: 'estadisticas',  ruta: '/estadisticas' },
  { nombre: 'Perfil',         icono: 'fas fa-user',                color: 'perfil',        ruta: '/perfil' },
];

    constructor(private storage: StorageService) {

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

      this.usuario = await this.storage.get('usuario');

      this.vehiculos =
        (await this.storage.get('vehiculos')) || [];

      if (this.vehiculos.length > 0) {
        this.vehiculoPrincipal = this.vehiculos[0];
      }

      const gastos =
        (await this.storage.get('gastos')) || [];

      const inicioMes = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
      );

      this.totalGastosMes = gastos
        .filter(
          (g: any) =>
            new Date(g.fecha) >= inicioMes
        )
        .reduce(
          (total: number, g: any) =>
            total + Number(g.monto),
          0
        );
    }

  }