import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardArticleComponent } from './card-article.component';
import { provideHttpClient } from '@angular/common/http';

describe('CardArticleComponent', () => {
  let component: CardArticleComponent;
  let fixture: ComponentFixture<CardArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardArticleComponent],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(CardArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
