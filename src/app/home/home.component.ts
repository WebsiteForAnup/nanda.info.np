import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { QuoteService } from './quote.service';
import { EventsService } from './timeline/events.service';
import { myEvent } from './timeline/series/series.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  quote: string | undefined;
  isLoading = false;
  events: Array<myEvent> = [];
  eventCategories: string[] = [];
  eventCatalogue: {} = {};

  constructor(private quoteService: QuoteService, private eventService: EventsService) {}

  ngOnInit() {
    this.isLoading = true;
    // this.quoteService
    //   .getRandomQuote({ category: 'dev' })
    //   .pipe(
    //     finalize(() => {
    //       this.isLoading = false;
    //     })
    //   )
    //   .subscribe((quote: string) => {
    //     this.quote = quote;
    //   });

    this.eventService
      .getEvents()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((dearEvents: myEvent[]) => {
        this.events = dearEvents.sort((a: myEvent, b: myEvent) => b.time - a.time);
        this.eventCatalogue = this.events.reduce((groups, item: myEvent) => {
          const group = groups[item.category] || [];
          group.push(item);
          groups[item.category] = group;
          return groups;
        }, {});
        this.eventCategories = Object.keys(this.eventCatalogue);
      });
  }
}
