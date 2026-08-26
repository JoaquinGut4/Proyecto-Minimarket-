import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../nucleo/servicios/pedido.service';
import { Pedido } from '../../../compartido/modelos';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <div *ngIf="loading" style="text-align: center; padding: 2rem; color: #64748b;">Cargando...</div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
        <h2 style="font-size: 1.3rem; font-weight: 700;">Historial de Pedidos</h2>
        <div style="display: flex; gap: 0.5rem;">
          <button class="cat-pill" [class.active]="filter === ''" (click)="filter = ''; loadPedidos()">Todos</button>
          <button class="cat-pill" [class.active]="filter === 'pendiente'" (click)="filter = 'pendiente'; loadPedidos()">Pendientes</button>
          <button class="cat-pill" [class.active]="filter === 'entregado'" (click)="filter = 'entregado'; loadPedidos()">Entregados</button>
          <button class="cat-pill" [class.active]="filter === 'devuelto'" (click)="filter = 'devuelto'; loadPedidos()">Devueltos</button>
        </div>
      </div>
      <div style="background: #fff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #f8fafc; font-size: 0.8rem; font-weight: 600; color: #64748b; text-transform: uppercase;">
              <th style="padding: 0.75rem 1rem; text-align: left;">Código</th>
              <th style="padding: 0.75rem 1rem; text-align: left;">Cliente</th>
              <th style="padding: 0.75rem 1rem; text-align: left;">Total</th>
              <th style="padding: 0.75rem 1rem; text-align: left;">Método</th>
              <th style="padding: 0.75rem 1rem; text-align: left;">Estado</th>
              <th style="padding: 0.75rem 1rem; text-align: left;">Encargado</th>
              <th style="padding: 0.75rem 1rem; text-align: left;">Creado</th>
              <th style="padding: 0.75rem 1rem; text-align: left;">Entregado</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let p of pedidos" style="border-top: 1px solid #f1f5f9; font-size: 0.85rem;">
              <td style="padding: 0.75rem 1rem; font-weight: 600;">{{ p.codigoRecojo }}</td>
              <td style="padding: 0.75rem 1rem;">{{ p.telefonoCliente }}</td>
              <td style="padding: 0.75rem 1rem; font-weight: 700; color: #006c49;">S/ {{ p.total.toFixed(2) }}</td>
              <td style="padding: 0.75rem 1rem; text-transform: capitalize;">{{ p.metodoPago }}</td>
              <td style="padding: 0.75rem 1rem;">
                <span [style.background]="p.estado === 'pendiente' ? '#fef3c7' : p.estado === 'entregado' ? '#d1fae5' : '#fce4ec'"
                      [style.color]="p.estado === 'pendiente' ? '#92400e' : p.estado === 'entregado' ? '#065f46' : '#c62828'"
                      style="padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600;">
                  {{ p.estado }}
                </span>
              </td>
              <td style="padding: 0.75rem 1rem;">{{ p.encargado || '—' }}</td>
              <td style="padding: 0.75rem 1rem; font-size: 0.8rem; color: #64748b;">{{ p.creadoEn | date:'dd/MM/yyyy HH:mm' }}</td>
              <td style="padding: 0.75rem 1rem; font-size: 0.8rem; color: #64748b;">
                {{ p.actualizadoEn && p.estado !== 'pendiente' ? (p.actualizadoEn | date:'dd/MM/yyyy HH:mm') : '—' }}
              </td>
            </tr>
            <tr *ngIf="pedidos.length === 0">
              <td colspan="8" style="text-align: center; padding: 2rem; color: #64748b;">No hay pedidos</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class HistoryComponent implements OnInit {
  loading: boolean = false;
  pedidos: Pedido[] = [];
  filter = '';

  constructor(private orderService: OrderService) {}

  ngOnInit(): void { this.loadPedidos(); }

  // Obtiene pedidos del backend, opcionalmente filtrados por estado
  loadPedidos(): void {
    this.loading = true;
    this.orderService.getAll(this.filter || undefined).subscribe({
      next: (res) => { this.pedidos = res; this.loading = false; },
      error: (err) => { console.error('Error:', err); this.loading = false; }
    });
  }
}
