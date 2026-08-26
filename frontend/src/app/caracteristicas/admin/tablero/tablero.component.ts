import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ReportService } from '../../../nucleo/servicios/reporte.service';
import { AuthService } from '../../../nucleo/servicios/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <div *ngIf="loading" style="text-align: center; padding: 2rem; color: #64748b;">Cargando...</div>
      <h2 style="font-size: 1.3rem; font-weight: 700; margin-bottom: 1.5rem;">Dashboard</h2>

      <!-- Resumen Cards -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
        <div style="background: #fff; border-radius: 12px; padding: 1.25rem; border: 1px solid #e2e8f0;">
          <div style="font-size: 0.8rem; color: #64748b; font-weight: 600;">VENTAS HOY</div>
          <div style="font-size: 1.8rem; font-weight: 800; color: #006c49; margin-top: 0.25rem;">S/ {{ resumen?.ventas_hoy?.monto?.toFixed(2) || '0.00' }}</div>
          <div style="font-size: 0.8rem; color: #64748b;">{{ resumen?.ventas_hoy?.total || 0 }} pedidos</div>
        </div>
        <div style="background: #fff; border-radius: 12px; padding: 1.25rem; border: 1px solid #e2e8f0;">
          <div style="font-size: 0.8rem; color: #64748b; font-weight: 600;">PENDIENTES</div>
          <div style="font-size: 1.8rem; font-weight: 800; color: #f59e0b; margin-top: 0.25rem;">{{ resumen?.pendientes?.total || 0 }}</div>
          <div style="font-size: 0.8rem; color: #64748b;">pedidos por atender</div>
        </div>
        <div style="background: #fff; border-radius: 12px; padding: 1.25rem; border: 1px solid #e2e8f0;">
          <div style="font-size: 0.8rem; color: #64748b; font-weight: 600;">STOCK BAJO</div>
          <div style="font-size: 1.8rem; font-weight: 800; color: #ef4444; margin-top: 0.25rem;">{{ resumen?.stock_bajo?.total || 0 }}</div>
          <div style="font-size: 0.8rem; color: #64748b;">productos críticos</div>
        </div>
        <div style="background: #fff; border-radius: 12px; padding: 1.25rem; border: 1px solid #e2e8f0;">
          <div style="font-size: 0.8rem; color: #64748b; font-weight: 600;">TOP VENDEDOR</div>
          <div style="font-size: 1.2rem; font-weight: 700; color: #0f172a; margin-top: 0.25rem;">{{ resumen?.top_vendedor?.nombre || '—' }}</div>
          <div style="font-size: 0.8rem; color: #64748b;">{{ resumen?.top_vendedor?.entregados || 0 }} entregas hoy</div>
        </div>
      </div>

      <!-- Ventas por periodo + Metas -->
      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; margin-bottom: 2rem;">
        <div style="background: #fff; border-radius: 12px; padding: 1.25rem; border: 1px solid #e2e8f0;">
          <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 1rem;">Ventas por Período</h3>
          <div style="display: flex; gap: 1rem; align-items: flex-end; height: 200px; padding: 0 0.5rem;">
            <div *ngFor="let p of periodos" style="flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; justify-content: flex-end;">
              <div style="font-size: 0.8rem; font-weight: 700; color: #006c49; margin-bottom: 0.3rem;">S/ {{ (ventas?.[p.key]?.monto || 0).toFixed(2) }}</div>
              <div style="width: 100%; max-width: 80px; border-radius: 6px 6px 0 0; transition: height 0.5s ease;"
                   [style.height.%]="getBarHeight(ventas?.[p.key]?.monto || 0)"
                   [style.background]="getBarColor(ventas?.[p.key]?.monto, ventas?.[p.key]?.meta)">
              </div>
              <div style="font-size: 0.75rem; font-weight: 600; color: #64748b; text-transform: uppercase; margin-top: 0.5rem;">{{ p.label }}</div>
              <div style="font-size: 0.7rem; color: #94a3b8;">{{ ventas?.[p.key]?.total_pedidos || 0 }} ped · Meta S/ {{ (ventas?.[p.key]?.meta || 0).toFixed(2) }}</div>
            </div>
          </div>
        </div>
        <div style="background: #fff; border-radius: 12px; padding: 1.25rem; border: 1px solid #e2e8f0;">
          <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 1rem;">Metas</h3>
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <div *ngFor="let m of metasList">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: 600; font-size: 0.85rem;">{{ m.label }}</span>
                <div>
                  <span style="font-weight: 700; color: #006c49;">S/ {{ m.monto.toFixed(2) }}</span>
                  <button style="margin-left: 0.5rem; padding: 0.2rem 0.5rem; font-size: 0.75rem; border: 1px solid #e2e8f0; border-radius: 4px; background: none; cursor: pointer;" (click)="editMeta(m.tipo)">✏️</button>
                </div>
              </div>
              <div style="margin-top: 0.4rem;">
                <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: #64748b; margin-bottom: 0.2rem;">
                  <span>Progreso</span>
                  <span>{{ getProgress(m.tipo) | number:'1.0-1' }}%</span>
                </div>
                <div style="height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden;">
                  <div [style.width.%]="getProgress(m.tipo)" [style.background]="getProgressColor(getProgress(m.tipo))" style="height: 100%; border-radius: 4px; transition: width 0.4s ease;"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Productos con barras -->
      <div style="background: #fff; border-radius: 12px; padding: 1.25rem; border: 1px solid #e2e8f0; margin-bottom: 2rem;">
        <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 1rem;">Top Productos</h3>
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          <div *ngFor="let p of topProductos" style="display: flex; align-items: center; gap: 0.75rem;">
            <span style="font-size: 1.5rem;">{{ p.emoji }}</span>
            <div style="flex: 1; display: flex; flex-direction: column; gap: 0.2rem;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: 600; font-size: 0.88rem;">{{ p.nombre }}</span>
                <span style="font-weight: 700; font-size: 0.85rem; color: #006c49;">{{ p.total_vendido }} vendidos</span>
              </div>
              <div style="height: 12px; background: #f1f5f9; border-radius: 6px; overflow: hidden;">
                <div [style.width.%]="getBarWidth(p.total_vendido)" style="height: 100%; background: linear-gradient(90deg, #006c49, #00a86b); border-radius: 6px; transition: width 0.5s ease;"></div>
              </div>
            </div>
          </div>
          <div *ngIf="topProductos.length === 0" style="text-align: center; padding: 1rem; color: #64748b;">Sin datos de ventas</div>
        </div>
      </div>
    </div>

    <!-- Meta edit modal -->
    <div *ngIf="showMetaModal" style="position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 300;">
      <div style="background: #fff; border-radius: 16px; width: 100%; max-width: 400px; padding: 1.5rem;">
        <h3>Editar Meta {{ editingMetaTipo }}</h3>
        <p style="font-size: 0.85rem; color: #64748b; margin: 0.5rem 0;">Monto en S/</p>
        <input type="number" class="fm-input" [(ngModel)]="editingMetaValue" placeholder="Monto en S/" min="0" step="10" />
        <div style="display: flex; gap: 0.75rem; margin-top: 1rem;">
          <button class="fm-btn fm-btn-secondary" style="flex: 1;" (click)="showMetaModal = false">Cancelar</button>
          <button class="fm-btn fm-btn-primary" style="flex: 1;" (click)="saveMeta()">Guardar</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .material-symbols-outlined { font-size: 1.2rem; vertical-align: middle; }
  `]
})
export class DashboardComponent implements OnInit {
  loading: boolean = false;
  resumen: any = {};
  ventas: any = {};
  topProductos: any[] = [];
  metasList: any[] = [];
  periodos = [
    { key: 'dia', label: 'Hoy' },
    { key: 'semana', label: 'Semana' },
    { key: 'mes', label: 'Mes' },
    { key: 'manana', label: 'Mañana' }
  ];
  showMetaModal = false;
  editingMetaTipo = '';
  editingMetaValue = 0;

  private _maxVendido = 0;

  constructor(private reportService: ReportService, private auth: AuthService) {}

  ngOnInit(): void {
    this.loadData();
  }

  // Carga resumen, ventas por período y tendencias en paralelo
  loadData(): void {
    this.loading = true;
    forkJoin({
      resumen: this.reportService.getResumen(),
      ventas: this.reportService.getVentas(),
      tendencias: this.reportService.getTendencias()
    }).subscribe({
      next: (r) => {
        this.resumen = r.resumen;
        this.ventas = r.ventas;
        this.topProductos = r.tendencias.productos || [];
        this._maxVendido = Math.max(...this.topProductos.map(p => p.total_vendido), 1);
        this.buildMetasList();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar dashboard:', err);
        this.loading = false;
      }
    });
  }

  // Construye la lista de metas diaria, semanal y mensual
  buildMetasList(): void {
    const labels: any = { dia: 'Diaria', semana: 'Semanal', mes: 'Mensual' };
    this.metasList = ['dia', 'semana', 'mes'].map(key => ({
      tipo: key.toUpperCase(),
      label: labels[key],
      monto: this.ventas?.[key]?.meta || 0
    }));
  }

  // Calcula porcentaje de progreso respecto a la meta
  getProgress(tipo: string): number {
    const periodKey = tipo.toLowerCase();
    const venta = this.ventas?.[periodKey];
    const meta = venta?.meta || 1;
    const monto = venta?.monto || 0;
    return Math.min((monto / meta) * 100, 100);
  }

  // Color según nivel de cumplimiento: rojo < 50%, amarillo < 80%, verde >= 80%
  getProgressColor(progress: number): string {
    if (progress < 50) return '#ef4444';
    if (progress < 80) return '#f59e0b';
    return '#22c55e';
  }

  // Altura proporcional al monto máximo entre los períodos mostrados
  getBarHeight(monto: number): number {
    const maxMonto = Math.max(
      this.ventas?.dia?.monto || 0,
      this.ventas?.semana?.monto || 0,
      this.ventas?.mes?.monto || 0,
      1
    );
    return (monto / maxMonto) * 100;
  }

  // Color de barra según relación monto/meta: verde si cumple, amarillo si >50%, rojo si no
  getBarColor(monto: number, meta: number): string {
    if (!meta || meta === 0) return 'linear-gradient(180deg, #00a86b, #006c49)';
    const ratio = monto / meta;
    if (ratio >= 1) return 'linear-gradient(180deg, #22c55e, #16a34a)';
    if (ratio >= 0.5) return 'linear-gradient(180deg, #facc15, #eab308)';
    return 'linear-gradient(180deg, #ef4444, #dc2626)';
  }

  // Ancho de barra proporcional al máximo vendido entre todos los productos
  getBarWidth(vendido: number): number {
    return (vendido / this._maxVendido) * 100;
  }

  // Abre modal para editar el valor de una meta
  editMeta(tipo: string): void {
    this.editingMetaTipo = tipo;
    const meta = this.metasList.find(m => m.tipo === tipo);
    this.editingMetaValue = meta?.monto || 0;
    this.showMetaModal = true;
  }

  // Guarda la meta editada y recarga los datos
  saveMeta(): void {
    const user = this.auth.getCurrentUser();
    if (!user) return;
    this.reportService.updateMeta(this.editingMetaTipo, this.editingMetaValue, user.id).subscribe({
      next: () => {
        this.showMetaModal = false;
        this.loadData();
      },
      error: (err) => {
        console.error('Error al guardar meta:', err);
      }
    });
  }
}
