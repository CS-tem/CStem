import { Component, OnInit } from '@angular/core';
import { QueryserviceService } from '../queryservice.service';
import { Subscription } from 'rxjs';
import { Sort } from '@angular/material/sort';

export interface Venue {
  id: number,
  name : string,
  flexibility: string,
  acronym : string,
  n_pubs: number,
  n_citations: number
  type : string

}


@Component({
  selector: 'app-venues',
  templateUrl: './venues.component.html',
  styleUrls: ['./venues.component.scss']
})
export class VenuesComponent implements OnInit {
  displayedColumns = ["id", "name", "flexibility", "acronym", "n_pubs", "n_citations", "type"];
  subscription = new Subscription();
  venues: any = [{}];

  constructor(private qs: QueryserviceService) { }

  ngOnInit(): void {
    this.updateVenuesInfo();
  }

  updateVenuesInfo() : void {
    this.subscription.add(
      this.qs.getVenues().subscribe(res => {
        this.venues = res;
        this.sortData({
          active: 'n_citations',
          direction: 'desc'
        });
      })
    );
  }

  sortData(sort: Sort) {
    const data = this.venues.slice();
    if (!sort.active || sort.direction === '') {
      this.venues = data;
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
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
