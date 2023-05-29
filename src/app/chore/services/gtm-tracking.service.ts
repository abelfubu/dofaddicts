import { isPlatformServer } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WINDOW } from '../tokens/window.token';
import { TrackingEvent } from '../tracking/tracking.event';

@Injectable({
  providedIn: 'root',
})
export class GtmTrackingService {
  private readonly window = inject(WINDOW);
  private readonly platformId = inject(PLATFORM_ID);

  private globalProperties = new BehaviorSubject<Record<string, unknown>>({});

  track(data: TrackingEvent): void {
    if (isPlatformServer(this.platformId) || !this.window.dataLayer) return;

    this.window.dataLayer.push(
      Object.assign(data, this.globalProperties.getValue())
    );
  }

  setGlobalProperties(data: Record<string, unknown>): void {
    this.globalProperties.next(
      Object.assign(this.globalProperties.getValue(), data)
    );
  }
}
