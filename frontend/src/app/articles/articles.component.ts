import { Component, OnInit } from '@angular/core';
import { QueryserviceService } from '../queryservice.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit {
  subscription = new Subscription();
  articles: any = [{}];

  constructor(private qs : QueryserviceService) { }

  ngOnInit(): void {
    this.updateArticlesInfo();
  }

  updateArticlesInfo() : void {
    this.subscription.add(
      this.qs.getArticles().subscribe(res => {
        console.log(res);
        this.articles = res;
      })
    );
  }

}
