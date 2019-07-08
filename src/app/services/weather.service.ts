import {HttpClient} from '@angular/common/http';

export class WeatherService {
  private apiKey = 'e2bdb19a42834340895566e436f4abbe';
  private apiUrl = 'https://api.weatherbit.io/v2.0/forecast/daily';

  constructor(private http: HttpClient) {
  }

  cityID = { // citiesID, not by latitude and longitude
    Obregon: '4013704',
    Navojoa: '3995019',
    Hermosillo: '4004898',
    Nogales: '4004886'
  };

  // get data from api weatherbit server
  getData(weatherForm, _this, callback) {
    let cityName = 'Obregon';
    let type = 'M';
    let cityID = this.cityID[cityName];
    let resultType = 'Celsius';
    let from_date = '';
    let to_date = '';

    if (weatherForm != 'default') { // validates if is the initial request
      cityName = weatherForm.value.city;
      type = weatherForm.value.scale;
      cityID = this.cityID[cityName];
      from_date = weatherForm.value.from_date;
      to_date = weatherForm.value.to_date;

      if (weatherForm.value.scale === 'I') resultType = 'Fahrenheit';
    }

    if (cityID) {
      this.http.get(this.apiUrl, { // sends get request
        params: {
          units: type,
          city_id: cityID,
          key: this.apiKey
        }
      }).subscribe(resp => {
        if (callback) // returns a callback if exists
          callback(resp, cityName, resultType, from_date, to_date, _this);
      });
    }
  }
}
