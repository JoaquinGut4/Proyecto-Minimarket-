import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovementService } from '../../../nucleo/servicios/movimiento.service';
import { Movimiento } from '../../../compartido/modelos';

@Component({
  selector: 'app-movements',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <div *ngIf="loading" style="text-align: center; padding: 2rem; color: #64748b;">Cargando...</div>
      <h2 style="font-size: 1.3rem; font-weight: 700; margin-bottom: 1.5rem;">Movimientos de Stock</h2>
      <div style="background: #fff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #f8fafc; font-size: 0.8rem; font-weight: 600; color: #64748b; text-transform: uppercase;">
              <th style="padding: 0.75rem 1rem; text-align: left;">Fecha</th>
              <th style="padding: 0.75rem 1rem; text-align: left;">Producto</th>
              <th style="padding: 0.75rem 1rem; text-align: left;">Tipo</th>
              <th style="padding: 0.75rem 1rem; text-align: left;">Cantidad</th>
              <th style="padding: 0.75rem 1rem; text-align: left;">Encargado</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let m of movimientos" style="border-top: 1px solid #f1f5f9; font-size: 0.85rem;">
              <td style="padding: 0.75rem 1rem; color: #64748b;">{{ m.fecha | date:'dd/MM HH:mm' }}</td>
              <td style="padding: 0.75rem 1rem;">
                <span style="font-size: 1rem; margin-right: 0.3rem;">{{ m.emoji }}</span>
                <span style="font-weight: 500;">{{ m.producto }}</span>
              </td>
              <td style="padding: 0.75rem 1rem;">
                <span [style.background]="m.cantidad >= 0 ? '#d1fae5' : '#fce4ec'"
                      [style.color]="m.cantidad >= 0 ? '#065f46' : '#c62828'"
                      style="padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600;">
                  {{ m.cantidad >= 0 ? 'Ingreso' : 'Egreso' }}
                </span>
              </td>
              <td style="padding: 0.75rem 1rem; font-weight: 700;" [style.color]="m.cantidad < 0 ? '#ef4444' : '#006c49'">
                {{ m.cantidad > 0 ? '+' : '' }}{{ m.cantidad }}
              </td>
              <td style="padding: 0.75rem 1rem;">{{ m.encargado }}</td>
            </tr>
            <tr *ngIf="movimientos.length === 0">
              <td colspan="5" style="text-align: center; padding: 2rem; color: #64748b;">Sin movimientos</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class MovementsComponent implements OnInit {
  loading: boolean = false;
  movimientos: Movimiento[] = [];

  constructor(private movementService: MovementService) {}

  ngOnInit(): void {
    this.loadMovimientos();
  }

  // Obtiene todos los movimientos desde el backend
  loadMovimientos(): void {
    this.loading = true;
    this.movementService.getAll().subscribe({
      next: (res) => { this.movimientos = res; this.loading = false; },
      error: (err) => { console.error('Error:', err); this.loading = false; }
    });
  }
}
