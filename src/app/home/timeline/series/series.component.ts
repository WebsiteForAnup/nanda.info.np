import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.scss'],
})
export class SeriesComponent implements OnInit {
  @Input() events: Array<myEvent> = [];
  constructor() {}

  direction(index: number) {
    return index % 2 ? 'r' : 'l';
  }

  ngOnInit(): void {}
}

export interface myEvent {
  title: string;
  time: number;
  description: string;
  until?: number;
  display?: boolean;
  category: string;
}
