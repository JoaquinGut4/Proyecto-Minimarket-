import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../nucleo/servicios/auth.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <h2 style="font-size: 1.3rem; font-weight: 700; margin-bottom: 1.5rem;">Mi Cuenta</h2>
      <div style="background: #fff; border-radius: 12px; padding: 1.5rem; border: 1px solid #e2e8f0; max-width: 500px;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">👤</div>
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          <div>
            <span style="font-size: 0.75rem; font-weight: 600; color: #64748b; text-transform: uppercase;">Nombre</span>
            <div style="font-weight: 600;">{{ user?.nombre }}</div>
          </div>
          <div>
            <span style="font-size: 0.75rem; font-weight: 600; color: #64748b; text-transform: uppercase;">DNI</span>
            <div style="font-weight: 600;">{{ user?.dni }}</div>
          </div>
          <div>
            <span style="font-size: 0.75rem; font-weight: 600; color: #64748b; text-transform: uppercase;">Teléfono</span>
            <div style="font-weight: 600;">{{ user?.telefono }}</div>
          </div>
          <div>
            <span style="font-size: 0.75rem; font-weight: 600; color: #64748b; text-transform: uppercase;">Rol</span>
            <div style="font-weight: 600;">{{ user?.rol }}</div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AccountComponent implements OnInit {
  user: any = null;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.user = this.auth.getCurrentUser();
  }
}
