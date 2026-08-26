import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../nucleo/servicios/usuario.service';
import { Encargado } from '../../../compartido/modelos';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <div *ngIf="loading" style="text-align: center; padding: 2rem; color: #64748b;">Cargando...</div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
        <h2 style="font-size: 1.3rem; font-weight: 700;">Usuarios</h2>
        <button class="fm-btn fm-btn-primary" (click)="showForm = true">+ Nuevo</button>
      </div>

      <!-- Create form -->
      <div *ngIf="showForm" style="background: #fff; border-radius: 12px; padding: 1.5rem; border: 1px solid #e2e8f0; margin-bottom: 1.5rem;">
        <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 1rem;">Registrar Usuario</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
          <div style="grid-column: 1/-1;">
            <input type="text" class="fm-input" placeholder="Nombre Completo" [(ngModel)]="newUser.nombre" />
          </div>
          <input type="text" class="fm-input" placeholder="DNI (8 dígitos)" maxlength="8" [(ngModel)]="newUser.dni" />
          <input type="tel" class="fm-input" placeholder="Teléfono (9 dígitos)" maxlength="9" [(ngModel)]="newUser.telefono" />
          <div style="grid-column: 1/-1; position: relative;">
            <input [type]="showPassword ? 'text' : 'password'" class="fm-input" style="padding-right: 2.5rem;" placeholder="Contraseña (opcional)" [(ngModel)]="newUser.password" />
            <button type="button" (click)="showPassword = !showPassword" style="position: absolute; right: 0.5rem; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; padding: 0.25rem; line-height: 1; color: #94a3b8; font-size: 1.1rem;">
              <svg *ngIf="!showPassword" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              <svg *ngIf="showPassword" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            </button>
          </div>
        </div>
        <div style="display: flex; gap: 0.75rem; margin-top: 1rem;">
          <button class="fm-btn fm-btn-secondary" (click)="showForm = false">Cancelar</button>
          <button class="fm-btn fm-btn-primary" (click)="createUser()">Crear Cuenta</button>
        </div>
        <div *ngIf="formError" style="color: #ef4444; font-size: 0.85rem; margin-top: 0.5rem;">{{ formError }}</div>
      </div>

      <!-- Users table -->
      <div style="background: #fff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #f8fafc; font-size: 0.8rem; font-weight: 600; color: #64748b; text-transform: uppercase;">
              <th style="padding: 0.75rem 1rem; text-align: left;">Nombre</th>
              <th style="padding: 0.75rem 1rem; text-align: left;">DNI</th>
              <th style="padding: 0.75rem 1rem; text-align: left;">Teléfono</th>
              <th style="padding: 0.75rem 1rem; text-align: left;">Rol</th>
              <th style="padding: 0.75rem 1rem; text-align: left;">Estado</th>
              <th style="padding: 0.75rem 1rem; text-align: left;">Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let u of usuarios" style="border-top: 1px solid #f1f5f9; font-size: 0.85rem;">
              <td style="padding: 0.75rem 1rem; font-weight: 500;">{{ u.nombre }}</td>
              <td style="padding: 0.75rem 1rem;">{{ u.dni }}</td>
              <td style="padding: 0.75rem 1rem;">{{ u.telefono }}</td>
              <td style="padding: 0.75rem 1rem;">
                <span style="padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; background: #e0f2fe; color: #0369a1;">{{ u.rol }}</span>
              </td>
              <td style="padding: 0.75rem 1rem;">
                <span [style.background]="u.activo ? '#d1fae5' : '#fce4ec'" [style.color]="u.activo ? '#065f46' : '#c62828'"
                      style="padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600;">
                  {{ u.activo ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td style="padding: 0.75rem 1rem;">
                <button class="fm-btn fm-btn-secondary" style="padding:0.35rem 0.75rem; font-size:0.8rem;"
                        [style.background]="u.activo ? '#fce4ec' : '#d1fae5'" [style.color]="u.activo ? '#c62828' : '#065f46'"
                        (click)="toggleActivo(u)">
                  {{ u.activo ? 'Desactivar' : 'Activar' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class UsersComponent implements OnInit {
  loading: boolean = false;
  usuarios: Encargado[] = [];
  showForm = false;
  formError = '';
  newUser = { nombre: '', dni: '', telefono: '', password: '' };
  showPassword = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  // Obtiene todos los usuarios registrados
  loadUsers(): void {
    this.loading = true;
    this.userService.getAll().subscribe({
      next: (res) => { this.usuarios = res; this.loading = false; },
      error: (err) => { console.error('Error:', err); this.loading = false; }
    });
  }

  // Valida campos obligatorios y crea un nuevo usuario
  createUser(): void {
    this.formError = '';
    if (!this.newUser.nombre || !this.newUser.dni || !this.newUser.telefono) {
      this.formError = 'Complete todos los campos obligatorios';
      return;
    }
    this.loading = true;
    this.userService.create(this.newUser).subscribe({
      next: () => {
        this.showForm = false;
        this.newUser = { nombre: '', dni: '', telefono: '', password: '' };
        this.loadUsers();
      },
      error: (err) => { this.formError = err.message; this.loading = false; }
    });
  }

  // Alterna el estado activo/inactivo de un usuario
  toggleActivo(u: Encargado): void {
    this.userService.toggleActivo(u.id, !u.activo).subscribe({
      next: () => { this.loadUsers(); },
      error: (err) => { console.error('Error:', err); }
    });
  }
}
