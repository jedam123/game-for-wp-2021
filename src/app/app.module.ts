import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { HttpClientModule } from '@angular/common/http';
import { GameBoxComponent } from './game-box/game-box.component';
import { InfoBoxComponent } from './info-box/info-box.component';

@NgModule({
  declarations: [GameBoxComponent, InfoBoxComponent],
  imports: [BrowserModule, HttpClientModule],
  providers: [],
  entryComponents: [GameBoxComponent],
})
export class AppModule {
  constructor(private injector: Injector) {
    const el = createCustomElement(GameBoxComponent, { injector });
    customElements.define('game-box', el);
  }
  ngDoBootstrap() {}
}
