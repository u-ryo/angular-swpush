import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlPushComponent } from './control-push.component';

describe('ControlPushComponent', () => {
  let component: ControlPushComponent;
  let fixture: ComponentFixture<ControlPushComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlPushComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlPushComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
