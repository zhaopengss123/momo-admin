import { ListPageSimpComponent } from './../../../../ng-relax/components/list-page-simp/list-page.component';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-quit',
  templateUrl: './quit.component.html',
  styleUrls: ['./quit.component.scss']
})
export class QuitComponent implements OnInit {

  @ViewChild('listPage') listPage: ListPageSimpComponent;

  constructor() { }

  ngOnInit() {
  }

}
