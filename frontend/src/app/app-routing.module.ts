import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstitutesComponent } from './institutes/institutes.component';
import { AuthorsComponent } from './authors/authors.component';
import { VenueComponent } from './venue/venue.component';
import { TopicComponent } from './topic/topic.component';
import { ArticleComponent } from './article/article.component';
import { InstituteComponent } from './institute/institute.component';
import { ArticlesComponent } from './articles/articles.component';
import { VenuesComponent } from './venues/venues.component';
import { TopicsComponent } from './topics/topics.component';
import { AuthorComponent } from './author/author.component';

const routes: Routes = [
  { path: 'institutes', component: InstitutesComponent },
  { path: 'institutes/:institute_id', component: InstituteComponent},
  { path: 'authors/:author_id', component: AuthorComponent },
  { path: 'authors', component: AuthorsComponent },
  { path: 'venues', component: VenuesComponent},
  { path: 'venues/:venue_id', component: VenueComponent},
  { path: 'topics', component: TopicsComponent},
  { path: 'topics/:topic_id', component: TopicComponent},
  { path: 'articles', component : ArticlesComponent},
  { path: 'articles/:article_id', component: ArticleComponent}
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
