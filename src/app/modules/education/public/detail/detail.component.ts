import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.less']
})
export class DetailComponent implements OnInit {
  @Input() info;
  constructor() {

  }

  ngOnInit() {
  }
  downloadppt() {
    let lesson = this.info.lesson;
    if(lesson){ window.open(lesson) };
  }
  openvideo() {
    let vedio = this.info.vedio;
    if(vedio){ window.open(vedio) };
  }
}
