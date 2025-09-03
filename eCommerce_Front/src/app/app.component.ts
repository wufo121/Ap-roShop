import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { CoockiePopupComponent } from './coockie-popup/coockie-popup.component';

@Component({
  standalone: true,
  imports: [RouterOutlet, FooterComponent, CoockiePopupComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [],
})
export class AppComponent {
  title = 'eCommerce_Front';
}
