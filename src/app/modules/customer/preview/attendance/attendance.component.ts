import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.less']
})
export class AttendanceComponent implements OnInit {

  @Input() studentId: number;

  constructor() { }

  ngOnInit() {
  }

}
