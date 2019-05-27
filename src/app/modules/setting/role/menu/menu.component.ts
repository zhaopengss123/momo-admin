import { HttpService } from 'src/app/ng-relax/services/http.service';
import { MenuConfig } from '../../../../core/menu-config';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NzTreeNode, NzTreeComponent } from 'ng-zorro-antd';
import { CheckMenu } from '../checkMenu';
@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit{
    @ViewChild('NzTree') nzTree: NzTreeComponent;

    @Input() roleId: number;

    nodes: NzTreeNode[] = [];

    checkedNodes: string[] = ['/home'];

    menuIds: number[]=[];

    checkMenus:CheckMenu[]=[];

    roleInfoId: number;

    loading = true;

    host = window.location.host.split('.')[0];

    //http: HttpService;

    menuConfig: any[] = MenuConfig;
    ngOnInit() {
        this.menuConfig.map(res => {
          this.nodes.push(new NzTreeNode(res));
        });
        this.http.post('/settings/role/listMenuListByRoleId', { roleId: this.roleId }, false).then(res => {
          this.loading = false;
          if (res.code == 1000 && res.result) {
            if(res.data.menuUrl){
              this.checkedNodes = res.data.menuUrl.split(',');
            }
            this.roleInfoId = res.data.roleId;
          }
        })
        //根据role的menuId进行回显
        // this.http.post('/settings/role/listMenuListByRoleId', { roleId: this.roleId }, false).then(res => {
        //     this.loading = false;
        //     let beforePath:String;
        //     if (res.result == 1000) {
        //       if(res.data.menuList){
        //         res.data.menuList.forEach(path => {
        //           beforePath = beforePath+","+path.beforePathUrl;
        //         });
        //       }
        //       if(beforePath){
        //         this.checkedNodes = beforePath.split(",");
        //       }
        //        this.roleInfoId = res.data.roleId;
        //     }
        //   })
      }
    constructor(
        private http: HttpService
    ) {
        
    }
    checkBoxChange() {
        //进行node回显
        this.checkedNodes = [];
        this.nzTree.getCheckedNodeList().map(res => {
          if (res.children && res.children.length) {
            res.children.map(cdRes => {
              if (cdRes.children && cdRes.children.length) {
                cdRes.children.map(twoRes => {
                  this.checkedNodes.push(twoRes.key);
                })
              } else {
                this.checkedNodes.push(cdRes.key);
              }
            })
          } else {
            this.checkedNodes.push(res.key);
          }
        });
        //获取到根据beforePathUrl得到menuId
        // if(this.checkedNodes && this.checkedNodes.length){
        //   //进行双重for循环 获取菜单回显的menuId
        //   this.menuIds = [];
        //   let nodeLength = this.checkedNodes.length;
        //   let menuLength = this.checkMenus.length;
        //   for (let index = 0; index < nodeLength; index++) {
        //     const element1 = this.checkedNodes[index];
        //     for (let index = 0; index < menuLength; index++) {
        //       const element2 = this.checkMenus[index];
        //       if(element1 === element2.beforePath){
        //         this.menuIds.push(element2.id);
        //         break;
        //       }
        //     }
        //   }
        // }
            //得到最全的menuId
          // this.http.post('/settings/role/listMenuList', {}, false).then(res => {
          //   this.loading = false;
          //   if (res.result == 1000) {
          //     if(null != res.data){
          //       res.data.forEach(path => {
          //         let checkMenuTem :any = {};
          //         checkMenuTem.id = path.id;
          //         checkMenuTem.beforePath = path.beforePathUrl;
          //         this.checkMenus.push(checkMenuTem);
          //       });
          //     }
          //   }
          // })
      }       
}