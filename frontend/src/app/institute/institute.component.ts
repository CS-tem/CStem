import { Component, OnInit } from '@angular/core';
import { QueryserviceService } from '../queryservice.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Institute } from '../institute';
import { Sort } from '@angular/material/sort';
import { ChartOptions } from '../app.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ViewChild } from '@angular/core';

interface Member {
  citations: number
  h_index: number
  id: number
  n_citations: number
  n_pubs: number
  name: string
}

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
    n_citations: 0,
    country: 'null'
  };
  institute_id = 0;
  members: Array<Member> = [];
  pubs_x: string[] = [];
  pubs_y: string[] = [];
  citations_x: string[] = [];
  citations_y: string[] = [];
  @ViewChild('paginator') paginator: MatPaginator | any;
  dataSource: MatTableDataSource<Member>;

  members_displayedColumns = ["name", "h_index", "n_pubs", "n_citations"];

  public pubs_chartOptions: Partial<ChartOptions> | any;
  public citations_chartOptions: Partial<ChartOptions> | any;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private qs: QueryserviceService) {
    this.pubs_chartOptions = {
      series: [
        {
          name: "Publications",
          data: ['1', '2', '3', '4']
        }
      ],
      chart: {
        height: 350,
        type: "bar"
      },
      title: {
        text: "Yearwise publications"
      },
      xaxis: {
        categories: ['2016', '2017', '2018', '2019']
      },
      color: 'green'
    };
    this.citations_chartOptions = {
      series: [
        {
          name: "Citations",
          data: ['1', '2', '3', '4']
        }
      ],
      chart: {
        height: 350,
        type: "bar"
      },
      title: {
        text: "Yearwise citations"
      },
      xaxis: {
        categories: ['2016', '2017', '2018', '2019']
      }
    };
    this.dataSource = new MatTableDataSource(this.members);
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.institute_id = params['institute_id'];
      this.updateInstituteInfo();
      this.updateMembersInfo();
      this.updatePubsInfo();
      this.updateCitationsInfo();
    });
  }

  updateInstituteInfo(): void {
    this.subscription.add(
      this.qs.getInstitute(this.institute_id).subscribe(res => {
        if (res.length < 1) {
          this.router.navigateByUrl('/institutes');
        }
        this.institute = {
          id: res[0]['id'],
          name: res[0]['name'],
          n_members: res[0]['n_members'],
          n_pubs: res[0]['n_pubs'],
          n_citations: res[0]['n_citations'],
          country: res[0]['country']
        };
      })
    );
  }

  updateMembersInfo(): void {
    this.subscription.add(
      this.qs.getInstituteMembers(this.institute_id).subscribe(res => {
        this.members = [];
        res.forEach((row: any) => {
          this.members.push({
            citations: row['citations'],
            h_index: row['h_index'],
            id: row['id'],
            n_citations: row['n_citations'],
            n_pubs: row['n_pubs'],
            name: row['name']
          });
        });
        this.dataSource.data = this.members;
        this.dataSource.paginator = this.paginator;
      })
    );
  }

  updatePubsInfo(): void {
    this.subscription.add(
      this.qs.getInstitutePubs(this.institute_id).subscribe(res => {
        for (var ele of res) {
          this.pubs_x.push("" + ele.year);
          this.pubs_y.push("" + ele.n_pubs);
        }
        this.pubs_updateSeries();
      })
    );
  }

  updateCitationsInfo(): void {
    this.subscription.add(
      this.qs.getInstituteCitations(this.institute_id).subscribe(res => {
        for (var ele of res) {
          this.citations_x.push("" + ele.year);
          this.citations_y.push("" + ele.n_citations);
        }
        this.citations_updateSeries();
      })
    );
  }

  public pubs_updateSeries() {
    this.pubs_chartOptions.series = [{
      data: this.pubs_y
    }];
    this.pubs_chartOptions.xaxis = { categories: this.pubs_x };
  }

  public citations_updateSeries() {
    this.citations_chartOptions.series = [{
      data: this.citations_y,
    }];
    this.citations_chartOptions.xaxis = { categories: this.citations_x };
  }

  members_sortData(sort: Sort) {
    const data = this.members.slice();
    if (!sort.active || sort.direction === '') {
      this.members = data;
      this.dataSource.data = this.members;
      this.dataSource.paginator = this.paginator;
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
        // ] case 'country':
        //     return compare(a.n_country, b.country, isAsc);
        default:
          return 0;
      }
    });
    this.dataSource.data = this.members;
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
