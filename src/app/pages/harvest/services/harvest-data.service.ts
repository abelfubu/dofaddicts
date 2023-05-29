import { HttpClient } from '@angular/common/http';
import { inject, Injectable, makeStateKey } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

import { TransferStateService } from '../../../chore/services/transfer-state.service';
import { UserHarvest } from '../harvest.store';
import {
  HarvestDataResponse,
  HarvestUser,
} from '../models/harvest-data.response';

const GET_HARVEST = makeStateKey<HarvestDataResponse>('GET_HARVEST');

@Injectable({
  providedIn: 'root',
})
export class HarvestDataService {
  private readonly URL = environment.apiUrl;
  private readonly http = inject(HttpClient);
  private readonly tss = inject(TransferStateService);

  get(id: string): Observable<HarvestDataResponse> {
    return this.tss.fetch(
      GET_HARVEST,
      this.http.get<HarvestDataResponse>(`${this.URL}/harvest/${id ?? ''}`),
      { harvest: [], harvestId: '', user: {} as HarvestUser }
    );
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
