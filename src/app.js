//Shared html elements
const dataTitle = document.getElementById("dataTitle");
const dataDisplay = document.getElementById("dataDisplay");
const viewSelect = document.getElementById("viewSelect");

viewSelect.addEventListener('change', detectSelect);

const carrierView = document.getElementById('carrierView');
const delayReasonsView = document.getElementById('delayReasonsView');
delayReasonsView.style.display = 'none';

//Put set your buttons and displays displayed or hidden in dataViewElements div here!
function detectSelect(event) {
  if (event) {
    switch (event.target.value) {
      case "delayNum":

        break;
      case "carrier":
        carrierView.style.display = 'block';
        break;
      case 'delayReasons':
      delayReasonsView.style.display = 'block';  
      break;
      default:
        console.log('not found');
    }
  }
  if (event.target.value !== 'carrier') {
    carrierView.style.display = 'none';
  }
  if (event.target.value !== 'delayReasons') {
    delayReasonsView.style.display = 'none';
  }
}

//Contains 20 samples. See categories in more detail at https://www.kaggle.com/datasets/jawadkhattak/us-flight-delay-from-january-2017-july-2022
const jsonSample = [
  {
    "year": 2019,
    "month": 10,
    "carrier": "9E",
    "carrier_name": "Endeavor Air Inc.",
    "airport": "CHS",
    "airport_name": "Charleston, SC: Charleston AFB/International",
    "arr_flights": 47,
    "arr_del15": 2,
    "carrier_ct": 0,
    "weather_ct": 0,
    "nas_ct": 1,
    "security_ct": 0,
    "late_aircraft_ct": 1,
    "arr_cancelled": 1,
    "arr_diverted": 0,
    "arr_delay": 128,
    "carrier_delay": 0,
    "weather_delay": 0,
    "nas_delay": 70,
    "security_delay": 0,
    "late_aircraft_delay": 58

  },
  {
    "year": 2018,
    "month": 11,
    "carrier": "B6",
    "carrier_name": "JetBlue Airways",
    "airport": "DEN",
    "airport_name": "Denver, CO: Denver International",
    "arr_flights": 89,
    "arr_del15": 24,
    "carrier_ct": 12.97,
    "weather_ct": 0,
    "nas_ct": 5.39,
    "security_ct": 0,
    "late_aircraft_ct": 5.64,
    "arr_cancelled": 0,
    "arr_diverted": 0,
    "arr_delay": 1487,
    "carrier_delay": 927,
    "weather_delay": 0,
    "nas_delay": 262,
    "security_delay": 0,
    "late_aircraft_delay": 298

  },
  {
    "year": 2022,
    "month": 1,
    "carrier": "YV",
    "carrier_name": "Mesa Airlines Inc.",
    "airport": "FAR",
    "airport_name": "Fargo, ND: Hector International",
    "arr_flights": 90,
    "arr_del15": 20,
    "carrier_ct": 9.89,
    "weather_ct": 0,
    "nas_ct": 5.96,
    "security_ct": 0,
    "late_aircraft_ct": 4.15,
    "arr_cancelled": 12,
    "arr_diverted": 0,
    "arr_delay": 1364,
    "carrier_delay": 629,
    "weather_delay": 0,
    "nas_delay": 250,
    "security_delay": 0,
    "late_aircraft_delay": 485

  },
  {
    "year": 2022,
    "month": 6,
    "carrier": "YX",
    "carrier_name": "Republic Airline",
    "airport": "IAD",
    "airport_name": "Washington, DC: Washington Dulles International",
    "arr_flights": 346,
    "arr_del15": 43,
    "carrier_ct": 19.35,
    "weather_ct": 1,
    "nas_ct": 8.54,
    "security_ct": 0,
    "late_aircraft_ct": 14.11,
    "arr_cancelled": 23,
    "arr_diverted": 0,
    "arr_delay": 2828,
    "carrier_delay": 890,
    "weather_delay": 58,
    "nas_delay": 497,
    "security_delay": 0,
    "late_aircraft_delay": 1383

  },
  {
    "year": 2019,
    "month": 12,
    "carrier": "YV",
    "carrier_name": "Mesa Airlines Inc.",
    "airport": "TLH",
    "airport_name": "Tallahassee, FL: Tallahassee International",
    "arr_flights": 48,
    "arr_del15": 15,
    "carrier_ct": 5,
    "weather_ct": 0,
    "nas_ct": 4.19,
    "security_ct": 0,
    "late_aircraft_ct": 5.81,
    "arr_cancelled": 1,
    "arr_diverted": 1,
    "arr_delay": 1120,
    "carrier_delay": 445,
    "weather_delay": 0,
    "nas_delay": 145,
    "security_delay": 0,
    "late_aircraft_delay": 530

  },
  {
    "year": 2017,
    "month": 8,
    "carrier": "EV",
    "carrier_name": "ExpressJet Airlines Inc.",
    "airport": "CLE",
    "airport_name": "Cleveland, OH: Cleveland-Hopkins International",
    "arr_flights": 737,
    "arr_del15": 149,
    "carrier_ct": 43.63,
    "weather_ct": 2.58,
    "nas_ct": 34.2,
    "security_ct": 0,
    "late_aircraft_ct": 68.59,
    "arr_cancelled": 35,
    "arr_diverted": 1,
    "arr_delay": 15363,
    "carrier_delay": 4804,
    "weather_delay": 187,
    "nas_delay": 4697,
    "security_delay": 0,
    "late_aircraft_delay": 5675

  },
  {
    "year": 2021,
    "month": 1,
    "carrier": "UA",
    "carrier_name": "United Air Lines Inc.",
    "airport": "LIH",
    "airport_name": "Lihue, HI: Lihue Airport",
    "arr_flights": 16,
    "arr_del15": 1,
    "carrier_ct": 1,
    "weather_ct": 0,
    "nas_ct": 0,
    "security_ct": 0,
    "late_aircraft_ct": 0,
    "arr_cancelled": 0,
    "arr_diverted": 0,
    "arr_delay": 34,
    "carrier_delay": 34,
    "weather_delay": 0,
    "nas_delay": 0,
    "security_delay": 0,
    "late_aircraft_delay": 0

  },
  {
    "year": 2020,
    "month": 2,
    "carrier": "B6",
    "carrier_name": "JetBlue Airways",
    "airport": "CLE",
    "airport_name": "Cleveland, OH: Cleveland-Hopkins International",
    "arr_flights": 100,
    "arr_del15": 14,
    "carrier_ct": 6.41,
    "weather_ct": 0,
    "nas_ct": 3.64,
    "security_ct": 0,
    "late_aircraft_ct": 3.95,
    "arr_cancelled": 0,
    "arr_diverted": 0,
    "arr_delay": 942,
    "carrier_delay": 478,
    "weather_delay": 0,
    "nas_delay": 167,
    "security_delay": 0,
    "late_aircraft_delay": 297

  },
  {
    "year": 2022,
    "month": 1,
    "carrier": "AA",
    "carrier_name": "American Airlines Inc.",
    "airport": "DTW",
    "airport_name": "Detroit, MI: Detroit Metro Wayne County",
    "arr_flights": 302,
    "arr_del15": 51,
    "carrier_ct": 27.47,
    "weather_ct": 1.05,
    "nas_ct": 7.02,
    "security_ct": 0.65,
    "late_aircraft_ct": 14.81,
    "arr_cancelled": 11,
    "arr_diverted": 0,
    "arr_delay": 2896,
    "carrier_delay": 1400,
    "weather_delay": 104,
    "nas_delay": 304,
    "security_delay": 28,
    "late_aircraft_delay": 1060

  },
  {
    "year": 2019,
    "month": 7,
    "carrier": "OO",
    "carrier_name": "SkyWest Airlines Inc.",
    "airport": "TUL",
    "airport_name": "Tulsa, OK: Tulsa International",
    "arr_flights": 259,
    "arr_del15": 54,
    "carrier_ct": 12.9,
    "weather_ct": 4.78,
    "nas_ct": 24.03,
    "security_ct": 0,
    "late_aircraft_ct": 12.3,
    "arr_cancelled": 0,
    "arr_diverted": 1,
    "arr_delay": 2505,
    "carrier_delay": 662,
    "weather_delay": 379,
    "nas_delay": 750,
    "security_delay": 0,
    "late_aircraft_delay": 714

  },
  {
    "year": 2020,
    "month": 6,
    "carrier": "WN",
    "carrier_name": "Southwest Airlines Co.",
    "airport": "SAT",
    "airport_name": "San Antonio, TX: San Antonio International",
    "arr_flights": 608,
    "arr_del15": 42,
    "carrier_ct": 14.56,
    "weather_ct": 4.17,
    "nas_ct": 4.84,
    "security_ct": 0.83,
    "late_aircraft_ct": 17.61,
    "arr_cancelled": 9,
    "arr_diverted": 1,
    "arr_delay": 1972,
    "carrier_delay": 490,
    "weather_delay": 350,
    "nas_delay": 145,
    "security_delay": 44,
    "late_aircraft_delay": 943

  },
  {
    "year": 2020,
    "month": 4,
    "carrier": "OO",
    "carrier_name": "SkyWest Airlines Inc.",
    "airport": "LAN",
    "airport_name": "Lansing, MI: Capital Region International",
    "arr_flights": 70,
    "arr_del15": 7,
    "carrier_ct": 4.43,
    "weather_ct": 0,
    "nas_ct": 2.57,
    "security_ct": 0,
    "late_aircraft_ct": 0,
    "arr_cancelled": 33,
    "arr_diverted": 0,
    "arr_delay": 410,
    "carrier_delay": 327,
    "weather_delay": 0,
    "nas_delay": 83,
    "security_delay": 0,
    "late_aircraft_delay": 0

  },
  {
    "year": 2021,
    "month": 3,
    "carrier": "OO",
    "carrier_name": "SkyWest Airlines Inc.",
    "airport": "EAR",
    "airport_name": "Kearney, NE: Kearney Regional",
    "arr_flights": 62,
    "arr_del15": 2,
    "carrier_ct": 1,
    "weather_ct": 0,
    "nas_ct": 0,
    "security_ct": 0,
    "late_aircraft_ct": 1,
    "arr_cancelled": 3,
    "arr_diverted": 1,
    "arr_delay": 36,
    "carrier_delay": 15,
    "weather_delay": 0,
    "nas_delay": 0,
    "security_delay": 0,
    "late_aircraft_delay": 21

  },
  {
    "year": 2018,
    "month": 6,
    "carrier": "EV",
    "carrier_name": "ExpressJet Airlines Inc.",
    "airport": "FWA",
    "airport_name": "Fort Wayne, IN: Fort Wayne International",
    "arr_flights": 29,
    "arr_del15": 9,
    "carrier_ct": 3.2,
    "weather_ct": 0,
    "nas_ct": 0.84,
    "security_ct": 0,
    "late_aircraft_ct": 4.97,
    "arr_cancelled": 1,
    "arr_diverted": 0,
    "arr_delay": 940,
    "carrier_delay": 399,
    "weather_delay": 0,
    "nas_delay": 131,
    "security_delay": 0,
    "late_aircraft_delay": 410

  },
  {
    "year": 2019,
    "month": 8,
    "carrier": "YV",
    "carrier_name": "Mesa Airlines Inc.",
    "airport": "GJT",
    "airport_name": "Grand Junction, CO: Grand Junction Regional",
    "arr_flights": 1,
    "arr_del15": 0,
    "carrier_ct": 0,
    "weather_ct": 0,
    "nas_ct": 0,
    "security_ct": 0,
    "late_aircraft_ct": 0,
    "arr_cancelled": 0,
    "arr_diverted": 0,
    "arr_delay": 0,
    "carrier_delay": 0,
    "weather_delay": 0,
    "nas_delay": 0,
    "security_delay": 0,
    "late_aircraft_delay": 0

  },
  {
    "year": 2021,
    "month": 10,
    "carrier": "DL",
    "carrier_name": "Delta Air Lines Inc.",
    "airport": "SJC",
    "airport_name": "San Jose, CA: Norman Y. Mineta San Jose International",
    "arr_flights": 213,
    "arr_del15": 24,
    "carrier_ct": 13.11,
    "weather_ct": 0,
    "nas_ct": 7.5,
    "security_ct": 0,
    "late_aircraft_ct": 3.39,
    "arr_cancelled": 0,
    "arr_diverted": 0,
    "arr_delay": 1719,
    "carrier_delay": 1399,
    "weather_delay": 0,
    "nas_delay": 192,
    "security_delay": 0,
    "late_aircraft_delay": 128

  },
  {
    "year": 2022,
    "month": 4,
    "carrier": "NK",
    "carrier_name": "Spirit Air Lines",
    "airport": "SNA",
    "airport_name": "Santa Ana, CA: John Wayne Airport-Orange County",
    "arr_flights": 150,
    "arr_del15": 45,
    "carrier_ct": 8.16,
    "weather_ct": 0,
    "nas_ct": 29.66,
    "security_ct": 0,
    "late_aircraft_ct": 7.18,
    "arr_cancelled": 9,
    "arr_diverted": 0,
    "arr_delay": 2698,
    "carrier_delay": 660,
    "weather_delay": 0,
    "nas_delay": 1490,
    "security_delay": 0,
    "late_aircraft_delay": 548

  },
  {
    "year": 2021,
    "month": 1,
    "carrier": "YX",
    "carrier_name": "Republic Airline",
    "airport": "RDU",
    "airport_name": "Raleigh/Durham, NC: Raleigh-Durham International",
    "arr_flights": 448,
    "arr_del15": 36,
    "carrier_ct": 17.61,
    "weather_ct": 0.3,
    "nas_ct": 15.95,
    "security_ct": 0,
    "late_aircraft_ct": 2.14,
    "arr_cancelled": 2,
    "arr_diverted": 1,
    "arr_delay": 2297,
    "carrier_delay": 1495,
    "weather_delay": 22,
    "nas_delay": 701,
    "security_delay": 0,
    "late_aircraft_delay": 79

  },
  {
    "year": 2020,
    "month": 12,
    "carrier": "YX",
    "carrier_name": "Republic Airline",
    "airport": "CAE",
    "airport_name": "Columbia, SC: Columbia Metropolitan",
    "arr_flights": 96,
    "arr_del15": 6,
    "carrier_ct": 5.63,
    "weather_ct": 0,
    "nas_ct": 0.37,
    "security_ct": 0,
    "late_aircraft_ct": 0,
    "arr_cancelled": 0,
    "arr_diverted": 0,
    "arr_delay": 278,
    "carrier_delay": 269,
    "weather_delay": 0,
    "nas_delay": 9,
    "security_delay": 0,
    "late_aircraft_delay": 0

  }
];

//Place your code in your sections
//Larry

//Jasper
//Stores what carriers have been found to display by
let carrierMap = new Map();
//Div element that holds carrier checkboxes
const carrierCheckboxes = document.getElementById('carrierCheckboxes');
//Select element that chooses what to sort by in carrier view
const carrierSelect = document.getElementById('carrierOrderBy');
//Map that tracks what airports are in the data set
let airportMap = new Map();
//Arrays used by date range in a year, month format
let latestDate = [0, 0];
let earliestDate = [9999, 32];

carrierView.style.display = 'none';

//Div element that holds delay airport checkboxes
const delayAirportCheckboxes = document.getElementById('delayAirportCheckboxes');
//Div element that holds delay carrier checkboxes
const delayCarrierCheckboxes = document.getElementById('delayCarrierCheckboxes');


//Iterate over JSON to gather max, min, and other display info
for (let i = 0; i < jsonSample.length; i++) {
  //Check if in the carrierMap and already included
  if (!carrierMap.has(jsonSample[i].carrier)) {
    //Set map that Carrier is accounted for
    carrierMap.set(jsonSample[i].carrier, jsonSample[i].carrier_name);
    //Create Checkbox, label, and break line to include the carrier in a View
    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = jsonSample[i].carrier + '_CarrierCheckbox';
    checkbox.name = jsonSample[i].carrier + '_CarrierCheckbox';
    checkbox.className = 'carrierCheckbox';
    checkbox.checked = true;
    let label = document.createElement('label');
    label.htmlFor = jsonSample[i].carrier + '_CarrierCheckbox';
    label.innerText = jsonSample[i].carrier_name;
    carrierCheckboxes.appendChild(checkbox);
    carrierCheckboxes.appendChild(label);
    let nextLine = document.createElement('br');
    carrierCheckboxes.appendChild(nextLine);

    //Create checkboxes for delay reasons
    let checkbox1 = document.createElement('input');
    checkbox1.type = 'checkbox';
    checkbox1.id = jsonSample[i].carrier + '_CarrierDRCheckbox';
    checkbox1.name = jsonSample[i].carrier + '_CarrierDRCheckbox';
    checkbox1.className = 'delayCarrierCheckbox';
    checkbox1.checked = true;
    let label1 = document.createElement('label');
    label1.htmlFor = jsonSample[i].carrier + '_CarrierDRCheckbox';
    label1.innerText = jsonSample[i].carrier_name;
    delayCarrierCheckboxes.appendChild(checkbox1);
    delayCarrierCheckboxes.appendChild(label1);
    let nextLine1 = document.createElement('br');
    delayCarrierCheckboxes.appendChild(nextLine1);
  }
  //Set map that airport is accounted for
  if (!airportMap.has(jsonSample[i].airport)) {
    airportMap.set(jsonSample[i].airport, jsonSample[i].airport_name);
    //Create Checkbox, label, and break line to include the airport in a View
    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = jsonSample[i].airport + '_AirportDRCheckbox';
    checkbox.name = jsonSample[i].airport_name + '_AirportDRCheckbox';
    checkbox.className = 'delayAirportCheckbox';
    checkbox.checked = true;
    let label = document.createElement('label');
    label.htmlFor = jsonSample[i].airport + '_AirportDRCheckbox';
    label.innerText = jsonSample[i].airport_name;
    delayAirportCheckboxes.appendChild(checkbox);
    delayAirportCheckboxes.appendChild(label);
    let nextLine = document.createElement('br');
    delayAirportCheckboxes.appendChild(nextLine);
  }
  //Iterate to find max and min range of months
  if (jsonSample[i].year < earliestDate[0] ||  (jsonSample[i].year == earliestDate[0] && jsonSample[i].month > earliestDate[1])) {
    earliestDate[0] = jsonSample[i].year;
    earliestDate[1] = jsonSample[i].month;
  }
  if (jsonSample[i].year >= latestDate[0] ||  (jsonSample[i].year == earliestDate[0] && jsonSample[i].month > earliestDate[1])) {
    latestDate[0] = jsonSample[i].year;
    latestDate[1] = jsonSample[i].month;
  }

}

//Select all checkbox for carrier view
const carrierAllBox = document.getElementById('carrierSelectAll');
//Select element used by carrier view
const carrierOrder = document.getElementById('carrierOrderBy');
//Select element used to ascend or descend in order
const carrierAscension = document.getElementById('carrierAscension');

carrierAllBox.addEventListener('change', selectAllCarriers);
//Called when select all box is changed and set other check boxes to the same boolean
function selectAllCarriers(event) {
  const checkboxes = document.getElementsByClassName('carrierCheckbox');
  if (checkboxes && carrierAllBox) {
    //Iterate over all checkboxes to set them to what the select all box is checked as
    for (let i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = carrierAllBox.checked;
    }
  }
}

//Carrier submit button
const carrierSubmit = document.getElementById('carrierSubmit');
carrierSubmit.onclick = displayByCarrier;

//Called when submit is clicked and displays the data by carrier
function displayByCarrier(event) {
  dataTitle.innerText = 'Carrier Data';

  let rowInfo = [];
  //Summarize relevant data by each carrier
  carrierMap.forEach((value, key) => {
    const carrierBox = document.getElementById(key + '_CarrierCheckbox');
    if (carrierBox && carrierBox.checked) {
      //Make sure all summarized data only added if they are a specific carrier
      let flights = jsonSample.reduce((total, row) => {
        if (row.carrier === key) {
          return total + row.arr_flights;
        }
        return total;
      }, 0);

      let delays = jsonSample.reduce((total, row) => {
        if (row.carrier === key) {
          return total + row.arr_del15;
        }
        return total;
      }, 0);

      let carrierIssue = jsonSample.reduce((total, row) => {
        if (row.carrier === key) {
          return total + row.carrier_ct;
        }
        return total;
      }, 0);

      let late = jsonSample.reduce((total, row) => {
        if (row.carrier === key) {
          return total + row.late_aircraft_ct;
        }
        return total;
      }, 0);

      let cancel = jsonSample.reduce((total, row) => {
        if (row.carrier === key) {
          return total + row.arr_cancelled;
        }
        return total;
      }, 0);

      let diverted = jsonSample.reduce((total, row) => {
        if (row.carrier === key) {
          return total + row.arr_diverted;
        }
        return total;
      }, 0);

      let delayTime = jsonSample.reduce((total, row) => {
        if (row.carrier === key) {
          return total + row.arr_delay;
        }
        return total;
      }, 0);

      let carrierIssueTime = jsonSample.reduce((total, row) => {
        if (row.carrier === key) {
          return total + row.carrier_delay;
        }
        return total;
      }, 0);

      let lateDelay = jsonSample.reduce((total, row) => {
        if (row.carrier === key) {
          return total + row.late_aircraft_delay;
        }
        return total;
      }, 0);

      //Push the html string and the data to be sorted into an array
      rowInfo.push([`<tr>
      <td>${value}</td>
      <td>${flights}</td>
      <td>${delays}</td>
      <td>${delayTime}</td>
      <td>${late}</td>
      <td>${lateDelay}</td>
      <td>${cancel}</td>
      <td>${diverted}</td>
      <td>${carrierIssue.toFixed(2)}</td>
      <td>${carrierIssueTime}</td>
      </tr>`, value, flights, delays, delayTime,
        late, lateDelay, cancel, diverted,
      carrierIssue.toFixed(2), carrierIssueTime]);
    }
  });

  //Switch case that changes how data is ordered
  if (carrierOrder && carrierAscension) {
    switch (carrierOrder.value) {
      case "carrierName":
        rowInfo = sortHelper(rowInfo, 1, carrierAscension.value, true);
        break;
      case "carrierFlights":
        rowInfo = sortHelper(rowInfo, 2, carrierAscension.value, false);
        break;
      case "carrierDelayFlights":
        rowInfo = sortHelper(rowInfo, 3, carrierAscension.value, false);
        break;
      case "carrierDelayTime":
        rowInfo = sortHelper(rowInfo, 4, carrierAscension.value, false);
        break;
      case "carrierLateFlights":
        rowInfo = sortHelper(rowInfo, 5, carrierAscension.value, false);
        break;
      case "carrierLateTime":
        rowInfo = sortHelper(rowInfo, 6, carrierAscension.value, false);
        break;
      case "carrierCancelled":
        rowInfo = sortHelper(rowInfo, 7, carrierAscension.value, false);
        break;
      case "carrierDiverted":
        rowInfo = sortHelper(rowInfo, 8, carrierAscension.value, false);
        break;
      case "carrierByDelay":
        rowInfo = sortHelper(rowInfo, 9, carrierAscension.value, false);
        break;
      case "carrierByDelayTime":
        rowInfo = sortHelper(rowInfo, 10, carrierAscension.value, false);
        break;
    }

    //After recieving sorted array, combine html strings into the display div
    let htmlString = '';
    for (let i = 0; i < rowInfo.length; i++) {
      htmlString += rowInfo[i][0];
    }

    //Display data in the shared data display div
    dataDisplay.innerHTML = `<table>
  <tr>
  <th>Carrier</th>
  <th>Flights</th>
  <th>Delay Flights</th>
  <th>Delay Time</th>
  <th>Late Flights</th>
  <th>Late Time</th>
  <th>Cancelled Flights</th>
  <th>Diverted Flights</th>
  <th>Delays by Carrier</th>
  <th>Delay Time by Carrier</th>
  </tr>
  ` + htmlString + `</table>`;
  }


}

//Helper function that sorts the array by the column specified and in
//either ascending or descending order
function sortHelper(array, index, ascendNum, stringBool) {
  if (stringBool && ascendNum == 0) {
    array.sort(function (a, b) {
      if (a[index] < b[index]) {
        return 1;
      }
      else {
        return -1;
      }
    });
  }
  else if (stringBool && ascendNum == 1) {
    array.sort(function (a, b) {
      if (a[index] > b[index]) {
        return 1;
      }
      else {
        return -1;
      }
    });
  }
  else if (ascendNum == 0) {
    array.sort(function (a, b) {
      return a[index] - b[index];
    });
  }
  else if (ascendNum == 1) {
    array.sort(function (a, b) {
      return b[index] - a[index];
    });
  }
  console.log(array);
  return array;
}

//Month inputs for the range of months accounted for in delayReasons
const delayBeginMonth = document.getElementById('delayBeginMonth');
const delayEndMonth = document.getElementById('delayEndMonth');

//Find the latest and earliest date in the current JSON
if (delayBeginMonth && delayEndMonth) {
  if (latestDate[1] < 10) {
    delayBeginMonth.max = `${latestDate[0]}-0${latestDate[1]}`;
    delayEndMonth.max = `${latestDate[0]}-0${latestDate[1]}`;
    delayEndMonth.value = `${latestDate[0]}-0${latestDate[1]}`;
  }
  else {
    delayBeginMonth.max = `${latestDate[0]}-${latestDate[1]}`;
    delayEndMonth.max = `${latestDate[0]}-${latestDate[1]}`;
    delayEndMonth.value = `${latestDate[0]}-${latestDate[1]}`;
  }
  if (earliestDate[1] < 10) {
    delayBeginMonth.min = `${earliestDate[0]}-0${earliestDate[1]}`;
    delayEndMonth.min = `${earliestDate[0]}-0${earliestDate[1]}`;
    delayBeginMonth.value = `${earliestDate[0]}-0${earliestDate[1]}`;
  } else {
    delayBeginMonth.min = `${earliestDate[0]}-${earliestDate[1]}`;
    delayEndMonth.min = `${earliestDate[0]}-${earliestDate[1]}`;
    delayBeginMonth.value = `${earliestDate[0]}-${earliestDate[1]}`;
  }
}

//Select all checkbox for airports used in the delay reasons view
const delayAirportSelectAll = document.getElementById('delayAirportSelectAll');
//Select all checkbox for carriers used in teh delay reasons view
const delayCarrierSelectAll = document.getElementById('delayCarrierSelectAll');

delayAirportSelectAll.addEventListener('change', selectAllDelayAirport);
delayCarrierSelectAll.addEventListener('change', selectAllDelayCarriers);

//Called when select all box is changed and set other check boxes to the same boolean
function selectAllDelayCarriers(event) {
  const checkboxes = document.getElementsByClassName('delayCarrierCheckbox');
  if (checkboxes && delayCarrierSelectAll) {
    for (let i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = delayCarrierSelectAll.checked;
    }
  }
}

//Called when select all box is changed and set other check boxes to the same boolean
function selectAllDelayAirport(event) {
  const checkboxes = document.getElementsByClassName('delayAirportCheckbox');
  if (checkboxes && delayAirportSelectAll) {
    for (let i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = delayAirportSelectAll.checked;
    }
  }
}

//Select element used to choose how to display delay reasons
const delayReasonsSelect = document.getElementById('delayReasonsSelect');
//Submit button for delay reasons view
const delayReasonsSumbit = document.getElementById('delayReasonsSubmit');


delayReasonsSelect.addEventListener('change', displayDelayCheckboxes);
//Hide checkboxes on startup
delayAirportCheckboxes.style.display = 'none';
delayCarrierCheckboxes.style.display = 'none';

//Called when change is detected in the delay reasons select element
function displayDelayCheckboxes(event) {
  if (event && delayAirportCheckboxes && delayCarrierCheckboxes) {
    if (event.target.value === 'allDelays') {
      delayAirportCheckboxes.style.display = 'none';
      delayCarrierCheckboxes.style.display = 'none';
    }
    else if (event.target.value === 'airportDelays') {
      delayAirportCheckboxes.style.display = 'block';
      delayCarrierCheckboxes.style.display = 'none';
    }
    else if (event.target.value === 'carrierDelays') {
      delayAirportCheckboxes.style.display = 'none';
      delayCarrierCheckboxes.style.display = 'block';
    }
  }
}

delayReasonsSumbit.addEventListener('click', displayByDelayReasons);

//Display delay reasons data. Called when submit button is clicked.
function displayByDelayReasons(event) {
  

  let rowInfo = [];
  let newArray;
  //Alert user if invalid date range is entered and don't display
  if (delayBeginMonth.value > delayEndMonth.value) {
    alert('Month range cannot set the starting month greater than the ending month');
    return;
  }
  //Otherwise filter data to only include those in the date range
  else {
    let max = delayEndMonth.value.split('-');
    max = [Number(max[0]), Number(max[1])];
    let min = delayBeginMonth.value.split('-');
    min = [Number(min[0]), Number(min[1])];
    console.log(max);
    console.log(min);
    newArray = jsonSample.filter((row) => {
      return (row.year > min[0] || (row.year == min[0] && row.month >= min[1])) && (row.year < max[0] || (row.year == max[0] && row.month <= max[1]));
    });
  }
  //Set header to reflect the data being shown
  dataTitle.innerText = 'Delay Reasons Data';

  let carrierDelay;
  let carrierTime;
  let weatherDelay;
  let weatherTime;
  let trafficTime;
  let trafficDelay;
  let securityDelay;
  let securityTime;
  let lateDelay;
  let lateTime;

  //For allDelays summarize all delay reasons data
  if (delayReasonsSelect.value === 'allDelays') {
    carrierDelay = newArray.reduce((total, row) => {
      return total + row.carrier_ct;
    }, 0);

    carrierTime = newArray.reduce((total, row) => {
      return total + row.carrier_delay;
    }, 0);

    weatherDelay = newArray.reduce((total, row) => {
      return total + row.weather_ct;
    }, 0);

    weatherTime = newArray.reduce((total, row) => {
      return total + row.weather_delay;
    }, 0);

    trafficDelay = newArray.reduce((total, row) => {
      return total + row.nas_ct;
    }, 0);

    trafficTime = newArray.reduce((total, row) => {
      return total + row.nas_delay;
    }, 0);

    securityDelay = newArray.reduce((total, row) => {
      return total + row.security_ct;
    }, 0);

    securityTime = newArray.reduce((total, row) => {
      return total + row.security_delay;
    }, 0);

    lateDelay = newArray.reduce((total, row) => {
      return total + row.late_aircraft_ct;
    }, 0);

    lateTime = newArray.reduce((total, row) => {
      return total + row.late_aircraft_delay;
    }, 0);

    rowInfo.push([
      `<tr>
      <td>${carrierDelay.toFixed(2)}</td>
      <td>${carrierTime}</td>
      <td>${weatherDelay}</td>
      <td>${weatherTime}</td>
      <td>${trafficDelay.toFixed(2)}</td>
      <td>${trafficTime}</td>
      <td>${securityDelay}</td>
      <td>${securityTime}</td>
      <td>${lateDelay}</td>
      <td>${lateTime}</td>
      </tr>`, carrierDelay.toFixed(2), carrierTime, weatherDelay,
      weatherTime, trafficDelay.toFixed(2), trafficTime,
      securityDelay, securityTime, lateDelay, lateTime
    ]);
  }
  //For airportDelays, summarize delays by airport
  else if (delayReasonsSelect.value === 'airportDelays') {
    airportMap.forEach((value, key) => {
      const checkbox = document.getElementById(key + '_AirportDRCheckbox');
      if (checkbox && checkbox.checked) {
        carrierDelay = newArray.reduce((total, row) => {
          if (row.airport === key)
            return total + row.carrier_ct;
          return total;
        }, 0);

        carrierTime = newArray.reduce((total, row) => {
          if (row.airport === key)
            return total + row.carrier_delay;
          return total;
        }, 0);

        weatherDelay = newArray.reduce((total, row) => {
          if (row.airport === key)
            return total + row.weather_ct;
          return total;
        }, 0);

        weatherTime = newArray.reduce((total, row) => {
          if (row.airport === key)
            return total + row.weather_delay;
          return total;
        }, 0);

        trafficDelay = newArray.reduce((total, row) => {
          if (row.airport === key)
            return total + row.nas_ct;
          return total;
        }, 0);

        trafficTime = newArray.reduce((total, row) => {
          if (row.airport === key)
            return total + row.nas_delay;
          return total;
        }, 0);

        securityDelay = newArray.reduce((total, row) => {
          if (row.airport === key)
            return total + row.security_ct;
          return total;
        }, 0);

        securityTime = newArray.reduce((total, row) => {
          if (row.airport === key)
            return total + row.security_delay;
          return total;
        }, 0);

        lateDelay = newArray.reduce((total, row) => {
          if (row.airport === key)
            return total + row.late_aircraft_ct;
          return total;
        }, 0);

        lateTime = newArray.reduce((total, row) => {
          if (row.airport === key)
            return total + row.late_aircraft_delay;
          return total;
        }, 0);

        rowInfo.push([
          `<tr>
      <td>${value}</td>
      <td>${carrierDelay.toFixed(2)}</td>
      <td>${carrierTime}</td>
      <td>${weatherDelay}</td>
      <td>${weatherTime}</td>
      <td>${trafficDelay.toFixed(2)}</td>
      <td>${trafficTime}</td>
      <td>${securityDelay}</td>
      <td>${securityTime}</td>
      <td>${lateDelay}</td>
      <td>${lateTime}</td>
      </tr>`, value, carrierDelay.toFixed(2), carrierTime, weatherDelay,
          weatherTime, trafficDelay.toFixed(2), trafficTime,
          securityDelay, securityTime, lateDelay, lateTime
        ]);
      }
    });
  }
  //For carrierDelays, summarize data by carrier
  else if (delayReasonsSelect.value === 'carrierDelays') {
    carrierMap.forEach((value, key) => {
      const checkbox = document.getElementById(key + '_CarrierDRCheckbox');
      if (checkbox && checkbox.checked) {
        carrierDelay = newArray.reduce((total, row) => {
          if (row.carrier === key)
            return total + row.carrier_ct;
          return total;
        }, 0);

        carrierTime = newArray.reduce((total, row) => {
          if (row.carrier === key)
            return total + row.carrier_delay;
          return total;
        }, 0);

        weatherDelay = newArray.reduce((total, row) => {
          if (row.carrier === key)
            return total + row.weather_ct;
          return total;
        }, 0);

        weatherTime = newArray.reduce((total, row) => {
          if (row.carrier === key)
            return total + row.weather_delay;
          return total;
        }, 0);

        trafficDelay = newArray.reduce((total, row) => {
         if (row.carrier === key)
            return total + row.nas_ct;
          return total;
        }, 0);

        trafficTime = newArray.reduce((total, row) => {
          if (row.carrier === key)
            return total + row.nas_delay;
          return total;
        }, 0);

        securityDelay = newArray.reduce((total, row) => {
          if (row.carrier === key)
            return total + row.security_ct;
          return total;
        }, 0);

        securityTime = newArray.reduce((total, row) => {
          if (row.carrier === key)
            return total + row.security_delay;
          return total;
        }, 0);

        lateDelay = newArray.reduce((total, row) => {
          if (row.carrier === key)
            return total + row.late_aircraft_ct;
          return total;
        }, 0);

        lateTime = newArray.reduce((total, row) => {
          if (row.carrier === key)
            return total + row.late_aircraft_delay;
          return total;
        }, 0);

        rowInfo.push([
          `<tr>
      <td>${value}</td>
      <td>${carrierDelay.toFixed(2)}</td>
      <td>${carrierTime}</td>
      <td>${weatherDelay}</td>
      <td>${weatherTime}</td>
      <td>${trafficDelay.toFixed(2)}</td>
      <td>${trafficTime}</td>
      <td>${securityDelay}</td>
      <td>${securityTime}</td>
      <td>${lateDelay}</td>
      <td>${lateTime}</td>
      </tr>`, value, carrierDelay.toFixed(2), carrierTime, weatherDelay,
          weatherTime, trafficDelay.toFixed(2), trafficTime,
          securityDelay, securityTime, lateDelay, lateTime
        ]);
      }
    });
  }

  //Push html strings together
  let htmlString = '';
  for (let i = 0; i < rowInfo.length; i++) {
    htmlString += rowInfo[i][0];
  }

  //Include html string with their correct header table row
  if (delayReasonsSelect.value === 'allDelays') {
    dataDisplay.innerHTML = `<table>
  <tr>
  <th>Carrier Delay</th>
  <th>Carrier Delay Time</th>
  <th>Weather Delay</th>
  <th>Weather Delay Time</th>
  <th>Traffic Delay</th>
  <th>Traffic Delay Time</th>
  <th>Security Delay</th>
  <th>Security Delay Time</th>
  <th>Late Arrival Delay</th>
  <th>Late Arrival Delay Time</th>
  </tr>
  ` + htmlString + `</table>`;
  }
  else if (delayReasonsSelect.value === 'airportDelays') {
    dataDisplay.innerHTML = `<table>
  <tr>
  <th>Airport</th>
  <th>Carrier Delay</th>
  <th>Carrier Delay Time</th>
  <th>Weather Delay</th>
  <th>Weather Delay Time</th>
  <th>Traffic Delay</th>
  <th>Traffic Delay Time</th>
  <th>Security Delay</th>
  <th>Security Delay Time</th>
  <th>Late Arrival Delay</th>
  <th>Late Arrival Delay Time</th>
  </tr>
  ` + htmlString + `</table>`;
  }
  if (delayReasonsSelect.value === 'carrierDelays') {
    dataDisplay.innerHTML = `<table>
  <tr>
  <th>Carrier</th>
  <th>Carrier Delay</th>
  <th>Carrier Delay Time</th>
  <th>Weather Delay</th>
  <th>Weather Delay Time</th>
  <th>Traffic Delay</th>
  <th>Traffic Delay Time</th>
  <th>Security Delay</th>
  <th>Security Delay Time</th>
  <th>Late Arrival Delay</th>
  <th>Late Arrival Delay Time</th>
  </tr>
  ` + htmlString + `</table>`;
  }
}
//Pamela