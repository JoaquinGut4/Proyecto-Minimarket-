import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { entorno } from '../../../entornos/entorno';
import { ApiResponse } from '../../compartido/modelos';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = entorno.apiUrl;

  constructor(private http: HttpClient) {}

  get<T>(path: string): Observable<ApiResponse<T>> {
    return this.http.get<ApiResponse<T>>(`${this.baseUrl}${path}`);
  }

  post<T>(path: string, body: any): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(`${this.baseUrl}${path}`, body);
  }

  put<T>(path: string, body: any): Observable<ApiResponse<T>> {
    return this.http.put<ApiResponse<T>>(`${this.baseUrl}${path}`, body);
  }

  patch<T>(path: string, body: any): Observable<ApiResponse<T>> {
    return this.http.patch<ApiResponse<T>>(`${this.baseUrl}${path}`, body);
  }

  delete<T>(path: string): Observable<ApiResponse<T>> {
    return this.http.delete<ApiResponse<T>>(`${this.baseUrl}${path}`);
  }
}
