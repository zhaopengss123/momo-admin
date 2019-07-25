import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {

  @Input() classInfo: any = {
    teacherInfos: [],
    mouthCareStuList: [],
    dayCareStuList: [],
    experienceStuList: []
  };

  @Input() selectIndex = 0;

  constructor(
  ) { 
  }

  ngOnInit() {
    console.log(this.classInfo)
  }

}
