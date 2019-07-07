import {Component, Injectable} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {WeatherService} from './services/weather.service';
import * as CanvasJS from '../assets/canvasjs.min';


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

    this.weatherService.getData('default', this, this.parseWeatherResponse);
  }

  title = 'Weather Dashboard';
  cities: any = ['Obregon', 'Navojoa', 'Hermosillo', 'Nogales'];
  tableData = [];

  weatherForm = this.fb.group({
    city: '',
    scale: ''
  });

  getData() {
    this.tableData = [{date: '2019-01-01', temperature: 'xd'}];
    this.weatherService.getData(this.weatherForm, this, this.parseWeatherResponse);
  }

  parseWeatherResponse(resp, city, resultType, _this) {
    let dataPointsTemp = [];
    let dataPointsMin = [];
    let dataPointsMax = [];
    _this.tableData = [];

    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    resp.data.map((weather, index) => {
      dataPointsTemp.push({x: new Date(weather.valid_date), y: weather.temp});
      dataPointsMin.push({x: new Date(weather.valid_date), y: weather.min_temp});
      dataPointsMax.push({x: new Date(weather.valid_date), y: weather.max_temp});

      var date = new Date(weather.valid_date);
      let formatted_date = `${monthNames[date.getMonth()]} ${date.getDate()} ${date.getFullYear()}`;
      _this.tableData.push({date: formatted_date, temperature: `${weather.temp} ${resultType}`});
    });
    _this.writeDataFromResponse(city, resultType, dataPointsTemp, dataPointsMin, dataPointsMax);
  }

  writeDataFromResponse(city, resultType, dataPointsTemp, dataPointsMin, dataPointsMax) {
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
