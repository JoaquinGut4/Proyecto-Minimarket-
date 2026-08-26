import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../nucleo/servicios/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; background: #f8fafc;">
      <div style="background: #fff; padding: 2.5rem; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); width: 100%; max-width: 400px; text-align: center;">
        <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🔐</div>
        <h3 style="margin-bottom: 0.25rem;">Acceso Administrativo</h3>
        <p style="color: #64748b; font-size: 0.88rem; margin-bottom: 1.5rem;">Ingrese sus credenciales</p>

        <div *ngIf="error" style="background: #fef2f2; color: #dc2626; padding: 0.75rem; border-radius: 8px; margin-bottom: 1rem; font-size: 0.85rem;">
          {{ error }}
        </div>

        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          <input type="text" class="fm-input" placeholder="DNI" maxlength="8" [(ngModel)]="dni" (input)="onDniInput($event)" autocomplete="off" />
          <input type="password" class="fm-input" placeholder="Contraseña" [(ngModel)]="password" (keydown.enter)="doLogin()" />
          <button class="fm-btn fm-btn-primary" style="width:100%;padding:0.85rem;" (click)="doLogin()" [disabled]="loading">{{ loading ? 'Ingresando...' : 'Ingresar →' }}</button>
          <button class="fm-btn fm-btn-secondary" style="width:100%;padding:0.75rem;margin-top:0.5rem;" (click)="goBack()">← Volver a Tienda</button>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  loading: boolean = false;
  dni = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  // Filtra caracteres no numéricos del campo DNI en tiempo real
  onDniInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.dni = input.value.replace(/\D/g, '');
  }

  // Valida credenciales contra el backend y redirige al panel admin
  doLogin(): void {
    if (!this.dni || !this.password) {
      this.error = 'Ingrese DNI y contraseña';
      return;
    }
    this.error = '';
    this.loading = true;
    this.auth.login(this.dni, this.password).subscribe({
      next: () => this.router.navigate(['/admin']),
      error: (err) => { this.error = err.message || 'Credenciales incorrectas'; this.loading = false; }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
