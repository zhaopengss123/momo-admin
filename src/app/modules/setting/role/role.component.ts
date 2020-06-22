import { HttpService } from 'src/app/ng-relax/services/http.service';
import { MenuComponent } from './menu/menu.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ListPageComponent } from '../../../ng-relax/components/list-page/list-page.component';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Component, OnInit, ViewChild } from '@angular/core';
import { QueryNode } from 'src/app/ng-relax/components/query/query.component';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.less']
})
export class RoleComponent implements OnInit {

  @ViewChild('EaListPage') EaListPage: ListPageComponent;

  queryNode: QueryNode[] = [
    {
      label: '角色名称',
      type: 'input',
      key: 'name'
    }
  ]
  roleListType: any[] = [];
  constructor(
    private http: HttpService,
    private modal: NzModalService,
    private message: NzMessageService,
    private fb: FormBuilder = new FormBuilder()
  ) { }

  ngOnInit() {
    this.createRoleForm = this.fb.group({
      roleId: [],
      roleName: [, [Validators.required]],
      roleCode: [, [Validators.required]],
      enable: [0],
      remark: []
    }),
    this.http.get('/settings/role/listRoleType', { }).then(res => {
      if(res.returnCode == "SUCCESS"){
        if(res.data && res.data.length){
          this.roleListType = res.data;
        } 
      }else{
        //操作失败
      }
    })
  }

  editRole(data) {
    this.showCreateRole = true;
    this.createRoleForm.patchValue(data);
  }

  deleteRole(roleId,status) {
    this.http.post('/settings/role/updateRoleMessage', { paramJson: JSON.stringify({ roleId,status }) }).then(res => {
      this.EaListPage.eaTable._request();
    })
  }

  /* -------------- 新增角色 -------------- */
  createRoleForm: FormGroup
  showCreateRole: boolean = false;
  createLoading: boolean = false;
  openCreate() {
    this.showCreateRole = true;
    this.createRoleForm.reset();
    this.createRoleForm.patchValue({ enable: 0 });
  }

  crateRole() {
    if (this.createRoleForm.valid) {
      this.createLoading = true;
      this.http.post('/settings/role/updateRoleMessage', { paramJson: JSON.stringify(this.createRoleForm.value) }).then(res => {
        this.EaListPage.eaTable._request();
        this.showCreateRole = false;
        this.createLoading = false;
      })
    } else {
      for (let i in this.createRoleForm.controls) {
        this.createRoleForm.controls[i].markAsDirty();
        this.createRoleForm.controls[i].updateValueAndValidity();
      }
    }
  }

  allocationMenu(roleId) {
    let { message, http } = this;
    const modal = this.modal.create({
      nzTitle: '分配菜单',
      nzContent: MenuComponent,
      nzComponentParams: {
        roleId,
      },
      nzBodyStyle: {
        'max-height': '600px',
        'overflow': 'auto'
      },
      nzFooter: [
        {
          label: '取消',
          onClick: () => {
            modal.close();
          }
        },
        {
          label: '确定',
          type: 'primary',
          loading: false,
          onClick(componentInstance) {
            if (componentInstance.loading) {
              message.warning('请等待数据加载完毕...');
            } else {
              this.loading = true;
              http.post('/settings/role/updateRoleMenu', {
                roleId: componentInstance.roleId,
                menuUrls: componentInstance.checkedNodes.join(',')
              }).then(res => {
                modal.close();
              }, err => {
                this.loading = false;
              })
            }
          }
        }
      ]
    });
  }
}
