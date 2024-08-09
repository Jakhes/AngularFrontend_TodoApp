import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelsViewComponent } from './labels-view.component';

describe('LabelsViewComponent', () => {
  let component: LabelsViewComponent;
  let fixture: ComponentFixture<LabelsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabelsViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabelsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
