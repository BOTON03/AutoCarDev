import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage) },
  { path: 'register', loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage) },
  { path: 'dashboard', canActivate: [authGuard], loadComponent: () => import('./pages/dashboard/dashboard.page').then(m => m.DashboardPage) },
  { path: 'vehiculos', canActivate: [authGuard], loadComponent: () => import('./pages/vehiculos/vehiculos.page').then(m => m.VehiculosPage) },
  { path: 'vehiculos/:id', canActivate: [authGuard], loadComponent: () => import('./components/vehiculo-detalle/vehiculo-detalle-form.component').then(m => m.VehiculoDetallePage) },
  { path: 'mantenimientos', canActivate: [authGuard], loadComponent: () => import('./pages/mantenimientos/mantenimientos.page').then(m => m.MantenimientosPage) },
  { path: 'gastos', canActivate: [authGuard], loadComponent: () => import('./pages/gastos/gastos.page').then(m => m.GastosPage) },
  { path: 'recordatorios', canActivate: [authGuard], loadComponent: () => import('./pages/recordatorios/recordatorios.page').then(m => m.RecordatoriosPage) },
  { path: 'estadisticas', canActivate: [authGuard], loadComponent: () => import('./pages/estadisticas/estadisticas.page').then(m => m.EstadisticasPage) },
  { path: 'perfil', canActivate: [authGuard], loadComponent: () => import('./pages/perfil/perfil.page').then(m => m.PerfilPage) },
  { path: '**', redirectTo: 'login' }
];