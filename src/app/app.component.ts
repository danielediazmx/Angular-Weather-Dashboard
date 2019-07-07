import {Component, Injectable} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {WeatherService} from './services/weather.service';
import * as CanvasJS from '../assets/canvasjs.min';
import {$} from "protractor";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

@Injectable()
export class AppComponent {
  private weatherService = null;

  constructor(public fb: FormBuilder, private http: HttpClient) {
    this.weatherService = new WeatherService(http);

    this.weatherService.getData('default', this.parseWeatherResponse);
  }

  title = 'Weather Dashboard';
  cities: any = ['Obregon', 'Navojoa', 'Hermosillo', 'Nogales'];
  tableData = [{}];

  weatherForm = this.fb.group({
    city: '',
    scale: ''
  });

  getData() {

    this.tableData = [{date: '2019-01-01', temperature: 'xd'}];
    this.weatherService.getData(this.weatherForm, this.parseWeatherResponse);
  }

  parseWeatherResponse(resp, city, resultType) {
    let dataPointsTemp = [];
    let dataPointsMin = [];
    let dataPointsMax = [];

    resp.data.map((weather, index) => {
      dataPointsTemp.push({x: new Date(weather.valid_date), y: weather.temp});
      dataPointsMin.push({x: new Date(weather.valid_date), y: weather.min_temp});
      dataPointsMax.push({x: new Date(weather.valid_date), y: weather.max_temp});
    });

    AppComponent.writeCanvas(city, resultType, dataPointsTemp, dataPointsMin, dataPointsMax);
  }

  public static writeCanvas(city: any, resultType: any, dataPointsTemp: Array, dataPointsMin: Array, dataPointsMax: Array) {

    let chart = new CanvasJS.Chart("chartContainer", {
      exportEnabled: false,
      title: {
        text: `${city} (${resultType})`
      },
      axisX: {
        valueFormatString: "DD MMM"
      },
      toolTip: {
        shared: true
      },
      legend: {
        cursor: "pointer",
        verticalAlign: "top",
        horizontalAlign: "center",
        dockInsidePlotArea: true,
      },
      data: [
        {
          type: "line",
          axisYType: "secondary",
          name: "Max",
          showInLegend: true,
          dataPoints: dataPointsMax,
        },
        {
          type: "line",
          axisYType: "secondary",
          name: "Temp",
          showInLegend: true,
          dataPoints: dataPointsTemp,
        },
        {
          type: "line",
          axisYType: "secondary",
          name: "Min",
          showInLegend: true,
          dataPoints: dataPointsMin,
        }
      ]
    });
    chart.render();
  }
}
