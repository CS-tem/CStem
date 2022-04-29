import { Component, OnInit } from '@angular/core';
import { QueryserviceService } from '../queryservice.service';
import { Subscription } from 'rxjs';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { Topic } from '../topic';
import { ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss']
})
export class TopicsComponent implements OnInit {
  displayedColumns = ["name", "n_articles", "n_authors", "n_citations"];
  subscription = new Subscription();
  topics: Array<Topic> = [];
  @ViewChild('paginator') paginator: MatPaginator | any;
  dataSource: MatTableDataSource<Topic>;

  constructor(private router: Router, private qs : QueryserviceService) { 
    this.dataSource = new MatTableDataSource(this.topics);
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.updateTopicsInfo();
  }

  updateTopicsInfo() : void {
    this.subscription.add(
      this.qs.getTopics().subscribe(res => {
        this.topics = [];
        res.forEach((row: any) => {
          this.topics.push({
            id: row['id'],
            name: row['name'],
            n_pubs: row['n_pubs'],
            n_authors: row['n_authors'],
            n_articles: row['n_articles'],
            n_citations: row['n_citations']
          });
        });
        // No need to update datasource here; done in sortData below
        this.sortData({
          active: 'n_citations',
          direction: 'desc',
        });
      })
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  sortData(sort: Sort) {
    const data = this.topics.slice();
    if (!sort.active || sort.direction === '') {
      this.topics = data;
      this.dataSource.data = this.topics;
      this.dataSource.paginator = this.paginator;
      return;
    }

    this.topics = data.sort((a: any, b: any) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id':
          return compare(a.id, b.id, isAsc);
        case 'name':
          return compare(a.name, b.name, isAsc);
        case 'n_articles':
          return compare(a.n_articles, b.n_articles, isAsc);
        case 'n_authors':
          return compare(a.n_authors, b.n_authors, isAsc);
        case 'n_citations':
          return compare(a.n_citations, b.n_citations, isAsc);
        default:
          return 0;
      }
    });
    this.dataSource.data = this.topics;
    this.dataSource.paginator = this.paginator;
  }

  openRow(row: any) {
    let route = '/topic/' + row.id;
    this.router.navigate([route]);
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
