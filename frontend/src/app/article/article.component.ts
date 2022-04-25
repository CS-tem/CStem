import { Component, OnInit } from '@angular/core';
import { QueryserviceService } from '../queryservice.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {

  subscription = new Subscription();
  articles: any = [{}];

  constructor(private qs : QueryserviceService) { }

  ngOnInit(): void {
  }

  updateArticlesInfo() : void {
    this.subscription.add(
      this.qs.getVenues().subscribe(res => {
        this.articles = res;
        console.log(res);
      })
    );
  }

}
