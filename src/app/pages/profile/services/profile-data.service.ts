import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@environments/environment';
import { ProfileDataResponse } from '@pages/profile/models/profile-data-response.model';
import { User } from '@shared/models/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileDataService {
  private readonly URL = environment.apiUrl;
  private readonly http = inject(HttpClient);

  get(): Observable<ProfileDataResponse> {
    return this.http.get<ProfileDataResponse>(`${this.URL}/profile`);
  }

  put(profile: Partial<User>): Observable<void> {
    return this.http.put<void>(`${this.URL}/profile`, profile);
  }
}
