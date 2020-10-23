import { Component, OnInit } from '@angular/core';
import { MicroservicesService } from '../services/microservices.service';
import { Microservice } from '../shared/models/microservice';
import { GlobalErrorHandlerService } from '../shared/services/global-error-handler.service';
import { CustomizedHttpErrorResponse } from '../shared/models/customized-http-error-response';

class GraphData {
  constructor(
    public name: string,
    public tooltip: { formatter: string }
  ) { }
}

class GraphLink {

  public label: any;
  public value: string;

  constructor(
    public source: string,
    public target: string,
    labelString: string
  ) { 
    // this.label = {
    //   normal: {
    //     show: true,
    //     formatter: labelString,
    //     fontSize: 10
    //   }
    // }

    this.value = labelString;
  }
}

@Component({
  selector: 'app-microservices-dashboard',
  templateUrl: './microservices-dashboard.component.html',
  styleUrls: ['./microservices-dashboard.component.scss']
})
export class MicroservicesDashboardComponent implements OnInit {

  graphData: Array<GraphData> = []
  graphLinks: Array<GraphLink> = [];
  /**
   * Documentation for graph generating;
   * https://echarts.apache.org/en/option.html#title
   * https://echarts.apache.org/en/option.html#series-graph (options for graph type)
   * https://xieziyu.github.io/ngx-echarts/#/series/graph
   * https://xieziyu.github.io/ngx-echarts/api-doc/index.html
   */

  options = {
    title: {
      text: 'Microservices Graph'
    },
    tooltip: {
      formatter: '{c}'
    },
    animationDurationUpdate: 1500,
    animationEasingUpdate: 'quinticInOut',
    series: [
      {
        layout: 'circular',
        type: 'graph',
        symbolSize: 60,
        roam: true,
        label: {
          normal: {
            show: true,
            fontSize: '14'
          }
        },
        edgeSymbol: ['circle', 'arrow'],
        edgeSymbolSize: [4, 10],
        edgeLabel: {
          normal: {
            textStyle: {
              fontSize: 20
            }
          }
        },
        // data: [{
        //   name: 'Node 1',
        //   // x: 300,
        //   // y: 300
        // }, {
        //   name: 'Node 2',
        //   // x: 800,
        //   // y: 300
        // }, {
        //   name: 'Node 3',
        //   // x: 550,
        //   // y: 100
        // }, {
        //   name: 'Node 4',
        //   // x: 550,
        //   // y: 500
        // }],
        // links: [],
        // links: [{
        //   // source: 0,
        //   // target: 1,
        //   // symbolSize: [5, 20],
        //   // label: {
        //   //   normal: {
        //   //     show: true
        //   //   }
        //   // },
        //   // lineStyle: {
        //   //   normal: {
        //   //     width: 5,
        //   //     curveness: 0.2
        //   //   }
        //   // }
        // }, {
        //   source: 'Node 2',
        //   target: 'Node 1',
        //   // label: {
        //   //   normal: {
        //   //     show: true
        //   //   }
        //   // },
        //   // lineStyle: {
        //   //   normal: { curveness: 0.2 }
        //   // }
        // }, {
        //   source: 'Node 1',
        //   target: 'Node 3'
        // }, {
        //   source: 'Node 2',
        //   target: 'Node 3'
        // }, {
        //   source: 'Node 2',
        //   target: 'Node 4'
        // }, {
        //   source: 'Node 1',
        //   target: 'Node 4'
        // }],
        itemStyle: {
          color: '#20a9c9',
          borderColor: '#272727',
          borderWidth: '2',
          shadowColor: 'rgba(0, 0, 0, 0.5)',
          shadowBlur: 10
        },
        lineStyle: {
          normal: {
            opacity: 0.9,
            width: 2,
            curveness: 0
          }
        }
      }
    ]
  };

  constructor(private microservicesService: MicroservicesService, private globalErrorHandler: GlobalErrorHandlerService) { }

  ngOnInit(): void {
    this.getAllMicroservices()
  }

  getAllMockedMicroservices() {
    this.microservicesService.getAllMockedMicroservices().subscribe((microserviceData: Microservice) => {

      this.mapMicroservice(microserviceData);

      this.options.series[0]['data'] = this.graphData;
      this.options.series[0]['links'] = this.graphLinks;

      this.options = Object.assign({}, this.options);

    })
  }

  mapMicroservice(microserviceData: Microservice) {

    const tooltipString = 
    `
    ID: ${microserviceData.serviceId} <br/>
    Address: ${microserviceData.serviceAddress} <br/>
    Type: ${microserviceData.serviceType} <br/>
    Port: ${microserviceData.servicePort} <br/>
    `
    // Eliminating duplicates
    if (!this.graphData.find(el => el.name === microserviceData.serviceName))
      this.graphData.push(new GraphData(microserviceData.serviceName, {formatter: tooltipString}))

    if (microserviceData.connectedServices.length) {
      microserviceData.connectedServices.forEach(connectedService => {

        const linkTooltipString = 
        `
        ${microserviceData.serviceName}
        (${microserviceData.serviceAddress}:${microserviceData.servicePort}) > 
        ${connectedService.serviceName}
        (${connectedService.serviceAddress}:${connectedService.servicePort})
        `

        this.graphLinks.push(new GraphLink(microserviceData.serviceName, connectedService.serviceName, linkTooltipString))
        this.mapMicroservice(connectedService)
      });
    }

  }

  getAllMicroservices() {
    this.microservicesService.getAllMicroservices().subscribe((microserviceData: Microservice) => {

      this.mapMicroservice(microserviceData);

      this.options.series[0]['data'] = this.graphData;
      this.options.series[0]['links'] = this.graphLinks;

      // Needed to trigger change detection
      this.options = Object.assign({}, this.options);

    }, (err: CustomizedHttpErrorResponse) => {
      const errorMessage = 'Cannot get microservices!';
      this.globalErrorHandler.handleHttpError(err, errorMessage);
    })
  }

}
