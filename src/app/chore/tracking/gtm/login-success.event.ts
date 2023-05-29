import { TrackingEvent } from '../tracking.event';

export class LoginSuccessEvent implements TrackingEvent {
  event = 'login_success';
}
