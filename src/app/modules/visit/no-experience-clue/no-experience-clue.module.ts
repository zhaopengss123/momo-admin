import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NoExperienceClueComponent } from './no-experience-clue.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: NoExperienceClueComponent
      }
    ]),
  ]
})
export class NoExperienceClueModule { }
