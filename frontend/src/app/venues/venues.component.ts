import { Component, OnInit } from '@angular/core';
import { QueryserviceService } from '../queryservice.service';
import { Subscription } from 'rxjs';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { Venue } from '../venue';
import { ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-venues',
  templateUrl: './venues.component.html',
  styleUrls: ['./venues.component.scss']
})
export class VenuesComponent implements OnInit {
  displayedColumns = ["name", "acronym", "type", "n_pubs", "n_citations", "flexibility"];
  subscription = new Subscription();
  venues: Array<Venue> = [];
  @ViewChild('paginator') paginator: MatPaginator | any;
  dataSource: MatTableDataSource<Venue>;

  constructor(private router: Router, private qs: QueryserviceService) { 
    this.dataSource = new MatTableDataSource(this.venues);
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.updateVenuesInfo();
  }

  updateVenuesInfo() : void {
    this.subscription.add(
      this.qs.getVenues().subscribe(res => {
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
        // No need to update datasource here; done in sortData below
        this.sortData({
          active: 'n_citations',
          direction: 'desc'
        });
      })
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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

  openRow(row: any) {
    let route = '/venue/' + row.id;
    this.router.navigate([route]);
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
