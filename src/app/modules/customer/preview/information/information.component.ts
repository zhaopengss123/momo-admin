import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.less']
})
export class InformationComponent implements OnInit {

  @Input() memberInfo: any;

  constructor() { }

  ngOnInit() {
  }

}
