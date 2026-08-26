import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Encargado } from '../../compartido/modelos';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private api: ApiService) {}

  getAll(): Observable<Encargado[]> {
    return this.api.get<Encargado[]>('/encargados').pipe(map(r => r.data));
  }

  create(data: any): Observable<Encargado> {
    return this.api.post<Encargado>('/encargados', data).pipe(map(r => r.data));
  }

  toggleActivo(id: number, activo: boolean): Observable<void> {
    return this.api.patch<void>(`/encargados/${id}`, { activo }).pipe(map(() => undefined));
  }
}
