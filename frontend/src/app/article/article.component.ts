import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { QueryserviceService } from '../queryservice.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { ChartOptions } from '../app.component';
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
  article: Article = {
    id: 0,
    n_citations: 0,
    title: 'null',
    venue_id: 0,
    year: 0,
    venue_name: '',
    venue_acronym: ''
  };
  authors: string[] = [];
  topics: string[] = [];
  citations_x: string[] = [];
  citations_y: string[] = [];
  cited_from = [];
  cited_by = [];
  public citations_chartOptions: Partial<ChartOptions> | any;

  // citations-related
  nodes_list: any;
  edges_list: any;

  @ViewChild('citations', { static: false }) citations!: ElementRef;
  private networkInstance: any;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private qs: QueryserviceService) {

  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.article_id = params['article_id'];
      this.updateArticleInfo();
      this.updateCitationsInfo();
      this.citationGraph();
    });
    // this.updatedCitingandCitedby();
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
  }

  updateArticleInfo(): void {
    this.subscription.add(
      this.qs.getArticle(this.article_id).subscribe(res => {
        if (res.length < 1) {
          this.router.navigateByUrl('/articles');
        }
        this.article = {
          id: res[0].i['id'],
          n_citations: res[0]['citations'],
          title: res[0].i['title'],
          venue_id: res[0].i['venue_id'],
          year: res[0].i['year'],
          venue_name: res[0].vname,
          venue_acronym: res[0].vacr
        };
        var author_set = new Set();
        var topic_set = new Set();
        res.forEach((row: any) => {
          if (!author_set.has(row.a_name)) {
            author_set.add(row.a_name);
            this.authors.push(row.a_name);
          }
          if (!topic_set.has(row.topic)) {
            topic_set.add(row.topic);
            this.topics.push(row.topic);
          }
        });
      })
    );
  }

  public citations_updateSeries() {
    this.citations_chartOptions.series = [{
      data: this.citations_y,
    }];
    this.citations_chartOptions.xaxis = { categories: this.citations_x };
  }

  updateCitationsInfo(): void {
    this.subscription.add(
      this.qs.getArticleCitations(this.article_id).subscribe(res => {
        for (var ele of res) {
          this.citations_x.push("" + ele.year);
          this.citations_y.push("" + ele.n_citations);
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

  citationGraph(): void {
    this.subscription.add(
      this.qs.getArticleCitationGraph(this.article_id, 2).subscribe(res => {
        this.nodes_list = [];
        this.edges_list = [];
        var nodes_set = new Set();
        var edges_set = new Set();
        res.forEach((path: any) => {
          for (var i = 0; i < path.nodes.length - 1; i++) {
            if (!nodes_set.has(path.nodes[i].id)) {
              nodes_set.add(path.nodes[i].id);
              this.nodes_list.push({
                id: path.nodes[i].id,
                // label: ''+path.nodes[i].id,
                title: path.nodes[i].title,
                color: '#C2FABC',
                shape: 'diamond'
              });
            }
            if (!nodes_set.has(path.nodes[i + 1].id)) {
              nodes_set.add(path.nodes[i + 1].id);
              this.nodes_list.push({
                id: path.nodes[i + 1].id,
                // label: ''+path.nodes[i+1].id,
                title: path.nodes[i + 1].title
              });
            }
            // Use the concatenated string as the 'key' to check if already done
            var key = path.nodes[i].id + "#" + path.nodes[i + 1].id;
            if (!edges_set.has(key)) {
              edges_set.add(key);
              this.edges_list.push({
                from: '' + path.nodes[i].id,
                to: '' + path.nodes[i + 1].id
              });
            }
          }
        });

        var nodes = new DataSet<any>(this.nodes_list);
        var edges = new DataSet<any>(this.edges_list);

        const data = { nodes, edges };

        const container = this.citations;

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
            arrows: {
              to: {
                enabled: true,
                type: 'triangle',
              },
            },
          },

          interaction: { hover: true }

        });

      })
    );
  }

  capitalize(input: string) {
    var words = input.split(' ');
    var CapitalizedWords: Array<string> = [];
    words.forEach((element: string) => {
      CapitalizedWords.push(element[0].toUpperCase() + element.slice(1, element.length));
        CapitalizedWords.push(element[0].toUpperCase() + element.slice(1, element.length));  
      CapitalizedWords.push(element[0].toUpperCase() + element.slice(1, element.length));
    });
    return CapitalizedWords.join(' ');
  }

  getCommaSeparatedString(words: string[], caps: Boolean): string {
    if (words.length == 0)
      return "";
    var ret = caps ? this.capitalize(words[0]) : words[0];
    for (var i = 1; i < words.length; i++)
      ret += caps ? (", " + this.capitalize(words[i])) : (", " + words[i]);
    return ret;
  }

}
