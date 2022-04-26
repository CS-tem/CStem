import { Component, OnInit } from '@angular/core';
import { QueryserviceService } from '../queryservice.service';
import { Subscription } from 'rxjs';
import { Sort } from '@angular/material/sort';

export interface Institute {
  id: number,
  name: string,
  // country: string,
  n_members: number,
  n_pubs: number,
  n_citations: number
}

@Component({
  selector: 'app-institutes',
  templateUrl: './institutes.component.html',
  styleUrls: ['./institutes.component.scss'],
})
export class InstitutesComponent implements OnInit {
  displayedColumns = ["id", "name", "n_members", "n_pubs", "n_citations"];
  subscription = new Subscription();
  institutes: any = [{}];

  constructor(private qs : QueryserviceService) { }

  ngOnInit(): void {
    this.updateInstitutesInfo();
  }

  updateInstitutesInfo() : void {
    this.subscription.add(
      this.qs.getInstitutes().subscribe(res => {
        this.institutes = res;
        console.log(res);
      })
    );
  }

  sortData(sort: Sort) {
    const data = this.institutes.slice();
    if (!sort.active || sort.direction === '') {
      this.institutes = data;
      return;
    }

    this.institutes = data.sort((a: any, b: any) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id':
          return compare(a.id, b.id, isAsc);
        case 'name':
          return compare(a.name, b.name, isAsc);
        case 'n_members':
          return compare(a.n_members, b.n_members, isAsc);
        case 'n_pubs':
          return compare(a.n_pubs, b.n_pubs, isAsc);
        case 'n_citations':
          return compare(a.n_citations, b.n_citations, isAsc);
        default:
          return 0;
      }
    });
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
