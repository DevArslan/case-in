import { QuizService } from './../../services/quiz.service';
import {
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IQuestion } from '../../models/quiz.model';
import { take, map } from 'rxjs/operators';

@Component({
  selector: 'quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
})
export class QuizComponent implements OnInit {
  @ViewChild('cards') cards: ElementRef;

  @Input() questions: Array<IQuestion> = [];

  currentCardNumber: number = 1;

  constructor(
    private _snackBar: MatSnackBar,
    private renderer: Renderer2,
    private quizService: QuizService,
  ) {}

  ngOnInit(): void {
    this.generateQuestions(50);
  }

  openSnackBar(text?: string) {
    this._snackBar.open(text, 'Оки!', {
      duration: 50000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: 'snackbar',
    });
  }

  generateQuestions(count: number) {
    this.quizService
      .getQuestions(count)
      .pipe(take(1))
      .subscribe((questions) => {
        this.questions = questions.map((q) => {
          const answers = [q.correct_answer, ...q.incorrect_answers];
          return {
            answers: this.getShuffledAnswers(answers),
            question: q.question,
            correctAnswer: q.correct_answer,
          };
        });
      });
  }

  getShuffledAnswers(answers) {
    return answers.sort(() => Math.random() - 0.5);
  }

  selectAnswer(answer: string, cardNumber) {
    if (this.questions[cardNumber].correctAnswer === answer) {
      this.openSnackBar('Это правильный ответ');
    } else {
      this.openSnackBar('Это неправильный ответ');
    }
  }

  slideQuiz(cardNumber: number) {
    this.currentCardNumber = cardNumber;
    if (this.questions.length - 1 === cardNumber) {
      this.openSnackBar('Вы закончили тест');
      return;
    }
    this.renderer.setStyle(
      this.cards.nativeElement,
      'margin-left',
      -this.cards.nativeElement.childNodes[cardNumber].offsetWidth *
        (cardNumber + 1) +
        'px',
    );
  }
}
