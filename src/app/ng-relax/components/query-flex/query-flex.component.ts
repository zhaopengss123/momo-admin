import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { QueryNode } from '../query/query.component';
import { CacheService } from '../../services/cache.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'ea-query-flex',
  templateUrl: './query-flex.component.html',
  styleUrls: ['./query-flex.component.less']
})
export class QueryFlexComponent implements OnInit {

  formGroup: FormGroup = new FormGroup({});

  @Input() node: QueryNode[] = [];

  @Output() onSubmit: EventEmitter<object> = new EventEmitter();

  constructor(
    private http: HttpClient,
    private fb: FormBuilder = new FormBuilder(),
    private format: DatePipe,
    private cache: CacheService
  ) { }

  showSlideBtn: boolean;
  isCollapse: boolean = true;

  ngOnInit() {
    this.node.map((res: any, idx) => {
      if (res.isHide) { this.showSlideBtn = true; }
      if (res.type === 'between') {
        this.formGroup.addControl(res.key, this.fb.array([
          this.fb.control(null),
          this.fb.control(null)
        ]))
      } else {
        this.formGroup.addControl(res.key, this.fb.control(typeof res.default !== 'undefined' ? res.default : null));
      }
      if (res.type === 'select' || res.type === 'radio' || res.type === 'tag') {
        res.optionKey = res.optionKey || { label: 'name', value: 'id' };
        if (res.optionsUrl) {
          this.cache.get(res.optionsUrl).subscribe(result => {
            res.options = (res.options || []).concat(result);
            res.optionsResult && res.optionsResult(res.options);
          })
        }
        res.options.map(option => option.isHide && (res.hasOptionsHideBtn = true) );
      }
      return res;
    });
  }

  submit() {
    let queryForm = this.formGroup.value;
    this.node.map((res: any) => {
      if (res.type === 'datepicker') {
        if (queryForm[res.key]) {
          queryForm[res.key] = this.format.transform(queryForm[res.key].getTime(), 'yyyy-MM-dd');
        }
      }
      if (res.type === 'monthpicker') {
        if (queryForm[res.key]) {
          queryForm[res.key] = this.format.transform(queryForm[res.key], 'yyyy-MM');
        }
      }
      if (res.valueKey) {
        if (res.type === 'rangepicker') {
          if (queryForm[res.key] && queryForm[res.key][0]) {
            queryForm[res.valueKey[0]] = this.format.transform(queryForm[res.key][0].getTime(), 'yyyy-MM-dd');
            queryForm[res.valueKey[1]] = this.format.transform(queryForm[res.key][1].getTime(), 'yyyy-MM-dd');
          }
          delete queryForm[res.key];
        }
        if (res.type === 'between') {
          if (!queryForm[res.valueKey[0]]) delete queryForm[res.valueKey[0]];
          if (!queryForm[res.valueKey[1]]) delete queryForm[res.valueKey[1]];
        }
      }
      if (queryForm[res.key] === '' || queryForm[res.key] === null || queryForm[res.key] === undefined) {
        delete queryForm[res.key];
      }
    });
    this.onSubmit.emit(queryForm);
  }

  _tagValueChange(e, control, value) {
    let resetParams = {};
    let resetValue = control.isRadio ? null : this.formGroup.controls[control.key].value ? this.formGroup.controls[control.key].value : [];
    if (control.isRadio || value === null) {
      resetValue = e ? value : null;
      resetParams[control.key] = resetValue;
      this.formGroup.patchValue(resetParams);
    } else {
      e ? resetValue.push(value) : resetValue.splice(resetValue.indexOf(value), 1);
      resetValue = Array.from(new Set([...resetValue]));
      resetParams[control.key] = resetValue.length ? resetValue : null;
      this.formGroup.patchValue(resetParams);
    }
  }

}
