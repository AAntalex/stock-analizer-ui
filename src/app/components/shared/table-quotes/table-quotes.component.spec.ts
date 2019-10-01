import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableQuotesComponent } from './table-quotes.component';

describe('TableQuotesComponent', () => {
  let component: TableQuotesComponent;
  let fixture: ComponentFixture<TableQuotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableQuotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableQuotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
