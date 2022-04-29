import { Component, OnInit } from '@angular/core';
import { QueryserviceService } from '../queryservice.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ChartOptions } from '../app.component';
import { dataTool, EChartsOption } from 'echarts';
import { ViewChild, ElementRef } from '@angular/core';
import * as echarts from 'echarts';
import { Article } from '../article';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {
  article_id = 0;
  subscription = new Subscription();
  article :Article = {
    id: 0,
    n_citations: 0,
    title: 'null',
    venue_id: 0,
    year: 0,
    venue_name: '',
    venue_acronym: ''
  };
  citations_x : string[]= [];
  citations_y : string[]= [];
  cited_from = [];
  cited_by = [];
  public citations_chartOptions: Partial<ChartOptions> | any;

  graphOption: EChartsOption | any;

  constructor(private activatedRoute: ActivatedRoute, private qs : QueryserviceService) { 
    
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.article_id = params['article_id'];
      this.updateArticleInfo();
      this.updateCitationsInfo();
    });
    this.updatedCitingandCitedby();
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
  }

  updateArticleInfo() : void {
    this.subscription.add(
      this.qs.getArticle(this.article_id).subscribe(res => {
        this.article = {
          id: res[0].i['id'],
          n_citations: res[0]['citations'],
          title: res[0].i['title'],
          venue_id: res[0].i['venue_id'],
          year: res[0].i['year'],
          venue_name: res[0].vname,
          venue_acronym: res[0].vacr
        };
        console.log(res);
      })
    );
  }

  public citations_updateSeries() {
    this.citations_chartOptions.series = [{
      data: this.citations_y,
    }];
    this.citations_chartOptions.xaxis = {categories : this.citations_x};
  }

  updateCitationsInfo(): void {
    this.subscription.add(
      this.qs.getArticleCitations(this.article_id).subscribe(res => {
        for(var ele of res){
          this.citations_x.push(""+ele.year);
          this.citations_y.push(""+ele.n_citations);
        }  
        // if(this.citations_x[0] != 'null')
        // {
          this.citations_updateSeries(); 
        //   console.log("H", this.citations_x);
        // }
          
      })
    );
  }

  updatedCitingandCitedby(): void {
    this.subscription.add(
      this.qs.getArticlesCitedBy(this.article_id).subscribe(res => {
        this.cited_by = res;
        this.qs.getArticlesCitedFrom(this.article_id).subscribe(res2 => {
          this.cited_from = res2;
          this.updateCitationGraph();
        })
      })
    );
  }

  updateCitationGraph(): void {
    // var gOption : any = {
    //   title: {
    //     text: 'Citation Graph'
    //   },
    //   tooltip: {},
    //   animationDurationUpdate: 1500,
    //   animationEasingUpdate: 'quinticInOut',
    //   series: [
    //     {
    //       type: 'graph',
    //       layout: 'none',
    //       symbolSize: 50,
    //       roam: true,
    //       label: {
    //         show: true
    //       },
    //       edgeSymbol: ['circle', 'arrow'],
    //       edgeSymbolSize: [4, 10],
    //       edgeLabel: {
    //         fontSize: 20
    //       },
    //       data: [
    //         {
    //           name: 'Node 1',
    //           x: 300,
    //           y: 300
    //         },
    //         {
    //           name: 'Node 2',
    //           x: 800,
    //           y: 300
    //         },
    //         {
    //           name: 'Node 3',
    //           x: 550,
    //           y: 100
    //         },
    //         {
    //           name: 'Node 4',
    //           x: 550,
    //           y: 500
    //         }
    //       ],
    //       links: [
    //         {
    //           source: 0,
    //           target: 1,
    //           symbolSize: [5, 20],
    //           label: {
    //             show: true
    //           },
    //           lineStyle: {
    //             width: 5,
    //             curveness: 0.2
    //           }
    //         },
    //         {
    //           source: 'Node 2',
    //           target: 'Node 1',
    //           label: {
    //             show: true
    //           },
    //           lineStyle: {
    //             curveness: 0.2
    //           }
    //         },
    //         {
    //           source: 'Node 1',
    //           target: 'Node 3'
    //         },
    //         {
    //           source: 'Node 2',
    //           target: 'Node 3'
    //         },
    //         {
    //           source: 'Node 2',
    //           target: 'Node 4'
    //         },
    //         {
    //           source: 'Node 1',
    //           target: 'Node 4'
    //         }
    //       ],
    //       lineStyle: {
    //         opacity: 0.9,
    //         width: 2,
    //         curveness: 0
    //       }
    //     }
    //   ]
    // }; 
    // var data = [];
    // var links = [];
    // data.push({
    //   name: ""+this.article_id,
    //   x: 500,
    //   y: 500
    // });
    // var n_citedfrom = this.cited_from.length;
    // var n_citedby = this.cited_by.length;
    // for (var i = 0; i < n_citedfrom; i++) {
    //   var yc = 250*(1+(i*1.0/n_citedfrom));
    //   data.push({
    //     name: ""+this.cited_from[i]['j']['id'],
    //     x: 250,
    //     y: yc
    //   });
    //   links.push({
    //     source: ""+this.cited_from[i]['j']['id'],
    //     target: ""+this.article_id
    //   });
    // }
    // for (var i = 0; i < n_citedby; i++) {
    //   var yc = 250*(1+(i*1.0/n_citedfrom));
    //   data.push({
    //     name: ""+this.cited_by[i]['j']['id'],
    //     x: 750,
    //     y: yc
    //   });
    //   links.push({
    //     source: ""+this.article_id,
    //     target: ""+this.cited_from[i]['j']['id']
    //   });
    // }
    // gOption['data'] = data;
    // gOption['links'] = links;
    // console.log(gOption);
    // this.graphOption = gOption;
  };
}
