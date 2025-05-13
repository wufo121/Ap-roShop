import { Component, Input } from '@angular/core';
import { AppService } from '../app.service';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-card-review',
  standalone: true,
  imports: [CommonModule],
  providers: [DatePipe],
  templateUrl: './card-review.component.html',
  styleUrl: './card-review.component.scss',
})
export class CardReviewComponent {
  @Input() review: any;

  stars: number[] = [];

  constructor(private appService: AppService) {}

  ngOnInit() {
    this.stars = new Array(5);
  }
}
