import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { QueryserviceService } from '../queryservice.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ChartOptions } from '../app.component';
import { dataTool, EChartsOption } from 'echarts';
import * as echarts from 'echarts';
import { Article } from '../article';
import { DataSet } from 'vis-data';
import { Network } from 'vis-network';

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

  @ViewChild('citations', { static: false }) citations!: ElementRef;
  private networkInstance: any;

  constructor(private activatedRoute: ActivatedRoute, private qs : QueryserviceService) { 
    
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.article_id = params['article_id'];
      this.updateArticleInfo();
      this.updateCitationsInfo();
    });
    // this.updatedCitingandCitedby();
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

  ngAfterViewInit(): void {

    this.citationGraph();
    
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
 
    const container = this.citations;

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
        this.citations_updateSeries();
      })
    );
  }

  updatedCitingandCitedby(): void {
    this.subscription.add(
      this.qs.getArticlesCitedBy(this.article_id).subscribe(res => {
        this.cited_by = res;
        this.qs.getArticlesCitedFrom(this.article_id).subscribe(res2 => {
          this.cited_from = res2;
          // this.updateCitationGraph();
        })
      })
    );
  }

  citationGraph(): void{
    this.subscription.add(
      this.qs.getArticleCitationGraph(this.article_id, 1).subscribe(res => {
        console.log(res);
      })
    );
  }

}
