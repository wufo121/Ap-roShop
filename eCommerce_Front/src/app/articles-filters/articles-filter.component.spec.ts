import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesFilterComponent } from './articles-filter.component';

describe('CategoriesFilterComponent', () => {
  let component: CategoriesFilterComponent;
  let fixture: ComponentFixture<CategoriesFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriesFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
