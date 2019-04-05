$(document).ready(function () {
  var timeData = [],
    temperatureData = [],
    powervoltageData = [],
    luminousData = [],
    humidityData = [];
  var data = {
    labels: timeData,
    datasets: [
      {
        fill: false,
        label: 'Temperature',
        yAxisID: 'Temperature',
        borderColor: "rgba(255, 204, 0, 1)",
        pointBoarderColor: "rgba(255, 204, 0, 1)",
        backgroundColor: "rgba(255, 204, 0, 0.4)",
        pointHoverBackgroundColor: "rgba(255, 204, 0, 1)",
        pointHoverBorderColor: "rgba(255, 204, 0, 1)",
        data: temperatureData
      },
      {
        fill: false,
        label: 'Power Voltage',
        yAxisID: 'Power Voltage',
        borderColor: "rgba(203, 27, 69, 1)",
        pointBoarderColor: "rgba(203, 27, 69, 1)",
        backgroundColor: "rgba(203, 27, 69, 0.4)",
        pointHoverBackgroundColor: "rgba(203, 27, 69, 1)",
        pointHoverBorderColor: "rgba(203, 27, 69, 1)",
        data: powervoltageData
      },
      {
        fill: false,
        label: 'Luminous intensity',
        yAxisID: 'Luminous intensity',
        borderColor: "rgba(38, 135, 133, 1)",
        pointBoarderColor: "rgba(38, 135, 133, 1)",
        backgroundColor: "rgba(38, 135, 133, 0.4)",
        pointHoverBackgroundColor: "rgba(38, 135, 133, 1)",
        pointHoverBorderColor: "rgba(38, 135, 133, 1)",
        data: luminousData
      },
      {
        fill: false,
        label: 'Humidity',
        yAxisID: 'Humidity',
        borderColor: "rgba(24, 120, 240, 1)",
        pointBoarderColor: "rgba(24, 120, 240, 1)",
        backgroundColor: "rgba(24, 120, 240, 0.4)",
        pointHoverBackgroundColor: "rgba(24, 120, 240, 1)",
        pointHoverBorderColor: "rgba(24, 120, 240, 1)",
        data: humidityData
      }
    ]
  }

  var basicOption = {
    title: {
      display: true,
      text: 'Highway LED Board Real-time Data 1',
      fontSize: 36
    },
    scales: {
      yAxes: [{
        id: 'Temperature',
        type: 'linear',
        scaleLabel: {
          labelString: 'Temperature(C)',
          display: true
        },
        position: 'left',
      }, {
          id: 'Humidity',
          type: 'linear',
          scaleLabel: {
            labelString: 'Humidity(%)',
            display: true
          },
          position: 'right'
        }]
    }
  }

  var basicOption2 = {
    title: {
      display: true,
      text: 'Highway LED Board Real-time Data 2',
      fontSize: 36
    },
    scales: {
      yAxes: [{
        id: 'Power Voltage',
        type: 'linear',
        scaleLabel: {
          labelString: 'Voltage(V)',
          display: true
        },
        position: 'left',
      }, {
          id: 'Luminous intensity',
          type: 'linear',
          scaleLabel: {
            labelString: 'Luminous intensity(Lx)',
            display: true
          },
          position: 'right'
        }]
    }
  }

  //Get the context of the canvas element we want to select
  var ctx = document.getElementById("myChart").getContext("2d");
  var optionsNoAnimation = { animation: false }
  var myLineChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: basicOption
  });

  var ctx2 = document.getElementById("myChart2").getContext("2d");
  var myLineChart2 = new Chart(ctx2, {
    type: 'line',
    data: data,
    options: basicOption2
  });

  var ws = new WebSocket('ws://' + location.host);
  ws.onopen = function () {
    console.log('Successfully connect WebSocket');
  }
  ws.onmessage = function (message) {
    console.log('receive message' + message.data);
    try {
      var obj = JSON.parse(message.data);
      if(!obj.time || !obj.temperature) {
        return;
      }
      timeData.push(obj.time);
      temperatureData.push(obj.temperature);
      // only keep no more than 50 points in the line chart
      const maxLen = 50;
      var len = timeData.length;
      if (len > maxLen) {
        timeData.shift();
        temperatureData.shift();
      }

      if (obj.powervoltage) {
        powervoltageData.push(obj.powervoltage);
      }
      if (powervoltageData.length > maxLen) {
        powervoltageData.shift();
      }

      if (obj.luminous) {
        luminousData.push(obj.luminous);
      }
      if (luminousData.length > maxLen) {
        luminousData.shift();
      }

      if (obj.humidity) {
        humidityData.push(obj.humidity);
      }
      if (humidityData.length > maxLen) {
        humidityData.shift();
      }

      if (obj.humidity) {
        humidityData.push(obj.humidity);
      }
      if (humidityData.length > maxLen) {
        humidityData.shift();
      }

      myLineChart.update();
      myLineChart2.update();
    } catch (err) {
      console.error(err);
    }
  }
});
