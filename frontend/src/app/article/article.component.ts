import { Component, OnInit } from '@angular/core';
import { QueryserviceService } from '../queryservice.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {
  article_id = 0;
  subscription = new Subscription();
  article = {}

  constructor(private activatedRoute: ActivatedRoute, private qs : QueryserviceService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.article_id = params['article_id'];
      this.updateArticleInfo();
    });
  }

  updateArticleInfo() : void {
    this.subscription.add(
      this.qs.getArticle(this.article_id).subscribe(res => {
        this.article = res;
        console.log(res);
      })
    );
  }

}
