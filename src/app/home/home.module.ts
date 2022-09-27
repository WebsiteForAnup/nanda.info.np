import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@shared';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { TimelineModule } from './timeline/timeline.module';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProfileComponent } from './profile/profile.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    SharedModule,
    HomeRoutingModule,
    TimelineModule,
    MatTabsModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
  ],
  declarations: [HomeComponent, ProfileComponent],
})
export class HomeModule {}
