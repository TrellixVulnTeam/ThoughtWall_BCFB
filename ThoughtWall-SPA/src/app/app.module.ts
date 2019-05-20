import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { ThreadComponent } from './home-page/thread/thread.component';
import { SubmitPageComponent } from './submit-page/submit-page.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { ThreadPageComponent } from './thread-page/thread-page.component';
import { HttpApiService } from './services/http-api.service';

const appRoutes: Routes = [
  { path: '', component: HomePageComponent, pathMatch: 'full' },
  { path: 'submit', component: SubmitPageComponent },
  { path: 'thread/:id', component: ThreadPageComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    ThreadComponent,
    SubmitPageComponent,
    NavBarComponent,
    ThreadPageComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [HttpApiService],
  bootstrap: [AppComponent]
})



export class AppModule { }
