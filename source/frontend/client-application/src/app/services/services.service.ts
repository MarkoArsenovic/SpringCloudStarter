import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Service } from '../shared/models/service';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  BASE_URL = environment.BASE_URL
  BACKEND_ROUTE_PREFIX = 'iam-service/app-service'
  URL_PREFIX = this.BASE_URL + this.BACKEND_ROUTE_PREFIX

  constructor(private http: HttpClient) { }

  getAllServices() {
    return this.http.get<Service[]>(this.URL_PREFIX + '/services')
  }

  getServiceById(id: string) {
    return this.http.get<Service>(this.URL_PREFIX + '/services/' + id)
  }

  createService(service: Service) {
    return this.http.post(this.URL_PREFIX, {
      'name': service.name,
      'description': service.description
    });
  }

  updateService(service: Service) {
    return this.http.put(this.URL_PREFIX, service);
  }

  removeService(id: string) {
    return this.http.delete(this.URL_PREFIX + '/' + id);
  }
}
