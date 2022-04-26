import { Component, ViewChild, OnInit } from '@angular/core';
import { QueryserviceService } from '../queryservice.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Institute } from '../institute';
import { Sort } from '@angular/material/sort';

import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
};

@Component({
  selector: 'app-institute',
  templateUrl: './institute.component.html',
  styleUrls: ['./institute.component.scss']
})
export class InstituteComponent implements OnInit {
  subscription = new Subscription();
  institute: Institute = {
    id: 0,
    name: 'null',
    n_members: 0,
    n_pubs: 0,
    n_citations: 0
  };
  institute_id = 0;
  members = [{}];
  pubs = [{}];
  members_displayedColumns = ["id", "name", "h_index", "n_pubs", "n_citations"];

  constructor(private activatedRoute : ActivatedRoute, private qs : QueryserviceService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.institute_id = params['institute_id'];
      this.updateInstituteInfo();
      this.updateMembersInfo();
      this.updatePubsInfo();
    });
  }

  updateInstituteInfo(): void {
    this.subscription.add(
      this.qs.getInstitute(this.institute_id).subscribe(res => {
        this.institute = {
          id: res[0]['id'],
          name: res[0]['name'],
          n_members: res[0]['n_members'],
          n_pubs: res[0]['n_pubs'],
          n_citations: res[0]['n_citations']
        };
      })
    );
  }

  updateMembersInfo(): void {
    this.subscription.add(
      this.qs.getInstituteMembers(this.institute_id).subscribe(res => {
        this.members = res;
      })
    );
  }

  updatePubsInfo(): void {
    this.subscription.add(
      this.qs.getInstitutePubs(this.institute_id).subscribe(res => {
        this.pubs = res;
      })
    );
  }

  members_sortData(sort: Sort) {
    const data = this.members.slice();
    if (!sort.active || sort.direction === '') {
      this.members = data;
      return;
    }

    this.members = data.sort((a: any, b: any) => {
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

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
