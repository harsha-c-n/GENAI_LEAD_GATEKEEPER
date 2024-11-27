import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VesselCardComponent } from './vessel-card.component';

describe('VesselCardComponent', () => {
  let component: VesselCardComponent;
  let fixture: ComponentFixture<VesselCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VesselCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VesselCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
