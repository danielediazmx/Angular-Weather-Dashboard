import {HttpClient} from '@angular/common/http';
import * as CanvasJS from '../../assets/canvasjs.min';

export class WeatherService {
  private apiKey = 'e2bdb19a42834340895566e436f4abbe';
  private apiUrl = 'https://api.weatherbit.io/v2.0/forecast/daily';

  constructor(private http: HttpClient) {
  }

  cityID = {
    Obregon: '4013704',
    Navojoa: '3995019',
    Hermosillo: '4004898',
    Nogales: '4004886'
  };

  getData(weatherForm, callback) {
    let cityName = 'Obregon';
    let type = 'M';
    let cityID = this.cityID[cityName];
    let resultType = 'Celsius';

    if (weatherForm != 'default') {
      cityName = weatherForm.value.city;
      type = weatherForm.value.scale;
      cityID = this.cityID[cityName];

      if (weatherForm.value.scale === 'I') resultType = 'Fahrenheit';
    }

    if (cityID) {
      this.http.get(this.apiUrl, {
        params: {
          units: type,
          city_id: cityID,
          key: this.apiKey
        }
      })
        .subscribe(resp => {
          callback(resp, cityName, resultType);
        });
    }
  }
}
