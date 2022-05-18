import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DailySelectionComponent } from './daily-selection.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';



@NgModule({
  declarations: [DailySelectionComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [DailySelectionComponent]
})
export class DailySelectionModule { }
