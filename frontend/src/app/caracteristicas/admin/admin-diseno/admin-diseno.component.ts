import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../nucleo/servicios/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div style="display: flex; height: 100vh;">
      <aside style="width: 260px; background: #fff; border-right: 1px solid #e2e8f0; display: flex; flex-direction: column; padding: 1.5rem; height: 100vh; flex-shrink: 0;">
        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 2rem;">
          <div style="width: 40px; height: 40px; background: var(--fo-accent); color: #fff; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.2rem;">K</div>
          <div>
            <div style="font-weight: 700;">Kapaq Admin</div>
            <div style="font-size: 0.75rem; color: #64748b;">Gestor de Tienda</div>
          </div>
        </div>

        <nav style="display: flex; flex-direction: column; gap: 0.25rem; flex: 1;">
          <a routerLink="/admin/tablero" routerLinkActive="active" class="nav-item">
            <span class="material-symbols-outlined">dashboard</span> Tablero
          </a>
          <a routerLink="/admin/pedidos" routerLinkActive="active" class="nav-item">
            <span class="material-symbols-outlined">shopping_cart</span> Pedidos
          </a>
          <a routerLink="/admin/historial" routerLinkActive="active" class="nav-item">
            <span class="material-symbols-outlined">history</span> Historial
          </a>
          <a routerLink="/admin/inventario" routerLinkActive="active" class="nav-item">
            <span class="material-symbols-outlined">inventory_2</span> Inventario
          </a>
          <a *ngIf="isAdmin" routerLink="/admin/movimientos" routerLinkActive="active" class="nav-item">
            <span class="material-symbols-outlined">swap_horiz</span> Movimientos
          </a>
          <a *ngIf="isAdmin" routerLink="/admin/usuarios" routerLinkActive="active" class="nav-item">
            <span class="material-symbols-outlined">group</span> Usuarios
          </a>
          <a routerLink="/admin/cuenta" routerLinkActive="active" class="nav-item">
            <span class="material-symbols-outlined">person</span> Mi Cuenta
          </a>
        </nav>

        <div style="display: flex; align-items: center; gap: 0.75rem; padding-top: 1rem; border-top: 1px solid #e2e8f0;">
          <div style="width: 36px; height: 36px; border-radius: 50%; background: #e2e8f0; display: flex; align-items: center; justify-content: center; font-weight: 600;">
            {{ user?.nombre?.charAt(0) || 'A' }}
          </div>
          <div style="flex: 1;">
            <div style="font-weight: 600; font-size: 0.85rem;">{{ user?.nombre || 'Admin' }}</div>
            <div style="font-size: 0.75rem; color: #64748b;">DNI: {{ user?.dni }} · Rol: {{ user?.rol }}</div>
          </div>
          <button style="background: none; border: none; color: #64748b; padding: 0.4rem;" (click)="logout()" title="Cerrar Sesión">
            <span class="material-symbols-outlined">logout</span>
          </button>
        </div>
      </aside>

      <div style="flex: 1; display: flex; flex-direction: column; overflow: hidden;">
        <header style="background: #fff; border-bottom: 1px solid #e2e8f0; padding: 1rem 1.5rem; display: flex; justify-content: flex-end; align-items: center;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <button style="background: none; border: none; color: #64748b;">
              <span class="material-symbols-outlined">notifications</span>
            </button>
            <div style="width: 1px; height: 24px; background: #e2e8f0;"></div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <div style="width: 32px; height: 32px; border-radius: 50%; background: #e2e8f0; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 0.8rem;">
                {{ user?.nombre?.charAt(0) || 'A' }}
              </div>
              <div>
                <div style="font-weight: 600; font-size: 0.85rem;">{{ user?.nombre || 'Admin' }}</div>
                <div style="font-size: 0.75rem; color: #64748b;">Administrador</div>
              </div>
            </div>
          </div>
        </header>
        <main style="flex: 1; padding: 1.5rem; overflow-y: auto;">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .nav-item {
      display: flex; align-items: center; gap: 0.75rem;
      padding: 0.6rem 0.8rem; border-radius: 8px; font-size: 0.88rem;
      font-weight: 500; color: #64748b; transition: all 0.2s;
      text-decoration: none;
    }
    .nav-item:hover { background: #f1f5f9; color: #0f172a; }
    .nav-item.active { background: #006c49; color: #fff; }
    .nav-item .material-symbols-outlined { font-size: 1.2rem; }
  `]
})
export class AdminLayoutComponent implements OnInit {
  user: any = null;
  isAdmin = false;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.user = this.auth.getCurrentUser();
    this.isAdmin = this.auth.isAdmin();
  }

  // Cierra sesión y redirige a la pantalla de login
  logout(): void {
    this.auth.logout();
    this.router.navigate(['/admin/ingreso']);
  }
}
