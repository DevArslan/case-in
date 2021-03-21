import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainerComponent } from './trainer.component';
import { TrainerRoutingModule } from './trainer-routing.module';
import { MatListModule } from '@angular/material/list';

@NgModule({
  declarations: [TrainerComponent],
  imports: [CommonModule, TrainerRoutingModule, MatListModule],
})
export class TrainerModule {}
