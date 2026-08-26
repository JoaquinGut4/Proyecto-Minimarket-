import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ProductService } from '../../nucleo/servicios/producto.service';
import { CategoryService } from '../../nucleo/servicios/categoria.service';
import { OrderService } from '../../nucleo/servicios/pedido.service';
import { Producto, Categoria } from '../../compartido/modelos';

interface CartItem {
  producto: Producto;
  cantidad: number;
}

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <header class="header">
      <div class="header-inner">
        <div style="display:flex;align-items:center;gap:1.5rem;">
          <div class="brand">
            <div class="brand-icon">🛒</div>
            <span class="brand-name">Kapaq</span>
          </div>
          <nav class="nav">
            <button class="nav-btn" [class.active]="activeSection === 'home'" (click)="showSection('home')">Inicio</button>
            <button class="nav-btn" [class.active]="activeSection === 'catalog'" (click)="showSection('catalog')">Catálogo</button>
            <button class="nav-btn" [class.active]="activeSection === 'contact'" (click)="showSection('contact')">Contacto</button>
          </nav>
        </div>
        <div class="header-actions">
          <button class="header-icon-btn" (click)="focusSearch()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
          <button class="cart-toggle" (click)="toggleCart()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            Carrito
            <span class="cart-count">{{ cartItems.length }}</span>
          </button>
          <button class="nav-btn" style="color:var(--fo-accent);border:1px solid rgba(0,200,150,0.3);padding:0.45rem 1rem;border-radius:999px;font-weight:600;font-size:0.85rem"
                  (click)="goToAdmin()">Admin</button>
        </div>
      </div>
    </header>

    <main class="main-content">
      <!-- HOME SECTION -->
      <section class="section" [class.active]="activeSection === 'home'">
        <div class="hero">
          <div class="hero-content">
            <div class="hero-badge">🛒 Tu tienda de confianza</div>
            <h1 class="hero-title">
              Fresco.<br/>
              <span class="hero-highlight">Cerca.</span><br/>
              Recoge <span class="hero-accent">rápido</span>.
            </h1>
            <p class="hero-desc">
              Descubre una selección de productos frescos y de calidad,
              listos para recoger en tienda sin esperas.
            </p>
            <div class="hero-actions">
              <button class="btn-primary" (click)="showSection('catalog')">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right:0.4rem;">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                Explorar Catálogo
              </button>
              <button class="btn-outline" (click)="showSection('contact')">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:0.4rem;">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                Contáctanos
              </button>
            </div>
            <div class="hero-features">
              <div class="hero-feature">
                <span class="hero-feature-icon">🥬</span>
                <span>Productos Frescos</span>
              </div>
              <div class="hero-feature">
                <span class="hero-feature-icon">⚡</span>
                <span>Recoge en Tienda</span>
              </div>
              <div class="hero-feature">
                <span class="hero-feature-icon">💚</span>
                <span>Precios Justos</span>
              </div>
            </div>
          </div>
          <div class="hero-visual">
            <div class="hero-card hero-card-1">🥑</div>
            <div class="hero-card hero-card-2">🍓</div>
            <div class="hero-card hero-card-3">🥛</div>
            <div class="hero-card hero-card-4">🍞</div>
            <div class="hero-card hero-card-5">🧀</div>
            <div class="hero-card hero-card-6">🥩</div>
            <div class="hero-card hero-card-7">🧃</div>
            <div class="hero-card hero-card-8">🥚</div>
            <div class="hero-card hero-card-9">🍌</div>
            <div class="hero-card hero-card-10">🥕</div>
          </div>
        </div>
      </section>

      <!-- CATALOG SECTION -->
      <section class="section" [class.active]="activeSection === 'catalog'">
        <div *ngIf="loading" style="text-align: center; padding: 2rem; color: #64748b;">Cargando...</div>
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div class="search-wrap" style="position: relative; flex: 1; max-width: 400px;">
            <input #searchInput type="text" class="fm-input" placeholder="Buscar producto..." style="padding-left: 2.5rem;" (input)="filterProducts()" [(ngModel)]="searchQuery" />
          </div>
          <h2 class="catalog-title">Catálogo <span style="color: var(--fo-muted); font-weight: 400;">({{ productos.length }})</span></h2>
        </div>
        <div style="margin: 1rem 0;">
          <select class="fm-input" style="max-width: 320px;" [(ngModel)]="selectedCategory" (change)="applyFilter()">
            <option value="Todos">🌐 Todas las Categorías</option>
            <option *ngFor="let cat of categorias" [value]="cat.nombre">{{ cat.emoji }} {{ cat.nombre }}</option>
          </select>
        </div>
        <div class="products-grid">
          <div *ngFor="let p of filteredProductos" style="background: var(--fo-surface); border-radius: var(--radius-md); padding: 1rem; border: 1px solid var(--fo-border); display: flex; flex-direction: column;"
               (click)="addToCart(p)">
            <div style="font-size: 2.5rem; text-align: center; margin-bottom: 0.5rem;">{{ p.emoji }}</div>
            <div style="font-weight: 600; font-size: 0.9rem;">{{ p.nombre }}</div>
            <div style="color: var(--fo-muted); font-size: 0.8rem;">{{ p.categoria }}</div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 0.5rem;">
              <strong style="color: var(--fo-accent);">S/ {{ p.precio.toFixed(2) }}</strong>
              <span style="font-size: 0.75rem; padding: 0.15rem 0.5rem; border-radius: 999px; background: #f1f5f9;">
                {{ p.stock > 0 ? p.stock + ' uds' : 'Agotado' }}
              </span>
            </div>
          </div>
        </div>
        <div *ngIf="filteredProductos.length === 0" style="text-align: center; padding: 3rem; color: var(--fo-muted);">
          No se encontraron productos
        </div>
      </section>

      <!-- CONTACT SECTION -->
      <section class="section" [class.active]="activeSection === 'contact'">
        <div style="max-width: 800px; margin: 0 auto; text-align: center; padding: 3rem 0;">
          <h2>Contacto</h2>
          <p style="color: var(--fo-muted); margin: 1rem 0;">¿Tienes dudas? Estamos aquí para ayudarte.</p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-top: 2rem;">
            <div style="background: var(--fo-surface); border-radius: var(--radius-md); padding: 1.5rem; border: 1px solid var(--fo-border);">
              <div style="font-size: 2rem;">📞</div>
              <h4>Llamanos</h4>
              <p>+51 987 654 321</p>
            </div>
            <div style="background: var(--fo-surface); border-radius: var(--radius-md); padding: 1.5rem; border: 1px solid var(--fo-border);">
              <div style="font-size: 2rem;">📧</div>
              <h4>Email</h4>
              <p>hola&#64;kapaq.pe</p>
            </div>
            <div style="background: var(--fo-surface); border-radius: var(--radius-md); padding: 1.5rem; border: 1px solid var(--fo-border);">
              <div style="font-size: 2rem;">📍</div>
              <h4>Ubícanos</h4>
              <p>Av. Principal 123, Lima</p>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer style="border-top: 1px solid var(--fo-border); background: var(--fo-surface); padding: 2rem 1.5rem; margin-top: 3rem;">
      <div style="max-width: 1280px; margin: 0 auto; display: flex; flex-wrap: wrap; justify-content: space-between; gap: 2rem;">
        <div>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 1.5rem;">🛒</span>
            <strong>Kapaq</strong>
          </div>
          <p style="color: var(--fo-muted); font-size: 0.85rem; margin-top: 0.5rem;">Fresco. Cerca. Recoge rápido.</p>
        </div>
        <div>
          <h4>Más</h4>
          <div style="display: flex; flex-direction: column; gap: 0.3rem; margin-top: 0.5rem;">
            <a style="cursor: pointer; color: var(--fo-muted); font-size: 0.85rem;" (click)="showSection('home')">Inicio</a>
            <a style="cursor: pointer; color: var(--fo-muted); font-size: 0.85rem;" (click)="showSection('catalog')">Catálogo</a>
            <a style="cursor: pointer; color: var(--fo-muted); font-size: 0.85rem;" (click)="showSection('contact')">Contacto</a>
          </div>
        </div>
      </div>
      <div style="max-width: 1280px; margin: 1rem auto 0; padding-top: 1rem; border-top: 1px solid var(--fo-border); text-align: center; font-size: 0.8rem; color: var(--fo-muted);">
        © 2026 Kapaq Minimarket. Todos los derechos reservados.
      </div>
    </footer>

    <!-- CART DRAWER -->
    <div class="cart-overlay" *ngIf="cartOpen" style="position: fixed; inset: 0; background: rgba(0,0,0,0.3); z-index: 200;" (click)="closeCart()"></div>
    <div class="cart-drawer" *ngIf="cartOpen" style="position: fixed; top: 0; right: 0; width: 380px; height: 100vh; background: var(--fo-surface); z-index: 201; box-shadow: -4px 0 24px rgba(0,0,0,0.1); display: flex; flex-direction: column;">
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; border-bottom: 1px solid var(--fo-border);">
        <h3>🛒 Tu Carrito</h3>
        <button style="background: none; border: none; font-size: 1.2rem; color: var(--fo-muted);" (click)="closeCart()">✕</button>
      </div>
      <div style="flex: 1; overflow-y: auto; padding: 1rem;">
        <div *ngFor="let item of cartItems; let i = index" style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 0; border-bottom: 1px solid var(--fo-border);">
          <span style="font-size: 1.5rem;">{{ item.producto.emoji }}</span>
          <div style="flex: 1;">
            <div style="font-weight: 600; font-size: 0.85rem;">{{ item.producto.nombre }}</div>
            <div style="color: var(--fo-muted); font-size: 0.8rem;">S/ {{ (item.producto.precio * item.cantidad).toFixed(2) }}</div>
          </div>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <button style="width: 28px; height: 28px; border-radius: 50%; border: 1px solid var(--fo-border); background: none;" (click)="updateQuantity(i, item.cantidad - 1)">−</button>
            <span style="font-weight: 600; min-width: 20px; text-align: center;">{{ item.cantidad }}</span>
            <button style="width: 28px; height: 28px; border-radius: 50%; border: 1px solid var(--fo-border); background: none;" (click)="updateQuantity(i, item.cantidad + 1)">+</button>
          </div>
        </div>
        <div *ngIf="cartItems.length === 0" style="text-align: center; padding: 3rem; color: var(--fo-muted);">Carrito vacío</div>
      </div>
      <div style="padding: 1rem 1.5rem; border-top: 1px solid var(--fo-border);" *ngIf="cartItems.length > 0">
        <div style="display: flex; justify-content: space-between; font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem;">
          <span>Total</span>
          <strong style="color: var(--fo-accent);">S/ {{ cartTotal.toFixed(2) }}</strong>
        </div>
        <button class="btn-primary" style="width: 100%; justify-content: center; padding: 0.85rem; font-size: 1rem;" (click)="startCheckout()">Reservar →</button>
      </div>
    </div>

    <!-- CHECKOUT/PAYMENT MODAL -->
    <div class="fm-modal-overlay" *ngIf="showPaymentModal" style="position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 300;">
      <div style="background: var(--fo-surface); border-radius: var(--radius-lg); width: 100%; max-width: 420px; padding: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h3>📋 Confirmar Reserva</h3>
          <button style="background: none; border: none; font-size: 1.2rem;" (click)="showPaymentModal = false">✕</button>
        </div>

        <div style="text-align: center; padding: 0.75rem; background: #f0fdf4; border-radius: 8px; margin-bottom: 1rem;">
          <span style="font-size: 0.85rem; font-weight: 500; color: #065f46;">📋 Reserva tus productos y paga al recogerlos en tienda</span>
        </div>

        <div *ngFor="let item of cartItems" style="display: flex; justify-content: space-between; font-size: 0.85rem; padding: 0.3rem 0;">
          <span>{{ item.producto.nombre }} x{{ item.cantidad }}</span>
          <span>S/ {{ (item.producto.precio * item.cantidad).toFixed(2) }}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 0.75rem 0; border-top: 1px solid var(--fo-border); font-weight: 700; font-size: 1.1rem;">
          <span>Total</span>
          <span style="color: var(--fo-accent);">S/ {{ cartTotal.toFixed(2) }}</span>
        </div>
        <div style="margin: 1rem 0;">
          <label style="font-size: 0.75rem; font-weight: 600; color: #64748b; display: block; margin-bottom: 0.3rem;">N° de celular</label>
          <input type="tel" class="fm-input" placeholder="999 999 999" maxlength="9" [(ngModel)]="phoneNumber" />
        </div>
        <div style="display: flex; gap: 0.75rem;">
          <button class="fm-btn fm-btn-secondary" style="flex: 1;" (click)="showPaymentModal = false">Cancelar</button>
          <button class="fm-btn fm-btn-primary" style="flex: 1;" (click)="confirmPayment()">Reservar</button>
        </div>
      </div>
    </div>

    <!-- SUCCESS MODAL -->
    <div class="fm-modal-overlay" *ngIf="showSuccessModal" style="position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 300;">
      <div style="background: var(--fo-surface); border-radius: var(--radius-lg); width: 100%; max-width: 400px; padding: 2rem; text-align: center;">
        <div style="font-size: 3rem; margin-bottom: 0.5rem;">✅</div>
        <h3>🎉 Reserva Registrada</h3>
        <p style="color: var(--fo-muted); margin: 1rem 0;">Tu código de recojo es:</p>
        <div style="font-family: 'Space Mono', monospace; font-size: 2.5rem; font-weight: 700; color: var(--fo-accent); letter-spacing: 0.15em;">{{ pickupCode }}</div>
        <p style="color: var(--fo-muted); font-size: 0.85rem; margin-top: 1rem;">Preséntalo en tienda para recoger tu pedido.</p>
        <button class="btn-primary" style="margin-top: 1.5rem; width: 100%; justify-content: center;" (click)="finishOrder()">Finalizar</button>
      </div>
    </div>

    <!-- TOAST -->
    <div class="toast-container" *ngIf="toastMessage">
      <div style="background: var(--fo-accent); color: #fff; padding: 0.75rem 1.25rem; border-radius: var(--radius-sm); font-size: 0.88rem; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
        {{ toastMessage }}
      </div>
    </div>
  `,
  styles: [`
    .section { display: none; }
    .section.active { display: block; }

    .hero {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 3rem;
      padding: 3rem 0;
      min-height: calc(100vh - 80px);
    }

    .hero-content {
      flex: 1;
      max-width: 580px;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--fo-accent);
      background: rgba(0,200,150,0.1);
      padding: 0.35rem 1rem;
      border-radius: 999px;
      margin-bottom: 1.5rem;
    }

    .hero-title {
      font-size: 3.2rem;
      font-weight: 800;
      line-height: 1.1;
      margin: 0 0 1.2rem;
    }

    .hero-highlight {
      background: linear-gradient(135deg, var(--fo-accent), #00b894);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero-accent {
      color: var(--fo-accent);
    }

    .hero-desc {
      color: var(--fo-muted);
      font-size: 1.1rem;
      line-height: 1.6;
      margin-bottom: 2rem;
      max-width: 440px;
    }

    .hero-actions {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
      margin-bottom: 2.5rem;
    }

    .btn-outline {
      display: inline-flex;
      align-items: center;
      padding: 0.75rem 1.5rem;
      border: 2px solid var(--fo-border);
      border-radius: var(--radius-sm);
      background: transparent;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-outline:hover {
      border-color: var(--fo-accent);
      color: var(--fo-accent);
    }

    .hero-features {
      display: flex;
      gap: 1.5rem;
      flex-wrap: wrap;
    }

    .hero-feature {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.85rem;
      font-weight: 500;
      color: var(--fo-muted);
    }

    .hero-feature-icon {
      font-size: 1.1rem;
    }

    .hero-visual {
      position: relative;
      width: 420px;
      height: 420px;
      flex-shrink: 0;
    }

    .hero-card {
      position: absolute;
      width: 100px;
      height: 100px;
      background: var(--fo-surface);
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
      box-shadow: 0 8px 32px rgba(0,0,0,0.08);
      animation: float 6s ease-in-out infinite;
    }

    .hero-card-1 { top: 20px; left: 0; animation-delay: 0s; }
    .hero-card-2 { top: 0; right: 40px; animation-delay: -1.5s; }
    .hero-card-3 { bottom: 40px; left: 40px; animation-delay: -3s; }
    .hero-card-4 { bottom: 0; right: 0; animation-delay: -4.5s; }
    .hero-card-5 { top: 120px; left: 80px; animation-delay: -1s; width: 80px; height: 80px; font-size: 2rem; }
    .hero-card-6 { top: 80px; right: 120px; animation-delay: -2.5s; width: 80px; height: 80px; font-size: 2rem; }
    .hero-card-7 { bottom: 120px; left: 0; animation-delay: -4s; width: 80px; height: 80px; font-size: 2rem; }
    .hero-card-8 { bottom: 80px; right: 80px; animation-delay: -5.5s; width: 80px; height: 80px; font-size: 2rem; }
    .hero-card-9 { top: 160px; right: 0; animation-delay: -0.5s; width: 70px; height: 70px; font-size: 1.7rem; }
    .hero-card-10 { bottom: 160px; left: 100px; animation-delay: -3.5s; width: 70px; height: 70px; font-size: 1.7rem; }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-12px); }
    }

    @media (max-width: 768px) {
      .hero { flex-direction: column; text-align: left; padding: 2rem 0; min-height: auto; }
      .hero-title { font-size: 2.2rem; }
      .hero-visual { width: 260px; height: 260px; }
      .hero-card { width: 70px; height: 70px; font-size: 1.8rem; }
      .hero-card-5, .hero-card-6, .hero-card-7, .hero-card-8 { width: 60px; height: 60px; font-size: 1.5rem; }
      .hero-card-9, .hero-card-10 { display: none; }
    }
  `]
})
export class CatalogComponent implements OnInit {
  loading: boolean = false;
  activeSection = 'home';
  categorias: Categoria[] = [];
  productos: Producto[] = [];
  filteredProductos: Producto[] = [];
  selectedCategory = 'Todos';
  searchQuery = '';
  cartItems: CartItem[] = [];
  cartOpen = false;
  showPaymentModal = false;
  showSuccessModal = false;
  selectedPayment = 'reserva';
  phoneNumber = '';
  pickupCode = '';
  toastMessage = '';
  private toastTimeout: any;
  private searchSubject = new Subject<string>();

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.loadCategorias();
    this.loadProductos();
    // Debounce de búsqueda para evitar llamadas excesivas al backend
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe({
      next: () => { this.applyFilter(); },
      error: (err) => { console.error('Error en búsqueda:', err); }
    });
  }

  // Carga la lista de categorías desde el servicio
  loadCategorias(): void {
    this.categoryService.getAll().subscribe({
      next: (res: any) => { this.categorias = res.data || res; },
      error: (err) => { console.error('Error:', err); }
    });
  }

  // Carga todos los productos y aplica el filtro inicial
  loadProductos(): void {
    this.productService.getAll().subscribe({
      next: (res) => { this.productos = res; this.applyFilter(); },
      error: (err) => { console.error('Error:', err); this.loading = false; }
    });
  }

  showSection(section: string): void {
    this.activeSection = section;
  }

  // Filtra productos por categoría seleccionada
  filterByCategory(cat: string): void {
    this.selectedCategory = cat;
    this.applyFilter();
  }

  filterProducts(): void {
    this.searchSubject.next(this.searchQuery);
  }

  // Consulta al backend con los filtros activos (categoría y texto de búsqueda)
  applyFilter(): void {
    this.productService.getAll(
      this.selectedCategory !== 'Todos' ? this.selectedCategory : undefined,
      this.searchQuery || undefined
    ).subscribe({
      next: (res) => { this.filteredProductos = res; this.loading = false; },
      error: (err) => { console.error('Error:', err); this.loading = false; }
    });
  }

  // Agrega un producto al carrito; si ya existe incrementa la cantidad
  addToCart(producto: Producto): void {
    if (producto.stock <= 0) { this.showToast('Producto agotado'); return; }
    const existing = this.cartItems.find(i => i.producto.id === producto.id);
    if (existing) {
      existing.cantidad++;
    } else {
      this.cartItems.push({ producto, cantidad: 1 });
    }
    this.showToast('Agregado al carrito');
  }

  // Actualiza la cantidad de un item; si llega a 0 lo elimina
  updateQuantity(index: number, qty: number): void {
    if (qty <= 0) {
      this.cartItems.splice(index, 1);
    } else {
      this.cartItems[index].cantidad = qty;
    }
  }

  // Calcula el total del carrito en tiempo real
  get cartTotal(): number {
    return this.cartItems.reduce((sum, item) => sum + item.producto.precio * item.cantidad, 0);
  }

  toggleCart(): void { this.cartOpen = !this.cartOpen; }
  closeCart(): void { this.cartOpen = false; }

  focusSearch(): void {
    this.showSection('catalog');
    setTimeout(() => {
      const input = document.querySelector('input');
      if (input) input.focus();
    }, 100);
  }

  startCheckout(): void {
    this.cartOpen = false;
    this.showPaymentModal = true;
  }

  // Envía el pedido al backend con el código de recojo generado
  confirmPayment(): void {
    if (!this.phoneNumber || this.phoneNumber.length < 9) {
      this.showToast('Ingrese un número de celular válido');
      return;
    }

    const codigo = this.generateCode();
    const items = this.cartItems.map(i => ({
      productoId: i.producto.id,
      cantidad: i.cantidad,
      precioUnit: i.producto.precio
    }));

    this.orderService.create({
      codigoRecojo: codigo,
      telefonoCliente: this.phoneNumber,
      metodoPago: 'reserva',
      total: this.cartTotal,
      items
    }).subscribe({
      next: () => {
        this.pickupCode = codigo;
        this.showPaymentModal = false;
        this.showSuccessModal = true;
      },
      error: (err) => this.showToast(err.message || 'Error al registrar pedido')
    });
  }

  // Limpia el carrito y vuelve a la pantalla de inicio tras finalizar
  finishOrder(): void {
    this.showSuccessModal = false;
    this.cartItems = [];
    this.phoneNumber = '';
    this.showSection('home');
  }

  goToAdmin(): void {
    this.router.navigate(['/admin/ingreso']);
  }

  // Genera un código alfanumérico único para el recojo del pedido
  private generateCode(): string {
    const chars = 'ABCDEFGHJKLMNPRSTUWXYZ';
    const p = chars[Math.floor(Math.random() * chars.length)];
    const n = Math.floor(Math.random() * 9000) + 1000;
    return p + n;
  }

  // Muestra un mensaje toast que se autodestruye a los 3 segundos
  private showToast(msg: string): void {
    this.toastMessage = msg;
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => { this.toastMessage = ''; }, 3000);
  }
}
