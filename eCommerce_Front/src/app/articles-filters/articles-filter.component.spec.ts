import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlesFilterComponent } from './articles-filter.component';
import { provideHttpClient } from '@angular/common/http';

describe('CategoriesFilterComponent', () => {
  let component: ArticlesFilterComponent;
  let fixture: ComponentFixture<ArticlesFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticlesFilterComponent],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticlesFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
