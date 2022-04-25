import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstituteComponent } from './institute/institute.component';
import { AuthorsComponent } from './authors/authors.component';
import { VenueComponent } from './venue/venue.component';
import { TopicComponent } from './topic/topic.component';
import { ArticleComponent } from './article/article.component';

const routes: Routes = [
  { path: 'institutes', component: InstituteComponent },
  { path: 'authors', component: AuthorsComponent },
  { path: 'venues/:venue_id', component: VenueComponent},
  { path: 'topics/:topic_id', component: TopicComponent},
  { path: 'articles/:article_id', component: ArticleComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
