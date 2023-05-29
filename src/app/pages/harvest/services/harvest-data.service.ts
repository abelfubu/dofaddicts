import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';

import { isPlatformBrowser } from '@angular/common';
import { UserHarvest } from '../harvest.store';
import {
  HarvestDataResponse,
  HarvestUser,
} from '../models/harvest-data.response';

@Injectable({
  providedIn: 'root',
})
export class HarvestDataService {
  private readonly URL = environment.apiUrl;
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  get(id: string): Observable<HarvestDataResponse> {
    if (isPlatformBrowser(this.platformId)) {
      return this.http.get<HarvestDataResponse>(
        `${this.URL}/harvest/${id ?? ''}`
      );
    }

    return of({ harvest: [], harvestId: '', user: {} as HarvestUser });
  }

  update(data: UserHarvest): Observable<void> {
    return this.http.post<void>(`${this.URL}/harvest`, data);
  }

  completeSteps(
    steps: Record<number, boolean>
  ): Observable<HarvestDataResponse> {
    return this.http.post<HarvestDataResponse>(`${this.URL}/harvest/complete`, {
      steps,
    });
  }
}
