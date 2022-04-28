import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { QueryserviceService } from '../queryservice.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DataSet } from 'vis-data';
import { Network } from 'vis-network';

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
  ApexTooltip,
  ApexTitleSubtitle
} from "ng-apexcharts";
import { Author } from '../author';
import { Sort } from '@angular/material/sort';

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
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.scss']
})
export class AuthorComponent implements OnInit {
  author_id = 0;
  author : Author = {
    id: 0,
    name: 'null',
    h_index: 0,
    n_pubs: 0,
    n_citations: 0
  };
  articles = [{}];
  pubs_x : string[]= [];
  pubs_y : string[]= [];
  citations_x : string[]= [];
  citations_y : string[]= [];
  pie_x : string[]= [];
  pie_y : string[]= [];

  displayedColumns = ["id", "title", "year", "n_citations"];

  @ViewChild('coauthors', { static: false }) coauthors!: ElementRef;
  private networkInstance: any;

  public pubs_chartOptions: Partial<ChartOptions> | any;
  public citations_chartOptions: Partial<ChartOptions> | any;

  subscription = new Subscription();

  public pie_chartOptions: Partial<ChartOptions> | any;

  constructor(private activatedRoute : ActivatedRoute, private qs : QueryserviceService) { 
    this.pubs_chartOptions = {
      series: [
        {
          name: "Publications",
          data: ['0']
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
        categories: ['0']
      }
    };
    this.citations_chartOptions = {
      series: [
        {
          name: "Citations",
          data: ['1','2','3','4']
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
        categories: ['2016','2017','2018','2019']
      }
    }; 
    this.pie_chartOptions = {
      series: [
        {
          name: "n_pubs",
          data: [1,2,3]
        }
      ],
      chart: {
        width: 600,
        type: "pie"
      },
      labels: ["Topic1", "Topic 2", "Topic 3"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 600
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }
  
    
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.author_id = params['author_id'];
      this.updateAuthorInfo();
      this.updateAuthorArticlesInfo();
      this.updatePubsInfo();
      this.updateCitationsInfo();
      this.updatePubsperTopicInfo();
    });
  }

  updateAuthorInfo(): void {
    this.subscription.add(
      this.qs.getAuthor(this.author_id).subscribe(res => {
        this.author = {
          id: res[0].i['id'],
          name: res[0].i['name'],
          h_index: res[0].i['h_index'],
          n_pubs: res[0].i['n_pubs'],
          n_citations: res[0].i['n_citations']
        };
        // console.log(this.author, res);
      })
    );
  }

  updateAuthorArticlesInfo(): void {
    this.subscription.add(
      this.qs.getAuthorTop5Pubs(this.author_id).subscribe(res => {
        this.articles = res;
        // console.log(res);
      })
    );
  }

  articles_sortData(sort: Sort) {
    const data = this.articles.slice();
    if (!sort.active || sort.direction === '') {
      this.articles = data;
      return;
    }

    this.articles = data.sort((a: any, b: any) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id':
          return compare(a.id, b.id, isAsc);
        case 'title':
          return compare(a.title, b.title, isAsc);
        case 'year':
          return compare(a.year, b.year, isAsc);
        case 'n_citations':
          return compare(a.n_citations, b.n_citations, isAsc);
        default:
          return 0;
      }
    });
  }

  updatePubsInfo(): void {
    this.subscription.add(
      this.qs.getAuthorPubs(this.author_id).subscribe(res => {
        for(var ele of res){
          this.pubs_x.push(""+ele.year);
          this.pubs_y.push(ele.n_pubs);
        }  
        this.pubs_updateSeries(); 
      })
    );
  }

  updateCitationsInfo(): void {
    this.subscription.add(
      this.qs.getAuthorCitations(this.author_id).subscribe(res => {
        for(var ele of res){
          this.citations_x.push(""+ele.year);
          this.citations_y.push(ele.n_citations);
        }  
        this.citations_updateSeries(); 
      })
    );
  }

  updatePubsperTopicInfo(): void {
    this.subscription.add(
      this.qs.getAuthorPubsPerTopic(this.author_id).subscribe(res => {
        for(var ele of res){
          this.pie_x.push(ele.topic);
          this.pie_y.push(ele.n_pubs);
        }  
        this.pie_updateSeries();

        console.log(res);
      })
    );
  }

  public pubs_updateSeries() {
    this.pubs_chartOptions.series = [{
      data: this.pubs_y
    }];
    this.pubs_chartOptions.xaxis = {categories : this.pubs_x};
  }

  public citations_updateSeries() {
    this.citations_chartOptions.series = [{
      data: this.citations_y,
    }];
    this.citations_chartOptions.xaxis = {categories : this.citations_x};
  }

  public pie_updateSeries() {
    this.pie_chartOptions.series = this.pie_y;
    this.pie_chartOptions.labels = this.pie_x;
  }
  
  ngAfterViewInit(): void {
    // create an array with nodes
    const nodes = new DataSet<any>([
      { id: 1, label: 'Node 1' },
      { id: 2, label: 'Node 2' },
      { id: 3, label: 'Node 3' },
      { id: 4, label: 'Node 4' },
      { id: 5, label: 'Node 5' },
    ]);
 
    // create an array with edges
    const edges = new DataSet<any>([
      { from: '1', to: '3' },
      { from: '1', to: '2' },
      { from: '2', to: '4' },
      { from: '2', to: '5' },
    ]);
 
    const data = { nodes, edges };
 
    const container = this.coauthors;
    this.networkInstance = new Network(container.nativeElement, data, {});
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
