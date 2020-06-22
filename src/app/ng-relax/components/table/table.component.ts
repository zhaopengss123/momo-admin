import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { serialize } from 'src/app/core/http.intercept';

@Component({
  selector: 'ea-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.less']
})
export class TableComponent implements OnInit {

  @Input() thead: any[] = [];

  @Input() url: string;

  @Input() title: string | TemplateRef<any>;

  @Input() paramsDefault: any = {};

  @Input() paramsInit: any = {};

  @Input() checked: boolean;

  @Input() isParamJson: boolean = true;

  @Input() checkedItems: any[] = [];

  @Input() checkedKey: string = 'id';

  @Input() isRadio: boolean = false;

  @Input() allowSpace: boolean = true;

  @Input() showPage: boolean = true;

  @Input() nzShowSizeChanger: boolean = true;

  @Input() attribute: boolean = false;

  @Input() eaPageSize: number = 10;

  @Input() size: 'default' | 'small' | 'middle';

  @Input() timeout: number;

  @Output() checkedItemsChange: EventEmitter<any[]> = new EventEmitter();

  @Output() clickData: EventEmitter<any[]> = new EventEmitter();

  @Output() ready: EventEmitter<any> = new EventEmitter();


  private _readyComplate: boolean;

  @Output() dataChange: EventEmitter<any> = new EventEmitter();


  private _EaTableTbodyTr: TemplateRef<void>;
  @Input()
  set EaTableTbodyTr(value: TemplateRef<void>) {
    this._EaTableTbodyTr = value;
  }
  get EaTableTbodyTr(): TemplateRef<void> {
    return this._EaTableTbodyTr;
  }

  showExpand: boolean;
  private _EaTableTbodyExpand: TemplateRef<void>;
  @Input()
  set EaTableTbodyExpand(value: TemplateRef<void>) {
    this.showExpand = !!value;
    this._EaTableTbodyExpand = value;
  }
  get EaTableTbodyExpand(): TemplateRef<void> {
    return this._EaTableTbodyExpand;
  }

  @Input() dataSet: any[] = [];

  _pageInfo: PageInfo = new PageInfo();

  _params: object = {};


  /* ---------- 是否为全选及是否选择 ---------- */
  _allChecked: boolean;
  _indeterminate: boolean;

  constructor(
    private http: HttpClient,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    this._pageInfo.pageSize = this.eaPageSize;
    this._request();
  }

  _request(isReset?: boolean): void {
    const from: any = this._params;
    let attribute;
    if (this.attribute) {
      attribute = [from.activity, from.gift, from.near, from.multiplebirth, from.born, from.carer, from.babysitter, from.allworking, from.nannytime, ...from.problems,]
      attribute = attribute.filter(d => d);
    }
    if (this._pageInfo.loading || !this.url) { return; }
    this._pageInfo.loading = true;
    let paramJson = Object.assign(
      JSON.parse(JSON.stringify(this.paramsDefault)),
      this._params,
      this.paramsInit,
      { pageNo: isReset ? 1 : this._pageInfo.pageNo, pageSize: this._pageInfo.pageSize }
    )
    Object.keys(paramJson).map(key => { if (paramJson[key] === '' || paramJson[key] === null) { delete paramJson[key] } });
    let params;
    if (!this.attribute) {
      params = this.isParamJson ? { paramJson: JSON.stringify(paramJson), pageNo: isReset ? 1 : this._pageInfo.pageNo, pageSize: this._pageInfo.pageSize } : paramJson;
    } else {
      params = this.isParamJson ? { attribute: JSON.stringify(attribute), paramJson: JSON.stringify(paramJson), pageNo: isReset ? 1 : this._pageInfo.pageNo, pageSize: this._pageInfo.pageSize } : { paramJson, attribute };

    }
    this.paramsInit = {};

    this.timeout ? setTimeout(_ => this._getData(params), this.timeout) : this._getData(params);
  }
  request(params): void {
    this._params = params;
    this._request(true);
  }
  isJSON (str) {
    if (typeof (str) === 'string') {
      try {
        var obj = JSON.parse(str);
        if (typeof (obj) === 'object' && obj) {
          return true;
        }
        else {
          return false;
        }
      }
      catch (e) {
        return false;
      }
    }
  }
  private _getData(params) {
    this.http.post<any>(this.url, serialize(params), {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
    }).subscribe(res => {
      this._pageInfo.loading = false;
      console.log(res);
      if (res.returnCode == 'SUCCESS') {
        if (res.result) {
          let dataSet = res.result.list || res.result;
          dataSet.map(item => {
            item.isJSON = this.isJSON(item.lastFollowContent) || false;
            if(item.isJSON){
              item.lastFollowContent = JSON.parse(item.lastFollowContent);
            }
          })
          this.dataSet = dataSet;
          !res.result && (this.showPage = false);
          res.result && !res.result.list && res.result.pageNo && (this.showPage = false);
          this._pageInfo.pageNo = res.result.pageNo;
          this._pageInfo.totalPage = res.result.totalPage;

          /* ------------------- 如果存在选择列表则初始数据 ------------------- */
          if (this.checkedItems) {
            this.dataSet.map((res: any) => res.checked = this.checkedItems.indexOf(res[this.checkedKey]) > -1);
            this.isChecked();
          }
          if (!this._readyComplate) {
            this.ready.emit(this.dataSet);
            this._readyComplate = true;
          }
          console.log(this.dataSet);
          this.dataChange.emit(this.dataSet);

        }
      } else {
        this.message.warning(res.returnMsg || '操作失败');
      }
    }, err => {
      this._pageInfo.loading = false;
    });
  }


  /* --------------------- 点击全选 --------------------- */
  _checkAll(value: boolean): void {
    this.dataSet.map((res: any) => res.checked = value);
    this.isChecked();
  }

  /* --------------------- 点击选择 --------------------- */
  isChecked(e?: boolean /*? 是否选中 */, data?/*? 当前数据 */): void {
    if (this.isRadio && data) {
      this.checkedItems.map(_ => this.checkedItems.splice(0, 1));
      e && this.checkedItems.push(data[this.checkedKey]);
      this.checkedItemsChange.emit(this.dataSet.filter(data => data[this.checkedKey] === this.checkedItems[0]));
      this.dataSet.map(res => res.checked = res[this.checkedKey] != data[this.checkedKey] ? false : e);
    } else {
      let allChecked = this.dataSet.every((value: any) => value.checked === true);
      let allUnChecked = !allChecked;
      this._allChecked = allChecked;
      this._indeterminate = (!allChecked) && (!allUnChecked);
      this._resetCheckedItems(!!data);
    }
  }

  _resetCheckedItems(isDataChange?: boolean): void {
    this.dataSet.map((res: any) => {
      if (res.checked) {
        if (this.checkedItems.indexOf(res[this.checkedKey]) === -1) {
          this.checkedItems.push(res[this.checkedKey]);
        }
      } else {
        if (this.checkedItems.indexOf(res[this.checkedKey]) > -1) {
          this.checkedItems.splice(this.checkedItems.indexOf(res[this.checkedKey]), 1);
        }
      }
    })
    isDataChange && this.checkedItems[0] && this.checkedItemsChange.emit(this.checkedItems);
  }

}

/** 
 * @interface   初始化分页信息
 * @description 2018-02-28
 */
export class PageInfo {
  constructor(
    public loading: boolean = false,
    public totalPage: number = 0,
    public pageNo: number = 1,
    public pageSize: number = 10
  ) { }
}

export interface TheadNode {
  name: string;
  width?: string | number;
  left?: number;
  right?: number;
}