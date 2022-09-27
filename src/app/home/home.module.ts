import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@shared';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { TimelineModule } from './timeline/timeline.module';

@NgModule({
  imports: [CommonModule, TranslateModule, SharedModule, HomeRoutingModule, TimelineModule],
  declarations: [HomeComponent],
})
export class HomeModule {}
