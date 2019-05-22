import { HttpService } from '../../../../ng-relax/services/http.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-distribution',
  templateUrl: './distribution.component.html',
  styleUrls: ['./distribution.component.scss']
})
export class DistributionComponent implements OnInit {

  /* ---------- 账户Id ---------- */
  @Input() id;

  /* ---------- 所有角色 ---------- */
  dataSet: any[] = [];

  submit(): Promise<boolean> {
    let checkedItems = [];
    this.dataSet.map(res => res.checked && checkedItems.push(res.roleId));
    return new Promise((resolve, reject) => {
      this.http.post('/settings/account/insertAccountRole', {
          accountId: this.id,
          roleIds: checkedItems
      }).then(res => {
        resolve(true);
      }, err => {
        reject(false);
      })
    })
  }

  constructor(
    private http: HttpService
  ) { }

  ngOnInit() {
    let id = this.id;
    /* ------------------ 获取当前门店所有角色 ------------------ */
    this.http.post('/settings/account/listRole', {id}, false).then(res => {
      
      this.dataSet = res.data.resultList;
      /* ----------- 判断当前用户是否拥有该角色 ----------- */
      if(res.data.roleIds){
        let checkedItems = res.data.roleIds.split(',');
        this.dataSet.map(res => res.checked = checkedItems.indexOf(res.roleId + '') > -1);
      }
     
    })
  }

}
