import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { StorageService } from '../../services/storage';

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.page.html',
  styleUrls: ['./estadisticas.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule]
})
export class EstadisticasPage implements OnInit {

  periodo = '1mes';
  activeTab = 'estadisticas';

  gastos: any[]    = [];
  vehiculos: any[] = [];

  gastosPorCategoria: {
    nombre: string;
    monto: number;
    porcentaje: number;
    color: string;
  }[] = [];

  gastosPorVehiculo: {
    placa: string;
    total: number;
  }[] = [];

  donutSegmentos: {
    color: string;
    dash: string;
    offset: string;
  }[] = [];

  totalMes = 0;

  get totalFormateado(): string {
    if (this.totalMes >= 1000) {
      return '$' + (this.totalMes / 1000).toFixed(1) + 'k';
    }
    return '$' + this.totalMes.toFixed(0);
  }

  private readonly categoriaConfig: Record<string, { nombre: string; color: string }> = {
    combustible:   { nombre: 'Combustible',   color: 'bar-blue'   },
    seguro:        { nombre: 'Seguro',         color: 'bar-cyan'   },
    mantenimiento: { nombre: 'Mantenimiento',  color: 'bar-indigo' },
    revision:      { nombre: 'Mantenimiento',  color: 'bar-indigo' },
    otros:         { nombre: 'Otros',          color: 'bar-gray'   },
  };

  private readonly donutColors: string[] = ['#5b9bff', '#4dcfff', '#7b6cff', '#5a7399'];

  constructor(private storage: StorageService) {}

  async ngOnInit() {
    await this.cargarDatos();
  }

  async ionViewWillEnter() {
    await this.cargarDatos();
  }

  async cargarDatos() {
    this.gastos    = (await this.storage.get('gastos'))    || [];
    this.vehiculos = (await this.storage.get('vehiculos')) || [];
    this.calcular();
  }

  setPeriodo(p: string) {
    this.periodo = p;
    this.calcular();
  }

  private getFechaLimite(): Date {
    const d = new Date();
    switch (this.periodo) {
      case '3meses': d.setMonth(d.getMonth() - 3);      break;
      case '6meses': d.setMonth(d.getMonth() - 6);      break;
      case 'año':    d.setFullYear(d.getFullYear() - 1); break;
      default:       d.setMonth(d.getMonth() - 1);       break;
    }
    return d;
  }

  private calcular() {
    const limite   = this.getFechaLimite();
    const filtrados = this.gastos.filter(g => new Date(g.fecha) >= limite);

    this.totalMes = filtrados.reduce((s, g) => s + g.monto, 0);

    const porCat: Record<string, number> = {};
    for (const g of filtrados) {
      const cat = g.categoria || 'otros';
      porCat[cat] = (porCat[cat] || 0) + g.monto;
    }

    const cats = Object.entries(porCat)
      .map(([cat, monto]) => ({
        cat,
        monto,
        nombre: this.categoriaConfig[cat]?.nombre || cat,
        color:  this.categoriaConfig[cat]?.color  || 'bar-gray',
        porcentaje: this.totalMes > 0 ? (monto / this.totalMes) * 100 : 0
      }))
      .sort((a, b) => b.monto - a.monto);

    this.gastosPorCategoria = cats;
    this.buildDonut(cats);

    const porVehiculo: Record<string, number> = {};
    for (const g of filtrados) {
      const v = this.vehiculos.find(v => v.id === g.vehiculoId);
      const placa = v ? v.placa : 'Sin vehículo';
      porVehiculo[placa] = (porVehiculo[placa] || 0) + g.monto;
    }

    this.gastosPorVehiculo = Object.entries(porVehiculo)
      .map(([placa, total]) => ({ placa, total }))
      .sort((a, b) => b.total - a.total);
  }

  private buildDonut(cats: any[]) {
    const circunferencia = 2 * Math.PI * 46;
    let acumulado = 0;

    this.donutSegmentos = cats.map((c, i) => {
      const largo  = (c.porcentaje / 100) * circunferencia;
      const vacio  = circunferencia - largo;
      const offset = circunferencia - acumulado * circunferencia / 100;
      acumulado += c.porcentaje;
      return {
        color:  this.donutColors[i % this.donutColors.length],
        dash:   `${largo} ${vacio}`,
        offset: `${offset}`
      };
    });
  }

  compartir() {
    alert('Compartir estadísticas');
  }

  exportarPDF() {
    alert('Exportando reporte en PDF...');
  }
}