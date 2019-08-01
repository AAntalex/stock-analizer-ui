import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Observable} from 'rxjs';
import {startWith, map} from 'rxjs/operators';

export interface StateGroup {
  group: string;
  names: string[];
}

export const filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter(item => item.toLowerCase().indexOf(filterValue) >= 0);
};

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
})

export class AutocompleteComponent implements OnInit {
  @Input() value: string;
  @Input() stateGroups: StateGroup[] = [];
  @Output() onChange = new EventEmitter<any>();

  stateForm: FormGroup = this.formBuilder.group({
    stateGroup: '',
  });

  stateGroupOptions: Observable<StateGroup[]>;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.stateForm.get('stateGroup').setValue(this.value);
    this.stateGroupOptions = this.stateForm.get('stateGroup')!.valueChanges
      .pipe(
        startWith(''),
        map(value => this.filterGroup(value))
      );
  }

  private filterGroup(value: string): StateGroup[] {
    if (value) {
      return this.stateGroups
        .map(groups => ({group: groups.group, names: filter(groups.names, value)}))
        .filter(group => group.names.length > 0);
    }

    return this.stateGroups;
  }

  selectionChange(group, value) {
    this.onChange.emit({group, value});
  }

}
