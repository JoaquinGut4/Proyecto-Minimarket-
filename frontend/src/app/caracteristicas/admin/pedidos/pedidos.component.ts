import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../nucleo/servicios/pedido.service';
import { AuthService } from '../../../nucleo/servicios/auth.service';
import { Pedido } from '../../../compartido/modelos';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <div *ngIf="loading" style="text-align: center; padding: 2rem; color: #64748b;">Cargando...</div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
        <h2 style="font-size: 1.3rem; font-weight: 700;">Pedidos</h2>
      </div>

      <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
        <button *ngFor="let f of filtros"
                (click)="filtrar(f.valor)"
                [style.background]="(filtroActivo === f.valor) ? '#006c49' : '#e2e8f0'"
                [style.color]="(filtroActivo === f.valor) ? '#fff' : '#334155'"
                style="border: none; padding: 0.4rem 1rem; border-radius: 999px; font-size: 0.82rem; font-weight: 600; cursor: pointer; transition: all 0.2s;">
          {{ f.label }}
        </button>
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
              <th style="padding: 0.75rem 1rem; text-align: left;">Fecha</th>
              <th style="padding: 0.75rem 1rem; text-align: left;">Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let p of pedidos" style="border-top: 1px solid #f1f5f9; font-size: 0.88rem;">
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
              <td style="padding: 0.75rem 1rem; font-size: 0.8rem; color: #64748b;">{{ p.creadoEn | date:'dd/MM HH:mm' }}</td>
              <td style="padding: 0.75rem 1rem;">
                <button *ngIf="p.estado === 'pendiente'" class="fm-btn fm-btn-primary" style="padding:0.35rem 0.75rem; font-size:0.8rem;" (click)="abrirModalEntregar(p)">Entregar</button>
                <button *ngIf="p.estado !== 'devuelto'" class="fm-btn fm-btn-secondary" style="padding:0.35rem 0.75rem; font-size:0.8rem; margin-left:0.25rem;" (click)="abrirModalDevolver(p)">Devolver</button>
              </td>
            </tr>
            <tr *ngIf="pedidos.length === 0">
              <td colspan="7" style="text-align: center; padding: 2rem; color: #64748b;">No hay pedidos</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal Entregar -->
      <div *ngIf="showEntregarModal" style="position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000;">
        <div style="background: #fff; border-radius: 12px; padding: 1.5rem 2rem; min-width: 360px; box-shadow: 0 8px 32px rgba(0,0,0,0.15);">
          <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem;">Entregar Pedido</h3>
          <p style="margin: 0.3rem 0; font-size: 0.9rem; color: #475569;"><strong>Código:</strong> {{ pedidoSeleccionado?.codigoRecojo }}</p>
          <p style="margin: 0.3rem 0; font-size: 0.9rem; color: #475569;"><strong>Total:</strong> S/ {{ pedidoSeleccionado?.total?.toFixed(2) }}</p>
          <div style="margin-top: 1.5rem; display: flex; gap: 0.75rem; justify-content: flex-end;">
            <button class="fm-btn fm-btn-secondary" style="padding:0.5rem 1.2rem; font-size:0.85rem;" (click)="cerrarModales()">Cancelar</button>
            <button class="fm-btn fm-btn-primary" style="padding:0.5rem 1.2rem; font-size:0.85rem;" (click)="confirmarEntregar()">Confirmar</button>
          </div>
        </div>
      </div>

      <!-- Modal Devolver -->
      <div *ngIf="showDevolverModal" style="position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000;">
        <div style="background: #fff; border-radius: 12px; padding: 1.5rem 2rem; min-width: 400px; box-shadow: 0 8px 32px rgba(0,0,0,0.15);">
          <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem;">Devolver Pedido</h3>
          <p style="margin: 0.3rem 0; font-size: 0.9rem; color: #475569;"><strong>Código:</strong> {{ pedidoSeleccionado?.codigoRecojo }}</p>
          <p style="margin: 0.3rem 0; font-size: 0.9rem; color: #475569;"><strong>Total:</strong> S/ {{ pedidoSeleccionado?.total?.toFixed(2) }}</p>
          <div style="margin-top: 0.8rem;">
            <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #334155; margin-bottom: 0.3rem;">Motivo de devolución</label>
            <textarea [(ngModel)]="motivoDevolucion" rows="3" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 8px; padding: 0.5rem; font-size: 0.85rem; resize: vertical; box-sizing: border-box;"></textarea>
          </div>
          <div style="margin-top: 1.5rem; display: flex; gap: 0.75rem; justify-content: flex-end;">
            <button class="fm-btn fm-btn-secondary" style="padding:0.5rem 1.2rem; font-size:0.85rem;" (click)="cerrarModales()">Cancelar</button>
            <button class="fm-btn fm-btn-primary" style="padding:0.5rem 1.2rem; font-size:0.85rem;" (click)="confirmarDevolver()">Confirmar</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class OrdersComponent implements OnInit {
  loading: boolean = false;
  pedidos: Pedido[] = [];
  filtros: { label: string; valor: string | null }[] = [
    { label: 'Pendientes', valor: 'pendiente' },
    { label: 'Entregados', valor: 'entregado' },
    { label: 'Devueltos', valor: 'devuelto' },
    { label: 'Todos', valor: null }
  ];
  filtroActivo: string | null = null;
  showEntregarModal: boolean = false;
  showDevolverModal: boolean = false;
  pedidoSeleccionado: Pedido | null = null;
  motivoDevolucion: string = '';

  constructor(private orderService: OrderService, private auth: AuthService) {}

  ngOnInit(): void {
    this.loadPedidos();
  }

  // Cambia el filtro activo y recarga la lista
  filtrar(status: string | null): void {
    this.filtroActivo = status;
    this.loadPedidos();
  }

  // Obtiene los pedidos según el filtro seleccionado
  loadPedidos(): void {
    this.loading = true;
    this.orderService.getAll(this.filtroActivo || undefined).subscribe({
      next: (res) => { this.pedidos = res; this.loading = false; },
      error: (err) => { console.error('Error:', err); this.loading = false; }
    });
  }

  abrirModalEntregar(p: Pedido): void {
    this.pedidoSeleccionado = p;
    this.showEntregarModal = true;
  }

  abrirModalDevolver(p: Pedido): void {
    this.pedidoSeleccionado = p;
    this.motivoDevolucion = '';
    this.showDevolverModal = true;
  }

  cerrarModales(): void {
    this.showEntregarModal = false;
    this.showDevolverModal = false;
    this.pedidoSeleccionado = null;
    this.motivoDevolucion = '';
  }

  // Marca el pedido como entregado y lo elimina de la lista visible
  confirmarEntregar(): void {
    const user = this.auth.getCurrentUser();
    const id = this.pedidoSeleccionado?.id;
    if (!user || !id) return;
    this.cerrarModales();
    this.pedidos = this.pedidos.filter(p => p.id !== id);
    this.orderService.entregar(id, user.id).subscribe({
      error: (err) => { console.error('Error:', err); this.loadPedidos(); }
    });
  }

  // Registra devolución con motivo y elimina el pedido de la lista
  confirmarDevolver(): void {
    const user = this.auth.getCurrentUser();
    const id = this.pedidoSeleccionado?.id;
    if (!user || !id) return;
    this.cerrarModales();
    this.pedidos = this.pedidos.filter(p => p.id !== id);
    this.orderService.devolver(id, user.id, this.motivoDevolucion || undefined).subscribe({
      error: (err) => { console.error('Error:', err); this.loadPedidos(); }
    });
  }
}
