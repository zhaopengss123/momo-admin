import { MemberComponent } from './member/member.component';
import { AppReuseStrategy } from 'src/app/core/app-reuse-strategy';
import { Component, OnInit, Input } from '@angular/core';
import { UserInfoState } from 'src/app/core/reducers/userInfo-reducer';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { NzDrawerService } from 'ng-zorro-antd';

@Component({
  selector: 'app-head',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeadComponent implements OnInit {

  @Input() userInfo: UserInfoState;

  menuList: Array<{ title: string, path: string }> = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private drawer: NzDrawerService
  ) {
    this.router.events.pipe(
      filter(event => { return event instanceof NavigationEnd }),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) route = route.firstChild;
        return route;
      },
      filter((route: any) => route.outlet === 'primary'))
    ).subscribe((event) => {
      let pathArray = [];
      event.pathFromRoot.map(res => {
        res.url['value'][0] && pathArray.push(res.url['value'][0]);
      });
      var isExist = this.menuList.every(item => item.title != event.data['value'].title);
      if (isExist) {
        this.menuList.push({ title: event.data['value'].title, path: pathArray.join('/') });
        this.routeActiveIndex = this.menuList.length - 1;
      } else {
        this.menuList.map((res, idx) => res.title == event.data['value'].title && (this.routeActiveIndex = idx));
      }
    });
  }


  ngOnInit() {

  }

  routeActiveIndex: number;
  closeTab(e) {
    AppReuseStrategy.deleteRouteSnapshot(this.menuList[e].path.slice(1));
    this.menuList.splice(e, 1);
    if (e === this.routeActiveIndex) {
      this.routeActiveIndex = this.menuList.length - 1;
      this.router.navigateByUrl(this.menuList[this.menuList.length - 1].path);
    } else {
      this.routeActiveIndex = this.routeActiveIndex > e ? this.routeActiveIndex - 1 : this.routeActiveIndex;
    }
  }
  tabSelect(e) {
    this.router.navigateByUrl(this.menuList[e].path);
  }

  signOut(): void {
    window.localStorage.removeItem('userInfo');
    this.router.navigateByUrl('/login');
  }


  childrenVisible: boolean;
  search(searchText) {
    this.drawer.create({
      nzTitle: '快捷操作',
      nzWidth: 720,
      nzContent: MemberComponent,
      nzContentParams: { searchText }
    })

  }


}
