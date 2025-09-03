import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardReviewComponent } from './card-review.component';
import { provideHttpClient } from '@angular/common/http';

describe('CardReviewComponent', () => {
  let component: CardReviewComponent;
  let fixture: ComponentFixture<CardReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardReviewComponent],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(CardReviewComponent);
    component = fixture.componentInstance;
    component.review = {
      username: 'Test User',
      comment: 'Great card!',
      rating: 4,
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
