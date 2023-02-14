import { HttpClient, HttpParams } from '@angular/common/http';

import { ICurrentWeather } from '../interfaces';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { map } from 'rxjs';

export interface ICurrentWeatherData {
  weather: [{
  description: string,
  icon: string
  }],
  main: {
  temp: number
  },
  sys: {
  country: string
  },
  dt: number,
  name: string
 }

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  constructor(private httpClient: HttpClient) { }
  getCurrentWeather(city: string, country: string) {
  const uriParams = new HttpParams()
  .set('q', `${city},${country}`)
  .set('appid', environment.appId)
  return this.httpClient
  .get<ICurrentWeatherData>(
    `${environment.baseUrl}api.openweathermap.org/data/2.5/weather`,
      { params: uriParams }
 ).pipe(map(data => this.transformToICurrentWeather(data)))
 }

 transformToICurrentWeather(data: ICurrentWeatherData): ICurrentWeather {

  return {
    city: data.name,
    country:data.sys.country,
    date: data.dt * 1000,
    image:
    `http://openweathermap.org/img/w/${data.weather[0].icon}.png`,
    description:data.weather[0].description,
    temperature:data.main.temp
  };
}
}
