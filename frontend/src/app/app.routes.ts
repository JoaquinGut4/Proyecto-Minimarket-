import { Routes } from '@angular/router';
import { authGuard } from './nucleo/guardianes/auth.guard';
import { adminGuard } from './nucleo/guardianes/admin.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./caracteristicas/catalogo/catalogo.component').then(m => m.CatalogComponent) },
  { path: 'admin/ingreso', loadComponent: () => import('./caracteristicas/admin/ingreso/ingreso.component').then(m => m.LoginComponent) },
  { path: 'admin', canActivate: [authGuard], loadComponent: () => import('./caracteristicas/admin/admin-diseno/admin-diseno.component').then(m => m.AdminLayoutComponent),
    children: [
      { path: 'tablero', loadComponent: () => import('./caracteristicas/admin/tablero/tablero.component').then(m => m.DashboardComponent) },
      { path: 'pedidos', loadComponent: () => import('./caracteristicas/admin/pedidos/pedidos.component').then(m => m.OrdersComponent) },
      { path: 'historial', loadComponent: () => import('./caracteristicas/admin/historial/historial.component').then(m => m.HistoryComponent) },
      { path: 'inventario', loadComponent: () => import('./caracteristicas/admin/inventario/inventario.component').then(m => m.StockComponent) },
      { path: 'movimientos', canActivate: [adminGuard], loadComponent: () => import('./caracteristicas/admin/movimientos/movimientos.component').then(m => m.MovementsComponent) },
      { path: 'usuarios', canActivate: [adminGuard], loadComponent: () => import('./caracteristicas/admin/usuarios/usuarios.component').then(m => m.UsersComponent) },
      { path: 'cuenta', loadComponent: () => import('./caracteristicas/admin/cuenta/cuenta.component').then(m => m.AccountComponent) },
      { path: '', redirectTo: 'tablero', pathMatch: 'full' },
    ]
  },
  { path: '**', redirectTo: '' }
];
