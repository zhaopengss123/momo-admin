import { HttpService } from 'src/app/ng-relax/services/http.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.less']
})
export class TrackComponent implements OnInit {

  @Input() studentId: number;

  formGroup: FormGroup;

  constructor(
    private http: HttpService,
    private fb: FormBuilder = new FormBuilder(),
  ) { 
    this.formGroup = this.fb.group({
      
    })
  }

  ngOnInit() {
  }

}
