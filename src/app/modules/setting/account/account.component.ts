import { DistributionComponent } from './distribution/distribution.component';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { ListPageComponent } from '../../../ng-relax/components/list-page/list-page.component';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl,FormControl} from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { QueryNode } from '../../../ng-relax/components/query/query.component';
import { TheadNode } from '../../../ng-relax/components/table/table.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.less']
})
export class AccountComponent implements OnInit {

  @ViewChild('EaListPage') EaListPage: ListPageComponent;

  queryNode: QueryNode[] = [
    {
      label: '登录名',
      type: 'input',
      key: 'account',
      placeholder: '请输入登录名'
    },
    {
      label: '中文名',
      type: 'input',
      key: 'name',
      placeholder: '请输入中文名'
    }
  ]

  tableThead: TheadNode[] | string[] = ['登录名', '中文名', '邮箱' ,'备注', '创建日期', '状态', '操作'];

  /* --------- 账户信息表单模型 --------- */
  createAccountForm: FormGroup;
  /* ------ 是否展示编辑用户信息窗口 ------ */
  showCreateAccount: boolean;
  /* ------- 编辑用户信息Loading ------- */
  createLoading: boolean;

  createAccountId: number;

  modifyLoading: boolean;

  showModifyPassword: boolean;

  accountId: number;

  constructor(
    private fb: FormBuilder = new FormBuilder(),
    private http: HttpService,
    private message: NzMessageService,
    private modal: NzModalService,
    private router: Router
  ) { }

  ngOnInit() {
    /* ----------------- 初始化账户信息表单模型 ----------------- */
    this.createAccountForm = this.fb.group({
      id: [],
      account: [, [Validators.required,this._codeValidator]],
      name: [, [Validators.required, Validators.pattern(/^[\u4e00-\u9fa5]+$/)]],
      password: [, [Validators.required]],
      email: [],
      enableStatus: [],
      remark: []
    })
  }

  /* ----------------- 点击新增账号按钮 ----------------- */
  openCreate() {
    this.createAccountId = null;
    this.showCreateAccount = true;
    this.createAccountForm.reset();
    this.createAccountForm.patchValue({ status: 0 });
  }
  /* ----------------- 点击编辑账号按钮 ----------------- */
  editAccount(data) {
    this.createAccountId = data.id;
    this.showCreateAccount = true;
    this.createAccountForm.reset();
    this.createAccountForm.patchValue(data);
  }
  /* ----------------- 点击删除账号按钮 ----------------- */
  deleteAccount(id,status) {
    this.http.post('/settings/account/updateUserAccount', { paramJson: JSON.stringify({ id,status }) }).then(res => {
      this.EaListPage.eaTable._request();
    })
  }
  /* ----------------- 点击重置密码按钮 ----------------- */
  resetPassword(id) {
    this.http.post('/settings/account/resetPassword', { paramJson: JSON.stringify({ id, password: '123456' }) }).then(res => {
      this.modifyLoading = false;
      this.message.create(res.result == 1000 ? 'success' : 'warning', res.result == 1000 ? '密码重置成功，密码为123456' : res.message);
    })
  }

  /* ----------------- 保存用户信息按钮 ----------------- */
  crateAccount() {
    if (this.createAccountForm.valid) {
      let params = this.createAccountForm.value;
      if (this.createAccountId) {
        params.id = this.createAccountId;
        delete params.password;
      }
      this.http.post('/settings/account/insertUserAccount', { paramJson: JSON.stringify(params) }).then(res => {
        this.EaListPage.eaTable._request();
        this.showCreateAccount = false;
        this.createLoading = false;
      })
    } else {
      for (let i in this.createAccountForm.controls) {
        this.createAccountForm.controls[i].markAsDirty();
        this.createAccountForm.controls[i].updateValueAndValidity();
      }
      let params = this.createAccountForm.value;
      this.http.post('/settings/account/updateUserAccount', { paramJson: JSON.stringify(params) }).then(res => {
        this.EaListPage.eaTable._request();
        this.showCreateAccount = false;
        this.createLoading = false;
      })
    }
  }


  /* ----------------- 点击分配角色按钮 ----------------- */
  allocationRole(id) {
    const modal = this.modal.create({
      nzTitle: '分配角色',
      nzContent: DistributionComponent,
      nzComponentParams: { id },
      nzFooter: [
        {
          label: '取消',
          onClick() { modal.close(); }
        },
        {
          label: '确定',
          type: 'primary',
          loading: false,
          onClick(component) {
            this.loading = true;
            component.submit().then(res => {
              this.loading = false;
              modal.close();
            }, err => {
              this.loading = false;
            })
          }
        }
      ]
    })
  }


  private _codeValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      return control.value && control.value.substr(control.value.length - 6, 6) === '_admin' ? { 'allowAdmin': true } : null;
    };
  }
}
