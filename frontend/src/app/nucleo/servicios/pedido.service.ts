import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Pedido, PedidoDetalle } from '../../compartido/modelos';

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private api: ApiService) {}

  getAll(estado?: string): Observable<Pedido[]> {
    const query = estado ? `?estado=${estado}` : '';
    return this.api.get<Pedido[]>(`/pedidos${query}`).pipe(map(r => r.data));
  }

  getById(id: number): Observable<PedidoDetalle> {
    return this.api.get<PedidoDetalle>(`/pedidos/${id}`).pipe(map(r => r.data));
  }

  create(data: any): Observable<PedidoDetalle> {
    return this.api.post<PedidoDetalle>('/pedidos', data).pipe(map(r => r.data));
  }

  verificarStock(items: any[]): Observable<any> {
    return this.api.post<any>('/pedidos/verificar-stock', { items });
  }

  entregar(id: number, encargadoId: number): Observable<void> {
    return this.api.patch<void>(`/pedidos/${id}/entregar`, { encargadoId }).pipe(map(() => undefined));
  }

  devolver(id: number, encargadoId: number, motivo?: string): Observable<void> {
    return this.api.patch<void>(`/pedidos/${id}/devolver`, { encargadoId, motivo }).pipe(map(() => undefined));
  }
}
