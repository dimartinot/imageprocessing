import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppComponent } from './app.component';
import { SeamcarvingComponent } from './seamcarving/seamcarving.component';
import { CreditsComponent } from './credits/credits.component';
import { RouterModule,Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

const appRoutes: Routes = [
  {path: 'seamcarving', component: SeamcarvingComponent},
  {path: 'credits', component: CreditsComponent},
  {path: '', component: HomeComponent}
]



@NgModule({
  declarations: [
    AppComponent,
    SeamcarvingComponent,
    CreditsComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    NgbModule.forRoot()
  ],
  providers: [
    NgbActiveModal
  ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class AppModule { }
