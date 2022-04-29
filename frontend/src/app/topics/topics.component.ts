import { Component, OnInit } from '@angular/core';
import { QueryserviceService } from '../queryservice.service';
import { Subscription } from 'rxjs';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss']
})
export class TopicsComponent implements OnInit {
  displayedColumns = ["name", "n_articles", "n_authors", "n_citations"];
  subscription = new Subscription();
  topics: any = [{}];

  constructor(private router: Router, private qs : QueryserviceService) { }

  ngOnInit(): void {
    this.updateTopicsInfo();
  }

  updateTopicsInfo() : void {
    this.subscription.add(
      this.qs.getTopics().subscribe(res => {
        this.topics = res;
        this.sortData({
          active: 'n_citations',
          direction: 'desc',
        });
      })
    );
  }

  sortData(sort: Sort) {
    const data = this.topics.slice();
    if (!sort.active || sort.direction === '') {
      this.topics = data;
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
  }

  openRow(row: any) {
    let route = '/topic/' + row.id;
    this.router.navigate([route]);
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
