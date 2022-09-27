import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimelineRoutingModule } from './timeline-routing.module';
import { SeriesComponent } from './series/series.component';

@NgModule({
  declarations: [SeriesComponent],
  imports: [CommonModule, TimelineRoutingModule],
  exports: [SeriesComponent],
})
export class TimelineModule {}
