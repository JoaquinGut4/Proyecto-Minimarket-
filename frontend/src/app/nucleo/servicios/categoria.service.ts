import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Categoria } from '../../compartido/modelos';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  constructor(private api: ApiService) {}

  getAll(): Observable<Categoria[]> {
    return this.api.get<Categoria[]>('/categorias').pipe(map(r => r.data));
  }
}
