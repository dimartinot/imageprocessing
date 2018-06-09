import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeamcarvingComponent } from './seamcarving.component';

describe('SeamcarvingComponent', () => {
  let component: SeamcarvingComponent;
  let fixture: ComponentFixture<SeamcarvingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeamcarvingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeamcarvingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
