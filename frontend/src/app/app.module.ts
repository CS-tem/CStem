import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthorsComponent } from './authors/authors.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxEchartsModule } from 'ngx-echarts';

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
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatSortModule,
    MatSelectModule,
    MatCardModule,
    NgApexchartsModule,
    NgxEchartsModule.forRoot({
      /**
       * This will import all modules from echarts.
       * If you only need custom modules,
       * please refer to [Custom Build] section.
       */
      echarts: () => import('echarts'), // or import('./path-to-my-custom-echarts')
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
