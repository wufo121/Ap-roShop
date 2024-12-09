import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterOutlet],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [],
})
export class AppComponent {
  title = 'eCommerce_Front';
}
