import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsViewComponent } from './options-view.component';

describe('LabelsViewComponent', () => {
  let component: OptionsViewComponent;
  let fixture: ComponentFixture<OptionsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionsViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OptionsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
