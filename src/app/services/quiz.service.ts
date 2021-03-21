import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  constructor(private http: HttpClient) {}

  getQuestions(count: number) {
    return this.http
      .get<any>(`https://opentdb.com/api.php?amount=${count}`)
      .pipe(map((res) => res.results));
  }
}
