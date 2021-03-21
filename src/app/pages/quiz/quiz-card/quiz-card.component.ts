import { IQuestion } from './../../../models/quiz.model';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'quiz-card',
  templateUrl: './quiz-card.component.html',
  styleUrls: ['./quiz-card.component.css'],
})
export class QuizCardComponent implements OnInit {
  @Input() answers: Array<string> = null;
  @Output() answerSelected = new EventEmitter<string>();
  constructor() {}

  ngOnInit(): void {}
}
