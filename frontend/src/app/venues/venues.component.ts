import { Component, OnInit } from '@angular/core';
import { QueryserviceService } from '../queryservice.service';
import { Subscription } from 'rxjs';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { Venue } from '../venue';
import { ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-venues',
  templateUrl: './venues.component.html',
  styleUrls: ['./venues.component.scss']
})
export class VenuesComponent implements OnInit {
  displayedColumns = ["name", "acronym", "type", "n_pubs", "n_citations", "flexibility"];
  subscription = new Subscription();
  venues: Array<Venue> = [];
  allVenues: Array<Venue> = [];
  @ViewChild('paginator') paginator: MatPaginator | any;
  dataSource: MatTableDataSource<Venue>;

  topicFilter = new FormControl();
  topicList: string[] = ['all'];
  topics: Array<string> = [];
  typeFilter = new FormControl();
  typeList: string[] = ['all'];
  types: Array<string> = [];

  constructor(private router: Router, private qs: QueryserviceService) { 
    this.dataSource = new MatTableDataSource(this.venues);
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.updateVenuesInfo();
    this.updateTopicsInfo();
  }

  updateVenuesInfo() : void {
    this.subscription.add(
      this.qs.getVenues().subscribe(res => {
        this.venues = [];
        this.typeList = ['All'];
        var types = new Set();
        res.forEach((row: any) => {
          this.venues.push({
            id: row['id'],
            name : row['name'],
            flexibility: row['flexibility'],
            acronym : row['acronym'],
            n_pubs: row['n_pubs'],
            n_citations: row['n_citations'],
            type : row['type']
          });
          if (!types.has(row['type'])) {
            types.add(row['type']);
            this.typeList.push(row['type']);
          }
        });
        this.types = this.typeList;
        this.allVenues = this.venues;
        // No need to update datasource here; done in sortData below
        this.sortData({
          active: 'n_citations',
          direction: 'desc'
        });
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
        this.topics = this.topicList;
      })
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  chooseTopics(event: MatSelectChange) {
    this.topics = event.value;
    if (this.topics[0] == 'All' || this.topics.length == 0) {
      this.topics = this.topicList.slice(1);
    }
    this.handleUserChange();
  }

  chooseTypes(event: MatSelectChange) {
    this.types = event.value;
    if (this.types[0] == 'All' || this.types.length == 0) {
      this.types = this.typeList.slice(1);
    }
    this.handleUserChange();
  }

  handleUserChange() {
    this.qs.getVenuesByCondition(this.topics, this.types).subscribe((res: any) => {
      this.venues = [];
      res.forEach((row: any) => {
        this.venues.push({
          id: row['id'],
          name : row['name'],
          flexibility: row['flexibility'],
          acronym : row['acronym'],
          n_pubs: row['n_pubs'],
          n_citations: row['n_citations'],
          type : row['type']
        });
      });
      this.sortData({
        active: 'n_citations',
        direction: 'desc'
      });
    });
  }

  sortData(sort: Sort) {
    const data = this.venues.slice();
    if (!sort.active || sort.direction === '') {
      this.venues = data;
      this.dataSource.data = this.venues;
      this.dataSource.paginator = this.paginator;
      return;
    }

    this.venues = data.sort((a: any, b: any) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id':
          return compare(a.id, b.id, isAsc);
        case 'name':
          return compare(a.name, b.name, isAsc);
        case 'flexibility':
          return compare(a.flexibility, b.flexibility, isAsc);
        case 'acronym':
          return compare(a.acronym, b.acronym, isAsc);
        case 'n_pubs':
          return compare(a.n_pubs, b.n_pubs, isAsc);
        case 'n_citations':
          return compare(a.n_citations, b.n_citations, isAsc);
        case 'type':
          return compare(a.type, b.type, isAsc);
        default:
          return 0;
      }
    });
    this.dataSource.data = this.venues;
    this.dataSource.paginator = this.paginator;
  }

  capitalize(input: string) {  
    var words = input.split(' ');  
    var CapitalizedWords: Array<string> = [];  
    words.forEach((element: string) => {  
        CapitalizedWords.push(element[0].toUpperCase() + element.slice(1, element.length));  
    });  
    return CapitalizedWords.join(' ');  
  }

  openRow(row: any) {
    let route = '/venue/' + row.id;
    this.router.navigate([route]);
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
