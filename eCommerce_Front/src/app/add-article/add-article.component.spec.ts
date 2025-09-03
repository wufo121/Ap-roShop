import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddArticleComponent } from './add-article.component';
import { provideHttpClient } from '@angular/common/http';

describe('AddArticleComponent', () => {
  let component: AddArticleComponent;
  let fixture: ComponentFixture<AddArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddArticleComponent],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(AddArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
