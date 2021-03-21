import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.css'],
})
export class RootComponent implements OnInit {
  @Output() sidenavToggled: EventEmitter<void> = new EventEmitter<void>();
  panelOpenState = false;

  constructor() {}

  ngOnInit(): void {}
}
