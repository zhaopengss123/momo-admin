import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CanActivate, Router, CanLoad, Route, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../core/reducers/reducers-config';

@Injectable()
export class AuthGuardService implements CanActivate, CanLoad {
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    return new Observable(observer => {
      this.store.select('userInfoState').subscribe(res => {
        let stateUrl = state.url.indexOf('/(') > -1 ? state.url.split('/(')[0]
          : state.url.indexOf('?') > -1 ? state.url.split('?')[0]
            : state.url;
        let userInfo = res || JSON.parse(window.localStorage.getItem('userInfo'));
        userInfo.menuUrlList = userInfo.menuUrls.split(',');
        if (userInfo.menuUrlList.indexOf('**') > -1) {
          observer.next(true);
          observer.complete();
        } else if (userInfo.menuUrlList.indexOf(stateUrl) === -1) {
          this.router.navigateByUrl('/system/error/403');
        }
        observer.next(userInfo.menuUrlList.indexOf(stateUrl) > -1);
        observer.complete();
      })
    })
  }

  canLoad(route: Route): Observable<boolean> | boolean {
    return new Observable(observer => {
      this.store.select('userInfoState').subscribe(res => {
        let userInfo = res || JSON.parse(window.localStorage.getItem('userInfo'));
        if (userInfo.menuUrls.indexOf('**') > -1) {
          observer.next(true);
          observer.complete();
        } else if (userInfo.menuUrls.indexOf(`/${route.path}`) === -1) {
          this.router.navigateByUrl('/system/error/403');
        }
        observer.next(userInfo.menuUrls.indexOf(`/${route.path}`) > -1);
        observer.complete();
      })
    })
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    return this.canActivate(route, state);
  }

  constructor(
    private router: Router,
    private store: Store<AppState>
  ) { }
}