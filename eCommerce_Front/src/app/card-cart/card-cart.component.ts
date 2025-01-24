import { Component, Input } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-card-cart',
  standalone: true,
  imports: [],
  templateUrl: './card-cart.component.html',
  styleUrl: './card-cart.component.scss',
})
export class CardCartComponent {
  @Input() name: string = '';
  @Input() quantity: number = 0;
  @Input() image: string = '';
  @Input() price: number = 0;
  @Input() productId: string = '';

  constructor(private appService: AppService) {}

  deleteFromCart(event: MouseEvent): void {
    event.stopPropagation();
    this.appService.deleteAndRemoveFromCart(this.productId);
  }
}
