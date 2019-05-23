import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisitComponent } from './visit.component';
import { RouterModule } from '@angular/router';
import { NoExperienceClueComponent } from './no-experience-clue/no-experience-clue.component';

@NgModule({
  declarations: [VisitComponent, NoExperienceClueComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: VisitComponent
      }
    ]),
  ]
})
export class VisitModule { }
