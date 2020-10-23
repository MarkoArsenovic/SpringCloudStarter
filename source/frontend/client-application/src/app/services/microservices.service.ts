import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Microservice } from '../shared/models/microservice';

import { Observable, Observer } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class MicroservicesService {

  BASE_URL = environment.BASE_URL;

  mockedMicroservices: Microservice = {
    "serviceId": "api-gateway-8765",
    "serviceName": "api-gateway",
    "serviceAddress": "172.18.0.8",
    "servicePort": 8765,
    "serviceType": "Gateway",
    "connectedServices": [
      {
        "serviceId": "consul",
        "serviceName": "consul-service-registry",
        "serviceAddress": "127.0.0.1",
        "servicePort": 8301,
        "serviceType": "Service Registry",
        "connectedServices": []
      },
      {
        "serviceId": "hello-world-service-8020",
        "serviceName": "hello-world-service",
        "serviceAddress": "172.18.0.7",
        "servicePort": 8020,
        "serviceType": "Microservice",
        "connectedServices": [
          {
            "serviceId": "config-server-8888",
            "serviceName": "config-server",
            "serviceAddress": "172.18.0.5",
            "servicePort": 8888,
            "serviceType": "Config Server",
            "connectedServices": []
          }
        ]
      },
      {
        "serviceId": "iam-service-8010",
        "serviceName": "iam-service",
        "serviceAddress": "172.18.0.6",
        "servicePort": 8010,
        "serviceType": "Microservice",
        "connectedServices": [
          {
            "serviceId": "config-server-8888",
            "serviceName": "config-server",
            "serviceAddress": "172.18.0.5",
            "servicePort": 8888,
            "serviceType": "Config Server",
            "connectedServices": []
          }
        ]
      }
    ]
  }

  mockedMicroservices2: Microservice = {
    "serviceId": "api-gateway-8765",
    "serviceName": "api-gateway",
    "serviceAddress": "172.18.0.6",
    "servicePort": 8765,
    "serviceType": "Gateway",
    "connectedServices": [
      {
        "serviceId": "consul",
        "serviceName": "consul-service-registry",
        "serviceAddress": "127.0.0.1",
        "servicePort": 8301,
        "serviceType": "Service Registry",
        "connectedServices": []
      },
      {
        "serviceId": "config-server-8888",
        "serviceName": "config-server",
        "serviceAddress": "172.18.0.5",
        "servicePort": 8888,
        "serviceType": "Config Server",
        "connectedServices": []
      },
      {
        "serviceId": "hello-world-service-8020",
        "serviceName": "hello-world-service",
        "serviceAddress": "172.18.0.8",
        "servicePort": 8020,
        "serviceType": "Microservice",
        "connectedServices": [
          {
            "serviceId": "config-server-8888",
            "serviceName": "config-server",
            "serviceAddress": "172.18.0.5",
            "servicePort": 8888,
            "serviceType": "Config Server",
            "connectedServices": []
          },
          {
            "serviceId": "consul",
            "serviceName": "consul-service-registry",
            "serviceAddress": "127.0.0.1",
            "servicePort": 8301,
            "serviceType": "Service Registry",
            "connectedServices": []
          }
        ]
      },
      {
        "serviceId": "iam-service-8010",
        "serviceName": "iam-service",
        "serviceAddress": "172.18.0.7",
        "servicePort": 8010,
        "serviceType": "Microservice",
        "connectedServices": [
          {
            "serviceId": "config-server-8888",
            "serviceName": "config-server",
            "serviceAddress": "172.18.0.5",
            "servicePort": 8888,
            "serviceType": "Config Server",
            "connectedServices": []
          },
          {
            "serviceId": "consul",
            "serviceName": "consul-service-registry",
            "serviceAddress": "127.0.0.1",
            "servicePort": 8301,
            "serviceType": "Service Registry",
            "connectedServices": []
          }
        ]
      },
      {
        "serviceId": "iam-service2-8010",
        "serviceName": "iam-service2",
        "serviceAddress": "172.18.0.7",
        "servicePort": 8010,
        "serviceType": "Microservice",
        "connectedServices": [
          {
            "serviceId": "config-server-8888",
            "serviceName": "config-server",
            "serviceAddress": "172.18.0.5",
            "servicePort": 8888,
            "serviceType": "Config Server",
            "connectedServices": []
          },
          {
            "serviceId": "consul",
            "serviceName": "consul-service-registry",
            "serviceAddress": "127.0.0.1",
            "servicePort": 8301,
            "serviceType": "Service Registry",
            "connectedServices": []
          }
        ]
      },
      {
        "serviceId": "iam-service3-8010",
        "serviceName": "iam-service3",
        "serviceAddress": "172.18.0.7",
        "servicePort": 8010,
        "serviceType": "Microservice",
        "connectedServices": [
          {
            "serviceId": "config-server-8888",
            "serviceName": "config-server",
            "serviceAddress": "172.18.0.5",
            "servicePort": 8888,
            "serviceType": "Config Server",
            "connectedServices": []
          },
          {
            "serviceId": "consul",
            "serviceName": "consul-service-registry",
            "serviceAddress": "127.0.0.1",
            "servicePort": 8301,
            "serviceType": "Service Registry",
            "connectedServices": []
          }
        ]
      },
      {
        "serviceId": "iam-service4-8010",
        "serviceName": "iam-service4",
        "serviceAddress": "172.18.0.7",
        "servicePort": 8010,
        "serviceType": "Microservice",
        "connectedServices": [
          {
            "serviceId": "config-server-8888",
            "serviceName": "config-server",
            "serviceAddress": "172.18.0.5",
            "servicePort": 8888,
            "serviceType": "Config Server",
            "connectedServices": []
          },
          {
            "serviceId": "consul",
            "serviceName": "consul-service-registry",
            "serviceAddress": "127.0.0.1",
            "servicePort": 8301,
            "serviceType": "Service Registry",
            "connectedServices": []
          }
        ]
      }
    ]
  }

  constructor(private http: HttpClient) { }

  getAllMicroservices() {
    return this.http.get<Microservice>(this.BASE_URL + 'dashboard')
  }

  getAllMockedMicroservices() {
    return new Observable((o: Observer<any>) => {
      o.next(this.mockedMicroservices)
    })
  }

}
