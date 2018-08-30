import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgOidcClientComponent } from './ng-oidc-client.component';

describe('NgOidcClientComponent', () => {
  let component: NgOidcClientComponent;
  let fixture: ComponentFixture<NgOidcClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgOidcClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgOidcClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
