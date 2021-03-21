import { Routes } from '@angular/router';

export const RootRoutes: Routes = [
  {
    path: 'users',
    loadChildren: () =>
      import('../pages/users/users.module').then((m) => m.UsersModule),
  },
  {
    path: 'quiz',
    loadChildren: () =>
      import('../pages/quiz/quiz.module').then((m) => m.QuizModule),
  },
  {
    path: 'trainer',
    loadChildren: () =>
      import('../pages/trainer/trainer.module').then((m) => m.TrainerModule),
  },
  {
    path: '',
    redirectTo: 'users',
  },
];
