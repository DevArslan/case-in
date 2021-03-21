import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainerComponent } from './trainer.component';
import { TrainerRoutingModule } from './trainer-routing.module';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  declarations: [TrainerComponent],
  imports: [
    CommonModule,
    TrainerRoutingModule,
    MatListModule,
    MatSlideToggleModule,
  ],
})
export class TrainerModule {}
