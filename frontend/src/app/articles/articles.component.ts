import { Component, OnInit } from '@angular/core';
import { QueryserviceService } from '../queryservice.service';
import { Subscription } from 'rxjs';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';

export interface Article {
  id: number,
  n_citations: string,
  title: string,
  venue_id: number,
  year: number
}

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit {
  displayedColumns = ["id", "n_citations", "title", "venue_id", "year"];
  
  subscription = new Subscription();
  articles: any = [{}];

  constructor(private router: Router, private qs : QueryserviceService) { }

  ngOnInit(): void {
    this.updateArticlesInfo();
  }

  updateArticlesInfo() : void {
    this.subscription.add(
      this.qs.getArticles().subscribe(res => {
        console.log(res);
        console.log(res)
        this.articles = res;
      })
    );
  }

  sortData(sort: Sort) {
    const data = this.articles.slice();
    if (!sort.active || sort.direction === '') {
      this.articles = data;
      return;
    }

    this.articles = data.sort((a: any, b: any) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id':
          return compare(a.id, b.id, isAsc);
        case 'venue_id':
          return compare(a.venue_id, b.venue_id, isAsc);
        case 'year':
          return compare(a.year, b.year, isAsc);
        case 'title':
          return compare(a.title, b.title, isAsc);
        case 'n_citations':
          return compare(a.n_citations, b.n_citations, isAsc);
        default:
          return 0;
      }
    });
  }

  openRow(row: any) {
    let route = '/article/' + row.id;
    this.router.navigate([route]);
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}