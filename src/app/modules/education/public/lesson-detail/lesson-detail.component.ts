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
    this.content = decodeURIComponent(this.content);

  }

}
