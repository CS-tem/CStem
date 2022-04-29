import { Component, OnInit } from '@angular/core';
import { QueryserviceService } from '../queryservice.service';
import { Subscription } from 'rxjs';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

interface Article {
  id: number,
  n_citations: number,
  title: string,
  vacr: string
  venue_id: number,
  year: number,
}

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit {
  displayedColumns = ["title", "vacr", "n_citations", "year"];
  subscription = new Subscription();
  articles: Array<Article> = [];
  @ViewChild('paginator') paginator: MatPaginator | any;
  dataSource: MatTableDataSource<Article>;

  constructor(private router: Router, private qs : QueryserviceService) {
    this.dataSource = new MatTableDataSource(this.articles);
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.updateArticlesInfo();
  }

  updateArticlesInfo() : void {
    this.subscription.add(
      this.qs.getArticles().subscribe(res => {
        this.articles = [];
        res.forEach((row: any) => {
          this.articles.push({
            id: row['id'],
            n_citations: row['n_citations'],
            title: row['title'],
            vacr: row['vacr'],
            venue_id: row['venue_id'],
            year: row['year'],
          });
        });
        console.log(res);
        this.dataSource.data = this.articles;
        this.dataSource.paginator = this.paginator;
      })
    );
  }

  sortData(sort: Sort) {
    const data = this.articles.slice();
    if (!sort.active || sort.direction === '') {
      this.articles = data;
      this.dataSource.data = this.articles;
      this.dataSource.paginator = this.paginator;
      return;
    }

    this.articles = data.sort((a: any, b: any) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id':
          return compare(a.id, b.id, isAsc);
        case 'vacr':
          return compare(a.vacr, b.vacr, isAsc);
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
    this.dataSource.data = this.articles;
    this.dataSource.paginator = this.paginator;
  }

  openRow(row: any) {
    let route = '/article/' + row.id;
    this.router.navigate([route]);
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}