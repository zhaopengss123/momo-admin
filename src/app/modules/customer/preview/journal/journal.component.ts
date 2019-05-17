import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.less']
})
export class JournalComponent implements OnInit {

  @Input() studentId: number;

  constructor() { }

  ngOnInit() {
  }

}
