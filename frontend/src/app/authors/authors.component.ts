import { Component, OnInit } from '@angular/core';
import { QueryserviceService } from '../queryservice.service';
import { Subscription } from 'rxjs';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { Author } from '../author';
import { ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Options } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.scss']
})
export class AuthorsComponent implements OnInit {

  displayedColumns = ["name", "h_index", "n_pubs", "n_citations"];
  subscription = new Subscription();
  authors: Array<Author> = [];
  topicFilter = new FormControl();
  topicList: string[] = ['all'];
  @ViewChild('paginator') paginator: MatPaginator | any;
  dataSource: MatTableDataSource<Author>;

  start_year: number = 1975;
  end_year: number = 2022;
  topics: any = [];
  options: Options = {
    floor: 1975,
    ceil: 2022
  };

  constructor(private router: Router, private qs : QueryserviceService) { 
    this.dataSource = new MatTableDataSource(this.authors);
  }

  ngOnInit(): void {
    this.updateAuthorsInfo();
    this.updateTopicsInfo();
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
        this.dataSource.data = this.authors;
        this.dataSource.paginator = this.paginator;
      })
    );
  }

  updateTopicsInfo() : void {
    this.subscription.add(
      this.qs.getTopics().subscribe(res => {
        this.topicList = ['All'];
        res.forEach((element: any) => {
          this.topicList.push(element.name);
        });
        this.topics = this.topicList.slice(1);
      })
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
    this.dataSource = new MatTableDataSource(this.authors);
    this.dataSource.paginator = this.paginator;
  }

  openRow(row: any) {
    let route = '/author/' + row.id;
    this.router.navigate([route]);
  }

  chooseTopics(event: MatSelectChange) {
    this.topics = event.value;
    if (this.topics[0] == 'All' || this.topics.length == 0) {
      this.topics = this.topicList.slice(1);
    }
    this.handleUserChange();
  }

  capitalize(input: string) {  
    var words = input.split(' ');  
    var CapitalizedWords: Array<string> = [];  
    words.forEach((element: string) => {  
        CapitalizedWords.push(element[0].toUpperCase() + element.slice(1, element.length));  
    });  
    return CapitalizedWords.join(' ');  
  }

  handleUserChange(): void {
    this.qs.getAuthorsNewInfo(this.start_year, this.end_year, this.topics).subscribe((res: any) => {
      this.authors = [];
      res.forEach((row: any) => {
        this.authors.push({
          id: row['i']['id'],
          name: row['i']['name'],
          h_index: row['i']['h_index'],
          n_pubs: row['n_pubs'],
          n_citations: row['n_citations']
        });
      });
      this.dataSource.data = this.authors;
      this.dataSource.paginator = this.paginator;
    });
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}