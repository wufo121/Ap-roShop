import { Component, Input } from '@angular/core';
import { AppService } from '../app.service';
import { NgClass, NgFor, DatePipe } from '@angular/common';

@Component({
  selector: 'app-card-review',
  standalone: true,
  imports: [NgClass, NgFor, DatePipe],
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
