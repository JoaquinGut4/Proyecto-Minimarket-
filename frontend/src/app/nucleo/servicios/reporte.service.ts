import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Resumen, Tendencias, Actividad, VentasPeriodo, NotaCredito, Meta } from '../../compartido/modelos';

@Injectable({ providedIn: 'root' })
export class ReportService {
  constructor(private api: ApiService) {}

  getResumen(): Observable<Resumen> {
    return this.api.get<Resumen>('/reportes/resumen').pipe(map(r => r.data));
  }

  getTendencias(): Observable<Tendencias> {
    return this.api.get<Tendencias>('/reportes/tendencias').pipe(map(r => r.data));
  }

  getActividades(): Observable<Actividad[]> {
    return this.api.get<Actividad[]>('/reportes/actividades').pipe(map(r => r.data));
  }

  getVentas(): Observable<VentasPeriodo> {
    return this.api.get<VentasPeriodo>('/reportes/ventas').pipe(map(r => r.data));
  }

  getNotasCredito(): Observable<NotaCredito[]> {
    return this.api.get<NotaCredito[]>('/reportes/notas-credito').pipe(map(r => r.data));
  }

  getMetas(): Observable<Meta[]> {
    return this.api.get<Meta[]>('/reportes/metas').pipe(map(r => r.data));
  }

  updateMeta(tipo: string, monto: number, encargadoId: number): Observable<Meta> {
    return this.api.put<Meta>(`/reportes/metas/${tipo}`, { monto, encargadoId }).pipe(map(r => r.data));
  }
}
