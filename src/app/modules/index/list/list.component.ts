import { NzDrawerService } from 'ng-zorro-antd';
import { Component, OnInit, Input } from '@angular/core';
import { DrawerCreate } from 'src/app/ng-relax/decorators/drawer/create.decorator';
import { PreviewComponent } from '../../public/customer-preview/preview/preview.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less']
})
export class ListComponent implements OnInit {

  @Input() url: string;

  constructor(
    private drawer: NzDrawerService
  ) { }

  ngOnInit() {
  }
  @DrawerCreate({ content: PreviewComponent, width: 960, closable: false }) preview: ({ id: number }) => void;

}
