import { QueryserviceService } from '../queryservice.service';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Topic } from '../topic';
import { ChartOptions } from '../app.component';

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss']
})
export class TopicComponent implements OnInit {
  subscription = new Subscription();
  topic_id = 0;
  topic: Topic | any;

  pubs_x: string[] = [];
  pubs_y: string[] = [];
  citations_x: string[] = [];
  citations_y: string[] = [];

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
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.topic_id = params['topic_id'];
      this.updateTopicInfo();
      this.updatePubsInfo();
      this.updateCitationsInfo();
    });
  }

  updateTopicInfo(): void {
    this.subscription.add(
      this.qs.getTopic(this.topic_id).subscribe(res => {
        if (res.length < 1) {
          this.router.navigateByUrl('/topics');
        }
        this.topic = {
          id: res[0]['i']['id'],
          name: res[0]['i']['name'],
          n_citations: res[0]['i']['n_citations'],
          n_articles: res[0]['i']['n_articles'],
          n_authors: res[0]['i']['n_authors']
        };
      })
    );
  }

  updatePubsInfo(): void {
    this.subscription.add(
      this.qs.getTopicPubs(this.topic_id).subscribe(res => {
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
      this.qs.getTopicCitations(this.topic_id).subscribe(res => {
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

  capitalize(input: string) {
    var words = input.split(' ');
    var CapitalizedWords: Array<string> = [];
    words.forEach((element: string) => {
      CapitalizedWords.push(element[0].toUpperCase() + element.slice(1, element.length));
    });
    return CapitalizedWords.join(' ');
  }

}
