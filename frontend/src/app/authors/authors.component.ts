import { Component, OnInit } from '@angular/core';
import { QueryserviceService } from '../queryservice.service';
import { Subscription } from 'rxjs';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';

export interface Author {
  id: number,
  name: string,
  // country: string,
  h_index: number,
  n_pubs: number,
  n_citations: number
}

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.scss']
})
export class AuthorsComponent implements OnInit {

  displayedColumns = ["name", "h_index", "n_pubs", "n_citations"];
  subscription = new Subscription();
  authors: any = [{}];

  constructor(private router: Router, private qs : QueryserviceService) { }

  ngOnInit(): void {
    this.updateAuthorsInfo();
  }

  updateAuthorsInfo() : void {
    this.subscription.add(
      this.qs.getAuthors().subscribe(res => {
        this.authors = res;
        console.log(res);
      })
    );
  }

  sortData(sort: Sort) {
    const data = this.authors.slice();
    if (!sort.active || sort.direction === '') {
      this.authors = data;
      return;
    }

    this.authors = data.sort((a: any, b: any) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id':
          return compare(a.id, b.id, isAsc);
        case 'name':
          return compare(a.name, b.name, isAsc);
        case 'h_index':
          return compare(a.h_index, b.h_index, isAsc);
        case 'n_pubs':
          return compare(a.n_pubs, b.n_pubs, isAsc);
        case 'n_citations':
          return compare(a.n_citations, b.n_citations, isAsc);
        default:
          return 0;
      }
    });
  }

  openRow(row: any) {
    let route = '/author/' + row.id;
    this.router.navigate([route]);
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}