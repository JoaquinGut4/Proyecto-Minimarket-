import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription, debounceTime, switchMap } from 'rxjs';
import { ProductService } from '../../../nucleo/servicios/producto.service';
import { CategoryService } from '../../../nucleo/servicios/categoria.service';
import { AuthService } from '../../../nucleo/servicios/auth.service';
import { Producto, Categoria } from '../../../compartido/modelos';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <div *ngIf="loading" style="text-align: center; padding: 2rem; color: #64748b;">Cargando...</div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
        <h2 style="font-size: 1.3rem; font-weight: 700;">Gesti\u00f3n de Stock</h2>
      </div>
      <div style="display: flex; gap: 0.75rem; margin-bottom: 1rem;">
        <input type="text" class="fm-input" style="flex: 1; padding: 0.5rem 0.75rem;"
               placeholder="Buscar producto..." [(ngModel)]="searchTerm" (ngModelChange)="onSearchChange()" />
        <select class="fm-input" style="width: 180px; padding: 0.5rem 0.75rem; text-align: center; text-align-last: center;" [(ngModel)]="selectedCategoria" (ngModelChange)="loadProductos()">
          <option value="" style="text-align: center;">Todas las categor\u00edas</option>
          <option *ngFor="let c of categorias" [value]="c.nombre">{{ c.nombre }}</option>
        </select>
      </div>
      <div style="background: #fff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #f8fafc; font-size: 0.8rem; font-weight: 600; color: #64748b; text-transform: uppercase;">
              <th style="padding: 0.75rem 1rem; text-align: left;">Producto</th>
              <th style="padding: 0.75rem 1rem; text-align: left;">Categor\u00eda</th>
              <th style="padding: 0.75rem 1rem; text-align: left;">Precio</th>
              <th style="padding: 0.75rem 1rem; text-align: left;">Stock Actual</th>
              <th style="padding: 0.75rem 1rem; text-align: left;">Nuevo Stock</th>
              <th style="padding: 0.75rem 1rem; text-align: left;">Nuevo Precio</th>
              <th style="padding: 0.75rem 1rem; text-align: left;">Acci\u00f3n</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let p of productos" style="border-top: 1px solid #f1f5f9; font-size: 0.85rem;">
              <td style="padding: 0.75rem 1rem;">
                <span style="font-size: 1.2rem; margin-right: 0.5rem;">{{ p.emoji }}</span>
                <span style="font-weight: 500;">{{ p.nombre }}</span>
              </td>
              <td style="padding: 0.75rem 1rem; color: #64748b;">{{ p.categoria }}</td>
              <td style="padding: 0.75rem 1rem; font-weight: 600;">S/ {{ p.precio.toFixed(2) }}</td>
              <td style="padding: 0.75rem 1rem;">
                <span [style.color]="p.stock <= 5 ? '#ef4444' : '#0f172a'" style="font-weight: 700;">{{ p.stock }}</span>
              </td>
              <td style="padding: 0.75rem 1rem;">
                <input type="number" class="fm-input" style="width: 80px; padding: 0.35rem;" [(ngModel)]="editStock[p.id]" [placeholder]="p.stock.toString()" />
              </td>
              <td style="padding: 0.75rem 1rem;">
                <input type="number" class="fm-input" style="width: 100px; padding: 0.35rem;" [(ngModel)]="editPrecio[p.id]" [placeholder]="p.precio.toFixed(2)" step="0.1" />
              </td>
              <td style="padding: 0.75rem 1rem;">
                <button class="fm-btn fm-btn-primary" style="padding:0.35rem 0.75rem; font-size:0.8rem;" (click)="updateProducto(p)">Actualizar</button>
              </td>
            </tr>
            <tr *ngIf="productos.length === 0">
              <td colspan="7" style="text-align: center; padding: 2rem; color: #64748b;">No se encontraron productos</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class StockComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  productos: Producto[] = [];
  categorias: Categoria[] = [];
  editStock: { [key: number]: number } = {};
  editPrecio: { [key: number]: number } = {};
  searchTerm: string = '';
  selectedCategoria: string = '';

  // Subject para búsqueda con debounce: evita llamadas innecesarias al backend
  private searchSubject = new Subject<void>();
  private searchSub?: Subscription;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.categoryService.getAll().subscribe({
      next: (res) => { this.categorias = res; },
      error: (err) => { console.error('Error al cargar categorías:', err); }
    });
    // Búsqueda reactiva con debounce de 300ms
    this.searchSub = this.searchSubject.pipe(
      debounceTime(300),
      switchMap(() => {
        this.loading = true;
        return this.productService.getAll(this.selectedCategoria || undefined, this.searchTerm || undefined);
      })
    ).subscribe({
      next: (res) => { this.productos = res; this.initEdits(); this.loading = false; },
      error: (err) => { console.error('Error:', err); this.loading = false; }
    });
    this.loadProductos();
  }

  ngOnDestroy(): void {
    this.searchSub?.unsubscribe();
  }

  // Dispara la búsqueda con debounce al cambiar el texto
  onSearchChange(): void {
    this.searchSubject.next();
  }

  // Carga productos con filtro de categoría
  loadProductos(): void {
    this.loading = true;
    this.productService.getAll(this.selectedCategoria || undefined, this.searchTerm || undefined).subscribe({
      next: (res) => { this.productos = res; this.initEdits(); this.loading = false; },
      error: (err) => { console.error('Error:', err); this.loading = false; }
    });
  }

  // Inicializa los campos editables con los valores actuales
  private initEdits(): void {
    this.productos.forEach(p => {
      this.editStock[p.id] = p.stock;
      this.editPrecio[p.id] = p.precio;
    });
  }

  // Actualiza producto en el backend si stock o precio cambiaron
  updateProducto(p: Producto): void {
    const user = this.auth.getCurrentUser();
    if (!user) return;
    const newStock = this.editStock[p.id];
    const newPrecio = this.editPrecio[p.id];
    if (newStock === p.stock && newPrecio === p.precio) return;
    if (!confirm(`¿Actualizar stock de "${p.nombre}"?`)) return;
    this.productService.update(p.id, {
      stock: newStock,
      precio: newPrecio,
      encargado_id: user.id,
      observacion: 'Ajuste manual desde panel'
    }).subscribe({
      next: () => { this.loadProductos(); },
      error: (err) => { console.error('Error:', err); }
    });
  }
}
