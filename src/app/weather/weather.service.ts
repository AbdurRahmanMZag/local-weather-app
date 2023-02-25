import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs'

import { environment } from '../../environments/environment'
import { ICurrentWeather } from '../interfaces'

export interface ICurrentWeatherData {
  weather: [
    {
      description: string
      icon: string
    }
  ]
  main: {
    temp: number
  }
  sys: {
    country: string
  }
  dt: number
  name: string
}

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  constructor(private httpClient: HttpClient) {}
  getCurrentWeather(search: string | number, country: string) {
    const uriParams = new HttpParams()
    if (typeof search === 'string') {
      uriParams.set('q', country ? `${search},${country}` : search)
    } else {
      uriParams.set('zip', `${search}`)
    }

    uriParams.set('appid', environment.appId)
    return this.getCurrentWeatherHelper(uriParams)
  }
  private getCurrentWeatherHelper(uriParams: HttpParams) {
    return this.httpClient
      .get<ICurrentWeatherData>(
        `${environment.baseUrl}api.openweathermap.org/data/2.5/weather`,
        { params: uriParams }
      )
      .pipe(map((data) => this.transformToICurrentWeather(data)))
  }

  transformToICurrentWeather(data: ICurrentWeatherData): ICurrentWeather {
    return {
      city: data.name,
      country: data.sys.country,
      date: data.dt * 1000,
      image: `http://openweathermap.org/img/w/${data.weather[0].icon}.png`,
      description: data.weather[0].description,
      temperature: this.convertKelvinToFahrenheit(data.main.temp),
    }
  }
  private convertKelvinToFahrenheit(kelvin: number): number {
    return (kelvin * 9) / 5 - 459.67
  }
}
