import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizComponent } from './quiz.component';
import { QuizRoutingModule } from './quiz-routing.module';
import { QuizCardComponent } from './quiz-card/quiz-card.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { QuizService } from 'src/app/services/quiz.service';

@NgModule({
  declarations: [QuizComponent, QuizCardComponent],
  imports: [
    CommonModule,
    QuizRoutingModule,
    MatRadioModule,
    MatButtonModule,
    MatProgressBarModule,
  ],
  providers: [QuizService],
})
export class QuizModule {}
