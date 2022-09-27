import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimelineRoutingModule } from './timeline-routing.module';
import { SeriesComponent } from './series/series.component';

import { TuiRootModule } from '@taiga-ui/core';

@NgModule({
  declarations: [SeriesComponent],
  imports: [CommonModule, TimelineRoutingModule, TuiRootModule],
  exports: [SeriesComponent],
})
export class TimelineModule {}
