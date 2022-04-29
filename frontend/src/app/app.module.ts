import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Components
import { AppComponent } from './app.component';
import { AuthorsComponent } from './authors/authors.component';
import { InstitutesComponent } from './institutes/institutes.component';
import { VenueComponent } from './venue/venue.component';
import { ArticleComponent } from './article/article.component';
import { TopicComponent } from './topic/topic.component';
import { InstituteComponent } from './institute/institute.component';
import { ArticlesComponent } from './articles/articles.component';
import { TopicsComponent } from './topics/topics.component';
import { VenuesComponent } from './venues/venues.component';
import { AuthorComponent } from './author/author.component';

// Charts and Graphs
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxEchartsModule } from 'ngx-echarts';

// Material Modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon'
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { HomeComponent } from './home/home.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';

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
    AuthorComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,

    MatToolbarModule,
    MatTableModule,
    MatPaginatorModule,
    MatListModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSortModule,
    MatSelectModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatIconModule,

    NgxSliderModule,

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
