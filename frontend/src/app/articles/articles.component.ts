import { Component, OnInit } from '@angular/core';
import { QueryserviceService } from '../queryservice.service';
import { Subscription } from 'rxjs';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Options } from '@angular-slider/ngx-slider';

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
  allArticles: Array<Article> = [];
  @ViewChild('paginator') paginator: MatPaginator | any;
  dataSource: MatTableDataSource<Article>;
  venueFilter = new FormControl();
  venueList: string[] = ['all'];
  venues: Array<string> = [];

  start_year: number = 1975;
  end_year: number = 2022;
  options: Options = {
    floor: 1975,
    ceil: 2022
  };

  constructor(private router: Router, private qs: QueryserviceService) {
    this.dataSource = new MatTableDataSource(this.articles);
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.updateArticlesInfo();
    this.updateVenuesInfo();
  }

  updateArticlesInfo(): void {
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
        this.dataSource.data = this.articles;
        this.dataSource.paginator = this.paginator;
        this.allArticles = this.articles;
      })
    );
  }

  updateVenuesInfo(): void {
    this.subscription.add(
      this.qs.getVenues().subscribe(res => {
        this.venueList = ['All'];
        res.forEach((element: any) => {
          this.venueList.push(element.acronym);
        });
        this.venues = this.venueList;
      })
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  chooseVenues(event: MatSelectChange) {
    this.venues = event.value;
    if (this.venues[0] == 'All' || this.venues.length == 0) {
      this.venues = this.venueList.slice(1);
    }
    this.handleUserChange();
  }

  handleUserChange() {
    this.articles = [];
    this.allArticles.forEach((res: any) => {
      if (this.venues.includes(res.vacr) && res.year >= this.start_year &&
        res.year <= this.end_year) {
        this.articles.push({
          id: res.id,
          n_citations: res.n_citations,
          title: res.title,
          vacr: res.vacr,
          venue_id: res.venue_id,
          year: res.year,
        });
      }
    });
    this.dataSource.data = this.articles;
    this.dataSource.paginator = this.paginator;
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

  capitalize(input: string) {
    var words = input.split(' ');
    var CapitalizedWords: Array<string> = [];
    words.forEach((element: string) => {
      CapitalizedWords.push(element[0].toUpperCase() + element.slice(1, element.length));
    });
    return CapitalizedWords.join(' ');
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
