import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GoogleAuthDirective } from './shared/google-auth.directive';
import { FooterComponent } from './shared/ui/footer/footer.component';
import { ScrollUpComponent } from './shared/ui/scroll-up/scroll-up.component';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [GoogleAuthDirective, RouterOutlet, FooterComponent, ScrollUpComponent],
  template: `
    <app-google-auth></app-google-auth>
    <router-outlet></router-outlet>
    <app-footer></app-footer>
    <app-scroll-up />
  `,
})
export class AppComponent {}
