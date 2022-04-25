import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthorsComponent } from './authors/authors.component';
import { FormsModule } from '@angular/forms';
import { InstituteComponent } from './institute/institute.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { VenueComponent } from './venue/venue.component';
import { ArticleComponent } from './article/article.component';
import { TopicComponent } from './topic/topic.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthorsComponent,
    InstituteComponent,
    VenueComponent,
    ArticleComponent,
    TopicComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
