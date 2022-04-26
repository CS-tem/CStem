import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthorsComponent } from './authors/authors.component';
import { FormsModule } from '@angular/forms';
import { InstitutesComponent } from './institutes/institutes.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { VenueComponent } from './venue/venue.component';
import { ArticleComponent } from './article/article.component';
import { TopicComponent } from './topic/topic.component';
import { InstituteComponent } from './institute/institute.component';
import { ArticlesComponent } from './articles/articles.component';
import { TopicsComponent } from './topics/topics.component';
import { VenuesComponent } from './venues/venues.component';
import { AuthorComponent } from './author/author.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [
    AppComponent,
    AuthorsComponent,
    InstitutesComponent,
    VenueComponent,
    ArticleComponent,
    TopicComponent,
    InstituteComponent,
    ArticlesComponent,
    TopicsComponent,
    VenuesComponent,
    AuthorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatTableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
