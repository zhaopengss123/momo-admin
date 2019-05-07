import { AppState } from 'src/app/core/reducers/reducers-config';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.less']
})
export class BaseComponent implements OnInit {
  
  $userInfo;

  $routerState;

  constructor(
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.$userInfo  = this.store.select('userInfoState');
    this.$routerState = this.store.select('routerState');
  }

}
