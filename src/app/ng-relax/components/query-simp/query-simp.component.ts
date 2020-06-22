import { AppState } from './../../../core/reducers/reducers-config';
import { HttpService } from './../../services/http.service';
import { Component, OnInit, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { QueryNode } from '../query/query.component';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CacheService } from '../../services/cache.service';
import { Subject } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';

@Component({
  selector: 'ea-query-simp',
  templateUrl: './query-simp.component.html',
  styleUrls: ['./query-simp.component.less'],
  host: {
    '[class.ea-query-simp]': 'true',
  }
})
export class QuerySimpComponent implements OnInit {

  @Input() title: string = '';

  @Input() node: QueryNode[] = [];

  @Input() hideQueryBtn: boolean;

  @Output() onSubmit: EventEmitter<object> = new EventEmitter();

  _queryForm: FormGroup;
  _showSlideBtn: boolean;
  isCollapse: boolean = true;

  constructor(
    private http     : HttpClient,
    private datePipe : DatePipe,
    private cache    : CacheService,
    private httpservice: HttpService,
    private store: Store<AppState>
  ) {
  }

  storeId: number;
  ngOnInit() {
    this.store.select('userInfoState').subscribe(userInfo => this.storeId = userInfo.kindergartenId);
    this._queryForm = new FormGroup({});
    this.node.map((res: any, idx) => {
      if (res.isHide) { this._showSlideBtn = true; }
      if (res.type === 'between') {
        this._queryForm.addControl(res.valueKey[0], new FormControl(res.default ? res.default[0] : ''));
        this._queryForm.addControl(res.valueKey[1], new FormControl(res.default ? res.default[1] : ''));
      } else {
        this._queryForm.addControl(res.key, new FormControl(typeof res.default !== 'undefined' ? res.default : null));
      }
      if (res.type === 'select' || res.type === 'radio') {
        res.optionKey = res.optionKey || { label: 'name', value: 'id' };
        if (res.optionsUrl && res.noCache) {
          this.http.post<any>(res.optionsUrl, {}).subscribe(result => {
            res.options = (res.options || []).concat(result.result);
            res.optionsResult && res.optionsResult(res.options);
          })
        } else if (res.optionsUrl) {
          this.cache.get(res.optionsUrl).subscribe(result => {
            res.options = (res.options || []).concat(result);
            res.optionsResult && res.optionsResult(res.options);
          })
        }
      }

      if (res.type === 'search') {
        res.$subject = new Subject();
        res.$subject.pipe(debounceTime(500), filter((txt: string) => !!txt)).subscribe(condition => {
          this.httpservice.post(res.searchUrl, Object.assign({
            storeId: this.storeId,
            condition,
            pageNo: 1,
            pageSize: 10
          }, res.params || {})).then(result => {
            if (result.data) {
              result.data.list.map(d => d.text = d.name.replace(/<\/?[^>]*>/g, ''));
              res.options = result.data.list;
            }
          });
        })
      }
      return res;
    });
  }

  patchValue(key: string, value: object): void {
    this.node.map(res => {
      res.key === key && (res = Object.assign(res, value));
      return res;
    })
  }


  /* --------------- 清空 --------------- */
  _submit(): void {
    let queryForm = this._queryForm.value;
    this.node.map((res: any) => {
      if (res.type === 'datepicker') {
        if (queryForm[res.key] && typeof queryForm[res.key] === 'object') {
          queryForm[res.key] = queryForm[res.key] instanceof Date ? this.datePipe.transform(queryForm[res.key].getTime(), 'yyyy-MM-dd') : queryForm[res.key];
        }
      }
      if (res.type === 'monthpicker') {
        if (queryForm[res.key]) {
          queryForm[res.key] = this.datePipe.transform(queryForm[res.key], 'yyyy-MM');
        }
      }
      if (res.valueKey) {
        if (res.type === 'rangepicker') {
          if (queryForm[res.key] && queryForm[res.key][0]) {
            queryForm[res.valueKey[0]] = this.datePipe.transform(queryForm[res.key][0].getTime(), 'yyyy-MM-dd');
            queryForm[res.valueKey[1]] = this.datePipe.transform(queryForm[res.key][1].getTime(), 'yyyy-MM-dd');
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

}
