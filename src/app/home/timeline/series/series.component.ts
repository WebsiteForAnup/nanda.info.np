import { Component, OnInit } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

class Account {
  constructor(readonly name: string, readonly balance: number) {}

  toString(): string {
    return `${this.name} (${this.balance})`;
  }
}

@Component({
  selector: 'app-series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.scss'],
})
export class SeriesComponent implements OnInit {
  readonly accounts = [new Account(`Rubles`, 500), new Account(`Dollar`, 237), new Account(`Euro`, 100)];

  svgIcons = {
    rubles: import(`assets/rubles.svg`),
  };

  testForm = new FormGroup({
    name: new FormControl(``),
    accounts: new FormControl(this.accounts[0]),
  });

  constructor() {}

  ngOnInit(): void {}
}
