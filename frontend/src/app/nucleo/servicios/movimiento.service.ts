import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Movimiento } from '../../compartido/modelos';

@Injectable({ providedIn: 'root' })
export class MovementService {
  constructor(private api: ApiService) {}

  getAll(productoId?: number): Observable<Movimiento[]> {
    const query = productoId ? `?producto_id=${productoId}` : '';
    return this.api.get<Movimiento[]>(`/movimientos${query}`).pipe(map(r => r.data));
  }
}
