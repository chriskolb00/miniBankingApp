import { Component } from '@angular/core';
import { MainLayoutComponent } from './layouts/main-layout/main-layout';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner';
import { ToastNotificationComponent } from './shared/components/toast-notification/toast-notification';

@Component({
  selector: 'app-root',
  imports: [MainLayoutComponent, LoadingSpinnerComponent, ToastNotificationComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {
  title = 'Mini Banking System';
}
