import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AComponent, BComponent, CComponent } from './dummy.component';
import { GridstackModule, GridstackComponent } from 'gridstack/dist/angular';

@NgModule({
  imports: [
    BrowserModule,
    GridstackModule,
  ],
  declarations: [
    AppComponent,
    AComponent,
    BComponent,
    CComponent,
  ],
  exports: [
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    // register all our dynamic components created in the grid
    
  }
}
