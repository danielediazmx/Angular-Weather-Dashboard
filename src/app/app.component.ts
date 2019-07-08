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

    this.weatherService.getData('default', this, this.parseWeatherResponse); // First api call
  }

  title = 'Weather Dashboard';
  cities = ['Obregon', 'Navojoa', 'Hermosillo', 'Nogales'];
  tableData = [];

  weatherForm = this.fb.group({
    city: 'Obregon',
    scale: 'M',
    from_date: '',
    to_date: ''
  });

  getData() {
    this.weatherService.getData(this.weatherForm, this, this.parseWeatherResponse);
  }

  parseWeatherResponse(resp, city, resultType, from_date, to_date, _this) {
    let dataPointsTemp = [];
    let dataPointsMin = [];
    let dataPointsMax = [];
    let filterByDate: boolean = from_date !== "" && to_date !== "";
    _this.tableData = [];

    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    resp.data.map((weather, index) => {
      const valid_date = new Date(weather.valid_date);
      if (filterByDate) {
        from_date = new Date(from_date);
        to_date = new Date(to_date);

        if (valid_date < from_date || valid_date > to_date) {
          return false;
        }
      }
      dataPointsTemp.push({x: valid_date, y: weather.temp}); // Adding data to temp
      dataPointsMin.push({x: valid_date, y: weather.min_temp}); // Adding data to min temp
      dataPointsMax.push({x: valid_date, y: weather.max_temp}); // Adding data to max temp

      // Adding data to html table
      var date = new Date(weather.valid_date);
      let formatted_date = `${monthNames[date.getMonth()]} ${date.getDate()} ${date.getFullYear()}`; // Parsing date
      _this.tableData.push({date: formatted_date, temperature: `${weather.temp} ${resultType}`});
    });
    _this.writeDataFromResponse(city, resultType, dataPointsTemp, dataPointsMin, dataPointsMax);
  }

  // Writes canvas graph
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
