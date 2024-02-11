import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { ExchangeResponse } from '../models/exchange.response';

@Injectable({
  providedIn: 'root',
})
export class ExchangeDataService {
  private readonly URL = environment.apiUrl;
  private readonly http = inject(HttpClient);

  get(server: string): Observable<ExchangeResponse> {
    return this.http.get<ExchangeResponse>(`${this.URL}/exchange/${server}`);
  }
}
