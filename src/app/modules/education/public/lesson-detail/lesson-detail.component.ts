import { Component, OnInit,  Input  } from '@angular/core';

@Component({
  selector: 'app-lesson-detail',
  templateUrl: './lesson-detail.component.html',
  styleUrls: ['./lesson-detail.component.less']
})
export class LessonDetailComponent implements OnInit {
  @Input() content: string;
  constructor() { }

  ngOnInit() {
    var test =
    document.getElementsByTagName('video')[0];
    test.style.width = "100%";
  }

}
