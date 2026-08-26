export interface ApiResponse<T> {
  ok: boolean;
  data: T;
  mensaje?: string;
  error?: string;
  detail?: string;
}

export interface Categoria {
  id: number;
  nombre: string;
  emoji: string;
  activo: boolean;
}

export interface Producto {
  id: number;
  nombre: string;
  emoji: string;
  categoria: string;
  catEmoji: string;
  precio: number;
  stock: number;
  refrigerado: boolean;
  activo: boolean;
}

export interface Encargado {
  id: number;
  nombre: string;
  dni: string;
  telefono: string;
  rol: 'ADMIN' | 'ENCARGADO';
  activo: boolean;
}

export interface LoginResponse {
  id: number;
  nombre: string;
  dni: string;
  telefono: string;
  rol: 'ADMIN' | 'ENCARGADO';
  activo: boolean;
  token?: string;
}

export interface Pedido {
  id: number;
  codigoRecojo: string;
  telefonoCliente: string;
  metodoPago: string;
  total: number;
  estado: string;
  encargado: string | null;
  creadoEn: string;
  actualizadoEn: string;
}

export interface PedidoDetalle extends Pedido {
  items: DetalleItem[];
}

export interface DetalleItem {
  producto: string;
  emoji: string;
  cantidad: number;
  precioUnit: number;
  subtotal: number;
}

export interface Movimiento {
  id: number;
  encargado: string;
  fecha: string;
  producto: string;
  emoji: string;
  tipo: string;
  cantidad: number;
  precioRef: number;
  pedidoId: number | null;
  observacion: string | null;
}

export interface Meta {
  id: number;
  tipo: 'DIA' | 'SEMANA' | 'MES';
  monto: number;
  encargado_id: number;
  creado_en: string;
}

export interface NotaCredito {
  id: number;
  pedido_id: number;
  encargado_id: number;
  monto: number;
  motivo: string;
  creado_en: string;
  encargado: string;
  codigo_recojo: string;
}

export interface Resumen {
  ventas_hoy: { total: number; monto: number };
  pendientes: { total: number };
  stock_bajo: { total: number };
  top_vendedor: { nombre: string; entregados: number } | null;
}

export interface Tendencias {
  productos: any[];
  metodos_pago: any[];
}

export interface Actividad {
  tipo: string;
  id: number;
  referencia: string;
  descripcion: string;
  fecha: string;
  encargado: string | null;
}

export interface VentasPeriodo {
  dia: { total_pedidos: number; monto: number; meta: number };
  semana: { total_pedidos: number; monto: number; meta: number };
  mes: { total_pedidos: number; monto: number; meta: number };
}
