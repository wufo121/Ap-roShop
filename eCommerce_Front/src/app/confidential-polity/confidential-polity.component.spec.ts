import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfidentialPolityComponent } from './confidential-polity.component';

describe('ConfidentialPolityComponent', () => {
  let component: ConfidentialPolityComponent;
  let fixture: ComponentFixture<ConfidentialPolityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfidentialPolityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfidentialPolityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
