import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { QueryserviceService } from '../queryservice.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { DataSet } from 'vis-data';
import { Network } from 'vis-network';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

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

interface Article {
  citations: number,
  id: string,
  n_citations: number,
  title: string,
  venue_id: number,
  year: number
}

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
  author: Author = {
    id: 0,
    name: 'null',
    h_index: 0,
    n_pubs: 0,
    n_citations: 0
  };
  articles: Array<Article> = [];
  inst_name: string = "";
  pubs_x: string[] = [];
  pubs_y: string[] = [];
  citations_x: string[] = [];
  citations_y: string[] = [];
  pie_x: string[] = [];
  pie_y: string[] = [];

  nodes_list: any;
  edges_list: any;

  @ViewChild('paginator') paginator: MatPaginator | any;
  dataSource: MatTableDataSource<Article>;

  displayedColumns = ["title", "year", "n_citations"];

  @ViewChild('coauthors', { static: false }) coauthors!: ElementRef;
  private networkInstance: any;

  public pubs_chartOptions: Partial<ChartOptions> | any;
  public citations_chartOptions: Partial<ChartOptions> | any;

  subscription = new Subscription();

  public pie_chartOptions: Partial<ChartOptions> | any;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private qs: QueryserviceService) {
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
    this.pie_chartOptions = {
      series: [
        {
          name: "n_pubs",
          data: [1, 2, 3]
        }
      ],
      chart: {
        width: 600,
        type: "pie"
      },
      title: {
        text: "Topicwise Publications"
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
    this.dataSource = new MatTableDataSource(this.articles);
    this.dataSource.paginator = this.paginator;
  }


  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.author_id = params['author_id'];
      this.updateAuthorInfo();
      this.updateAuthorArticlesInfo();
      this.updatePubsInfo();
      this.updateCitationsInfo();
      this.updatePubsperTopicInfo();
      this.coauthorGraph();
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
          n_citations: res[0]['n_citations']
        };
        this.inst_name = res[0].i_name;
      })
    );
  }

  updateAuthorArticlesInfo(): void {
    this.subscription.add(
      this.qs.getAuthorTop5Pubs(this.author_id).subscribe(res => {
        this.articles = [];
        res.forEach((row: any) => {
          this.articles.push({
            citations: row['citations'],
            id: row['id'],
            n_citations: row['n_citations'],
            title: row['title'],
            venue_id: row['venue_id'],
            year: row['year']
          });
        });
        this.dataSource.data = this.articles;
        this.dataSource.paginator = this.paginator;
      })
    );
  }

  articles_sortData(sort: Sort) {
    const data = this.articles.slice();
    if (!sort.active || sort.direction === '') {
      this.articles = data;
      this.dataSource.data = this.articles;
      this.dataSource.paginator = this.paginator;
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
    this.dataSource.data = this.articles;
    this.dataSource.paginator = this.paginator;
  }

  updatePubsInfo(): void {
    this.subscription.add(
      this.qs.getAuthorPubs(this.author_id).subscribe(res => {
        for (var ele of res) {
          this.pubs_x.push("" + ele.year);
          this.pubs_y.push(ele.n_pubs);
        }
        this.pubs_updateSeries();
      })
    );
  }

  updateCitationsInfo(): void {
    this.subscription.add(
      this.qs.getAuthorCitations(this.author_id).subscribe(res => {
        for (var ele of res) {
          this.citations_x.push("" + ele.year);
          this.citations_y.push(ele.n_citations);
        }
        this.citations_updateSeries();
      })
    );
  }

  updatePubsperTopicInfo(): void {
    this.subscription.add(
      this.qs.getAuthorPubsPerTopic(this.author_id).subscribe(res => {
        for (var ele of res) {
          this.pie_x.push(ele.topic);
          this.pie_y.push(ele.n_pubs);
        }
        this.pie_updateSeries();
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
    this.networkInstance = new Network(container.nativeElement, data, {
      height: '100%',
      width: '100%',
      nodes: {
        shape: 'hexagon',
        font: {
          color: 'white',
        },
      },
      edges: {
        smooth: true,
        arrows: {
          to: {
            enabled: true,
            type: 'vee',
          },
        },
      },
    });
  }

  openRow(row: any) {
    let route = 'article/' + row.id;
    this.router.navigate([route]);
  }

  coauthorGraph(): void {
    this.subscription.add(
      this.qs.getAuthorColabs(this.author_id, 5).subscribe(res => {

        this.nodes_list = [];
        this.edges_list = [];
        var nodes_set = new Set();
        var edges_set = new Set();

        // res is a array of edges
        res.forEach((edge: any) => {

          if (!nodes_set.has(edge.v1.id)) {
            nodes_set.add(edge.v1.id);
            if (edge.v1.id == this.author_id) {
              this.nodes_list.push({
                id: edge.v1.id,
                title: edge.v1.name,
                color: '#C2FABC',
                shape: 'diamond'
              });
            }
            else {
              this.nodes_list.push({
                id: edge.v1.id,
                title: edge.v1.name
              });
            }
          }

          if (!nodes_set.has(edge.v2.id)) {
            nodes_set.add(edge.v2.id);
            if (edge.v2.id == this.author_id) {
              this.nodes_list.push({
                id: edge.v2.id,
                title: edge.v2.name,
                color: '#C2FABC',
                shape: 'diamond'
              });
            }
            else {
              this.nodes_list.push({
                id: edge.v2.id,
                title: edge.v2.name
              });
            }
          }

          // Use the concatenated string as the 'key' to check if already done
          var key1 = edge.v1.id + "#" + edge.v2.id;
          var key2 = edge.v2.id + "#" + edge.v1.id;

          if (!edges_set.has(key1) && !edges_set.has(key2)) {
            edges_set.add(key1);
            this.edges_list.push({
              from: '' + edge.v1.id,
              to: '' + edge.v2.id,
              label: '' + edge.n_colab
            });
          }

        });

        // console.log(this.nodes_list);
        // console.log(this.edges_list);

        // this.nodes_list.forEach((node: any) => {

        //   var key1 = this.author_id + "#" + node.id;
        //   var key2 = node.id + "#" + this.author_id;

        //   if (!edges_set.has(key1) && !edges_set.has(key2)) {
        //     edges_set.add(key1);
        //     this.edges_list.push({
        //       from: ''+this.author_id,
        //       to: ''+node.id
        //     });
        //   }

        // });

        // this.nodes_list.push({
        //   id: this.author_id,
        //   title: this.author.name,
        //   color: '#C2FABC',
        //   shape: 'diamond'
        // });

        var nodes = new DataSet<any>(this.nodes_list);
        var edges = new DataSet<any>(this.edges_list);

        const data = { nodes, edges };

        const container = this.coauthors;

        this.networkInstance = new Network(container.nativeElement, data, {

          autoResize: true,

          height: '100%',

          nodes: {
            shape: 'ellipse',
            font: {
              color: '#000000',
              size: 14
            },
          },

          edges: {

          },

          interaction: { hover: true }

        });

      })
    );
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
