import { Component, OnInit } from '@angular/core';
import { QueryserviceService } from '../queryservice.service';
import { Subscription } from 'rxjs';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { Author } from '../author';
import { ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.scss']
})
export class AuthorsComponent implements OnInit {

  displayedColumns = ["name", "h_index", "n_pubs", "n_citations"];
  subscription = new Subscription();
  authors: Array<Author> = [];
  @ViewChild('paginator') paginator: MatPaginator | any;
  dataSource: MatTableDataSource<Author>;

  constructor(private router: Router, private qs : QueryserviceService) { 
    this.dataSource = new MatTableDataSource(this.authors);
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.updateAuthorsInfo();
  }

  updateAuthorsInfo() : void {
    this.subscription.add(
      this.qs.getAuthors().subscribe(res => {
        this.authors = [];
        res.forEach((row: any) => {
          this.authors.push({
            id: row['id'],
            name: row['name'],
            h_index: row['h_index'],
            n_pubs: row['n_pubs'],
            n_citations: row['n_citations']
          });
        });
        console.log(res);
        this.dataSource.data = this.authors;
        this.dataSource.paginator = this.paginator;
      })
    );
  }

  sortData(sort: Sort) {
    const data = this.authors.slice();
    if (!sort.active || sort.direction === '') {
      this.authors = data;
      this.dataSource.data = this.authors;
      this.dataSource.paginator = this.paginator;
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
    this.dataSource.data = this.authors;
    this.dataSource.paginator = this.paginator;
  }

  openRow(row: any) {
    let route = '/author/' + row.id;
    this.router.navigate([route]);
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}