import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Producto } from '../../compartido/modelos';

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private api: ApiService) {}

  getAll(categoria?: string, q?: string): Observable<Producto[]> {
    let params = new URLSearchParams();
    if (categoria && categoria !== 'Todos') params.set('categoria', categoria);
    if (q) params.set('q', q);
    const query = params.toString();
    return this.api.get<Producto[]>(`/productos${query ? '?' + query : ''}`).pipe(map(r => r.data));
  }

  getById(id: number): Observable<Producto> {
    return this.api.get<Producto>(`/productos/${id}`).pipe(map(r => r.data));
  }

  create(data: any): Observable<Producto> {
    return this.api.post<Producto>('/productos', data).pipe(map(r => r.data));
  }

  update(id: number, data: any): Observable<Producto> {
    return this.api.put<Producto>(`/productos/${id}`, data).pipe(map(r => r.data));
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`/productos/${id}`).pipe(map(() => undefined));
  }
}
