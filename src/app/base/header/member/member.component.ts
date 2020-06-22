import { NzDrawerService } from 'ng-zorro-antd';
import { AppState } from 'src/app/core/reducers/reducers-config';
import { HttpService } from './../../../ng-relax/services/http.service';
import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Store } from '@ngrx/store';
import { PreviewComponent } from 'src/app/modules/public/customer-preview/preview/preview.component';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.less']
})
export class MemberComponent implements OnInit {

  @Input() searchText: string;
  
  $searchSubject: Subject<string> = new Subject();

  loading: boolean;

  dataSet: any[] = [];

  domain = environment.domainEs;

  constructor(
    private http: HttpService,
    private store: Store<AppState>,
    private drawer: NzDrawerService
  ) { }

  storeId;
  ngOnInit() {
    this.store.select('userInfoState').subscribe(userInfo => { this.storeId = userInfo.kindergartenId; this.getData(this.searchText);});
    this.$searchSubject.pipe(debounceTime(500), filter((txt: string) => !!txt.length)).subscribe(condition => this.getData(condition))
  }

  clickData(data) {
    this.drawer.create({
      nzTitle: null,
      nzWidth: 960,
      nzClosable: false,
      nzContent: PreviewComponent,
      nzContentParams: { id: data.id }
    })
  }

  getData(condition) {
    this.loading = true;
    this.http.post(`${this.domain}/czg/fullQuery`, {
      storeId: this.storeId,
      condition,
      pageNo: 1,
      pageSize: 20
    }).then(result => {
      this.loading = false;
      result.data && (this.dataSet = result.data.list)
    })
  }

}
