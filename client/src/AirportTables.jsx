import { useRef, useState, useEffect } from "react";
import './App.css';

export function AirportTables({ jsonSample, dataChanged, setDataChanged }) {
    const [firstRender, setFirstRender] = useState(true);
    useEffect(() => {
        if (dataChanged || firstRender) {
            //Shared html elements
            const dataTitle = document.getElementById("dataTitle");
            const dataDisplay = document.getElementById("dataDisplay");

            //helper functions
            function totalDelayMinutes(f) {
                return (f.carrier_delay || 0)
                    + (f.weather_delay || 0)
                    + (f.nas_delay || 0)
                    + (f.security_delay || 0)
                    + (f.late_aircraft_delay || 0);
            }

            const carrierView = document.getElementById('carrierView');
            const delayReasonsView = document.getElementById('delayReasonsView');

            //Calculates total delay minutes for a row
            function totalDelayMinutesCalc(r) {
                return (r.carrier_delay || 0) + (r.weather_delay || 0) + (r.nas_delay || 0) + (r.security_delay || 0) + (r.late_aircraft_delay || 0);
            }

            //Summarize carrier data
            function computeCarrierSummary(key, label) {
                const flights = jsonSample.current.reduce((t, r) => r.carrier === key ? t + (Number(r.arr_flights) || 0) : t, 0);
                const delays = jsonSample.current.reduce((t, r) => r.carrier === key ? t + (Number(r.arr_del15) || 0) : t, 0);
                const delayTime = jsonSample.current.reduce((t, r) => r.carrier === key ? t + (Number(r.arr_delay) || 0) : t, 0);
                const late = jsonSample.current.reduce((t, r) => r.carrier === key ? t + (Number(r.late_aircraft_ct) || 0) : t, 0);
                const lateDelay = jsonSample.current.reduce((t, r) => r.carrier === key ? t + (Number(r.late_aircraft_delay) || 0) : t, 0);
                const cancel = jsonSample.current.reduce((t, r) => r.carrier === key ? t + (Number(r.arr_cancelled) || 0) : t, 0);
                const diverted = jsonSample.current.reduce((t, r) => r.carrier === key ? t + (Number(r.arr_diverted) || 0) : t, 0);
                const carrierIssue = jsonSample.current.reduce((t, r) => r.carrier === key ? t + (Number(r.carrier_ct) || 0) : t, 0);
                const carrierIssueTime = jsonSample.current.reduce((t, r) => r.carrier === key ? t + (Number(r.carrier_delay) || 0) : t, 0);

                const html = `<tr>
    <td>${label}</td>
    <td>${flights}</td>
    <td>${delays}</td>
    <td>${delayTime}</td>
    <td>${late.toFixed(2)}</td>
    <td>${lateDelay}</td>
    <td>${cancel}</td>
    <td>${diverted}</td>
    <td>${carrierIssue.toFixed(2)}</td>
    <td>${carrierIssueTime}</td>
  </tr>`;

                return [html, label, flights, delays, delayTime, late, lateDelay, cancel, diverted, carrierIssue.toFixed(2), carrierIssueTime];
            }

            //Place your code in your sections
            //Larry

            //Display Number of Delays
            function displayByDelayNumView() {
                let rows = [];
                const lowest = new Array(10).fill(Number.MAX_VALUE); // now 10 numeric cols
                const highest = new Array(10).fill(-1);

                carrierMap.forEach((label, key) => {
                    const cb = document.getElementById(key + '_NumCheckbox');
                    if (cb && cb.checked) {
                        const row = summarizeCarrierCounts(key, label);
                        rows.push(row);
                        const nums = row.slice(2); // numeric portion
                        for (let i = 0; i < nums.length; i++) {
                            const v = Number(nums[i]);
                            if (v < lowest[i]) lowest[i] = v;
                            if (v > highest[i]) highest[i] = v;
                        }
                    }
                });

                const orderBy = document.getElementById('delayNumOrderBy').value;
                const asc = document.getElementById('delayNumAscension').value;
                switch (orderBy) {
                    case "carrierName": rows = sortHelper(rows, 1, asc, true); break;
                    case "carrierDelayFlights": rows = sortHelper(rows, 2, asc, false); break;
                    case "delayRatePct": rows = sortHelper(rows, 3, asc, false); break; // NEW
                    case "carrierLateFlights": rows = sortHelper(rows, 4, asc, false); break;
                    case "carrierCancelled": rows = sortHelper(rows, 5, asc, false); break;
                    case "carrierDiverted": rows = sortHelper(rows, 6, asc, false); break;
                    case "carrierByDelay": rows = sortHelper(rows, 7, asc, false); break;
                    // weather (8), nas(9), security(10), late(11) are still sortable via cases above if you want
                }

                let html = '';
                for (let i = 0; i < rows.length; i++) html += rows[i][0];

                const host = document.getElementById('delayNumDisplay');
                host.innerHTML = `<table className='dataTable'>
    <tr>
      <th>Carrier</th>
      <th>Delay Flights</th>
      <th>Delay Rate (%)</th>
      <th>Late Flights</th>
      <th>Cancelled</th>
      <th>Diverted</th>
      <th>Delays by Carrier</th>
      <th>Weather Delays</th>
      <th>Traffic (NAS) Delays</th>
      <th>Security Delays</th>
      <th>Late-Arrival Delays</th>
    </tr>${html}</table>`;

                applyRangeColoring(host.firstElementChild, lowest, highest, true);
            }

            //Display Time of Delays
            function displayByDelayTimeView() {
                let rows = [];
                const lowest = new Array(7).fill(Number.MAX_VALUE); // 7 numeric cols now
                const highest = new Array(7).fill(-1);

                carrierMap.forEach((label, key) => {
                    const cb = document.getElementById(key + '_TimeCheckbox');
                    if (cb && cb.checked) {
                        const row = summarizeCarrierMinutes(key, label);
                        rows.push(row);
                        const nums = row.slice(2);
                        for (let i = 0; i < nums.length; i++) {
                            const v = Number(nums[i]);
                            if (v < lowest[i]) lowest[i] = v;
                            if (v > highest[i]) highest[i] = v;
                        }
                    }
                });

                const orderBy = document.getElementById('delayTimeOrderBy').value;
                const asc = document.getElementById('delayTimeAscension').value;
                switch (orderBy) {
                    case "carrierName": rows = sortHelper(rows, 1, asc, true); break;
                    case "carrierDelayTime": rows = sortHelper(rows, 2, asc, false); break; // total minutes
                    case "carrierByDelayTime": rows = sortHelper(rows, 3, asc, false); break; // carrier minutes
                    case "carrierLateTime": rows = sortHelper(rows, 7, asc, false); break; // late minutes
                    case "avgPerDelay": rows = sortHelper(rows, 8, asc, false); break; // NEW (see HTML option below)
                }

                let html = '';
                for (let i = 0; i < rows.length; i++) html += rows[i][0];

                const host = document.getElementById('delayTimeDisplay');
                host.innerHTML = `<table className='dataTable'>
    <tr>
      <th>Carrier</th>
      <th>Total Delay Minutes</th>
      <th>Carrier Delay Minutes</th>
      <th>Weather Delay Minutes</th>
      <th>Traffic (NAS) Minutes</th>
      <th>Security Delay Minutes</th>
      <th>Late-Arrival Minutes</th>
      <th>Avg Minutes / Delayed Flight</th>
    </tr>${html}</table>`;

                applyRangeColoring(host.firstElementChild, lowest, highest, true);
            }

            //Initialize delay views after carrierMap is filled
            function initDelayViews() {
                const numBox = document.getElementById('delayNumCarrierCheckboxes');
                const timeBox = document.getElementById('delayTimeCarrierCheckboxes');
                if (!numBox || !timeBox) return;

                carrierMap.forEach((label, key) => {
                    const cb1 = document.createElement('input');
                    cb1.type = 'checkbox'; cb1.checked = true;
                    cb1.id = key + '_NumCheckbox'; cb1.className = 'numCarrierCheckbox';
                    const lab1 = document.createElement('label'); lab1.htmlFor = cb1.id; lab1.innerText = label;
                    numBox.appendChild(cb1); numBox.appendChild(lab1); numBox.appendChild(document.createElement('br'));

                    const cb2 = document.createElement('input');
                    cb2.type = 'checkbox'; cb2.checked = true;
                    cb2.id = key + '_TimeCheckbox'; cb2.className = 'timeCarrierCheckbox';
                    const lab2 = document.createElement('label'); lab2.htmlFor = cb2.id; lab2.innerText = label;
                    timeBox.appendChild(cb2); timeBox.appendChild(lab2); timeBox.appendChild(document.createElement('br'));
                });

                const numAll = document.getElementById('delayNumSelectAll');
                const timeAll = document.getElementById('delayTimeSelectAll');
                if (numAll) numAll.addEventListener('change', e => {
                    document.querySelectorAll('.numCarrierCheckbox').forEach(cb => cb.checked = e.target.checked);
                });
                if (timeAll) timeAll.addEventListener('change', e => {
                    document.querySelectorAll('.timeCarrierCheckbox').forEach(cb => cb.checked = e.target.checked);
                });

                const numBtn = document.getElementById('delayNumSubmit');
                const timeBtn = document.getElementById('delayTimeSubmit');
                if (numBtn) numBtn.onclick = displayByDelayNumView;
                if (timeBtn) timeBtn.onclick = displayByDelayTimeView;
            }

            //Wrappers for consistency
            function displayByDelayNum() { displayByDelayNumView(); }
            function displayByDelayTime() { displayByDelayTimeView(); }

            function applyRangeColoring(table, lowest, highest, firstColIsLabel = true) {
                const third = [], twoThird = [], fifth = [], fourfifth = [];
                for (let i = 0; i < highest.length && i < lowest.length; i++) {
                    const d = highest[i] - lowest[i];
                    third.push(lowest[i] + d / 3);
                    twoThird.push(highest[i] - d / 3);
                    fifth.push(lowest[i] + d / 5);
                    fourfifth.push(highest[i] - d / 5);
                }
                for (let r = 1; r < table.rows.length; r++) {
                    for (let c = firstColIsLabel ? 1 : 0; c < table.rows[r].cells.length && (c - (firstColIsLabel ? 1 : 0)) < third.length; c++) {
                        const idx = c - (firstColIsLabel ? 1 : 0);
                        const v = Number(table.rows[r].cells[c].innerText);
                        if (v <= fifth[idx]) {
                            table.rows[r].cells[c].className = (firstColIsLabel) ? 'positive' : 'negative';
                        }
                        else if (v <= third[idx]) {
                            table.rows[r].cells[c].className = (firstColIsLabel) ? 'leanPositive' : 'leanNegative';
                        } else if (v <= twoThird[idx]) {
                            table.rows[r].cells[c].className = 'middle';
                        } else if (v <= fourfifth[idx]) {
                            table.rows[r].cells[c].className = (firstColIsLabel) ? 'leanNegative' : 'leanPositive';
                        } else {
                            table.rows[r].cells[c].className = (firstColIsLabel) ? 'negative' : 'positive';
                        }
                    }
                }
            }

            function summarizeCarrierCounts(key, label) {
                const flights = jsonSample.current.reduce((t, r) => r.carrier === key ? t + (Number(r.arr_flights) || 0) : t, 0);
                const delayFlights = jsonSample.current.reduce((t, r) => r.carrier === key ? t + (Number(r.arr_del15) || 0) : t, 0);
                const lateFlights = jsonSample.current.reduce((t, r) => r.carrier === key ? t + (Number(r.late_aircraft_ct) || 0) : t, 0);
                const cancelled = jsonSample.current.reduce((t, r) => r.carrier === key ? t + (Number(r.arr_cancelled) || 0) : t, 0);
                const diverted = jsonSample.current.reduce((t, r) => r.carrier === key ? t + (Number(r.arr_diverted) || 0) : t, 0);
                const byCarrier = jsonSample.current.reduce((t, r) => r.carrier === key ? t + (Number(r.carrier_ct) || 0) : t, 0);
                const byWeather = jsonSample.current.reduce((t, r) => r.carrier === key ? t + (Number(r.weather_ct) || 0) : t, 0);
                const byNas = jsonSample.current.reduce((t, r) => r.carrier === key ? t + (Number(r.nas_ct) || 0) : t, 0);
                const bySecurity = jsonSample.current.reduce((t, r) => r.carrier === key ? t + (Number(r.security_ct) || 0) : t, 0);
                const byLate = jsonSample.current.reduce((t, r) => r.carrier === key ? t + (Number(r.late_aircraft_ct) || 0) : t, 0);

                const ratePct = flights ? (delayFlights / flights) * 100 : 0;

                const html = `<tr>
    <td>${label}</td>
    <td>${delayFlights}</td>
    <td>${ratePct.toFixed(2)}</td>
    <td>${lateFlights.toFixed(2)}</td>
    <td>${cancelled}</td>
    <td>${diverted}</td>
    <td>${byCarrier.toFixed(2)}</td>
    <td>${byWeather}</td>
    <td>${byNas.toFixed(2)}</td>
    <td>${bySecurity}</td>
    <td>${byLate}</td>
  </tr>`;

                // keep numbers numeric for sorting; only the HTML is formatted
                return [html, label,
                    delayFlights, ratePct, lateFlights, cancelled, diverted,
                    byCarrier, byWeather, byNas, bySecurity, byLate
                ];
            }

            function summarizeCarrierMinutes(key, label) {
                const totalMin = jsonSample.current.reduce((t, r) => r.carrier === key ? t + (Number(r.arr_delay) || 0) : t, 0);
                const carrierMin = jsonSample.current.reduce((t, r) => r.carrier === key ? t + (Number(r.carrier_delay) || 0) : t, 0);
                const weatherMin = jsonSample.current.reduce((t, r) => r.carrier === key ? t + (Number(r.weather_delay) || 0) : t, 0);
                const nasMin = jsonSample.current.reduce((t, r) => r.carrier === key ? t + (Number(r.nas_delay) || 0) : t, 0);
                const securityMin = jsonSample.current.reduce((t, r) => r.carrier === key ? t + (Number(r.security_delay) || 0) : t, 0);
                const lateMin = jsonSample.current.reduce((t, r) => r.carrier === key ? t + (Number(r.late_aircraft_delay) || 0) : t, 0);
                const delayedFlt = jsonSample.current.reduce((t, r) => r.carrier === key ? t + (Number(r.arr_del15) || 0) : t, 0);
                const avgPerDelay = delayedFlt ? Math.round(totalMin / delayedFlt) : 0;

                const html = `<tr>
    <td>${label}</td>
    <td>${totalMin}</td>
    <td>${carrierMin}</td>
    <td>${weatherMin}</td>
    <td>${nasMin}</td>
    <td>${securityMin}</td>
    <td>${lateMin}</td>
    <td>${avgPerDelay}</td>
  </tr>`;

                return [html, label, totalMin, carrierMin, weatherMin, nasMin, securityMin, lateMin, avgPerDelay];
            }


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

            //Div element that holds delay airport checkboxes
            const delayAirportCheckboxes = document.getElementById('delayAirportCheckboxes');
            //Div element that holds delay carrier checkboxes
            const delayCarrierCheckboxes = document.getElementById('delayCarrierCheckboxes');
            const carrierDisplay = document.getElementById('carrierDisplay');
            const delayReasonsDisplay = document.getElementById('delayReasonsDisplay');


            //Iterate over JSON to gather max, min, and other display info
            for (let i = 0; i < jsonSample.current.length; i++) {
                //Check if in the carrierMap and already included
                if (!carrierMap.has(jsonSample.current[i].carrier)) {
                    //Set map that Carrier is accounted for
                    carrierMap.set(jsonSample.current[i].carrier, jsonSample.current[i].carrier_name);
                    //Create Checkbox, label, and break line to include the carrier in a View
                    let checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.id = jsonSample.current[i].carrier + '_CarrierCheckbox';
                    checkbox.name = jsonSample.current[i].carrier + '_CarrierCheckbox';
                    checkbox.className = 'carrierCheckbox';
                    checkbox.checked = true;
                    let label = document.createElement('label');
                    label.htmlFor = jsonSample.current[i].carrier + '_CarrierCheckbox';
                    label.innerText = jsonSample.current[i].carrier_name;
                    carrierCheckboxes.appendChild(checkbox);
                    carrierCheckboxes.appendChild(label);
                    let nextLine = document.createElement('br');
                    carrierCheckboxes.appendChild(nextLine);

                    //Create checkboxes for delay reasons
                    let checkbox1 = document.createElement('input');
                    checkbox1.type = 'checkbox';
                    checkbox1.id = jsonSample.current[i].carrier + '_CarrierDRCheckbox';
                    checkbox1.name = jsonSample.current[i].carrier + '_CarrierDRCheckbox';
                    checkbox1.className = 'delayCarrierCheckbox';
                    checkbox1.checked = true;
                    let label1 = document.createElement('label');
                    label1.htmlFor = jsonSample.current[i].carrier + '_CarrierDRCheckbox';
                    label1.innerText = jsonSample.current[i].carrier_name;
                    delayCarrierCheckboxes.appendChild(checkbox1);
                    delayCarrierCheckboxes.appendChild(label1);
                    let nextLine1 = document.createElement('br');
                    delayCarrierCheckboxes.appendChild(nextLine1);
                }
                //Set map that airport is accounted for
                if (!airportMap.has(jsonSample.current[i].airport)) {
                    airportMap.set(jsonSample.current[i].airport, jsonSample.current[i].airport_name);
                    //Create Checkbox, label, and break line to include the airport in a View
                    let checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.id = jsonSample.current[i].airport + '_AirportDRCheckbox';
                    checkbox.name = jsonSample.current[i].airport_name + '_AirportDRCheckbox';
                    checkbox.className = 'delayAirportCheckbox';
                    checkbox.checked = true;
                    let label = document.createElement('label');
                    label.htmlFor = jsonSample.current[i].airport + '_AirportDRCheckbox';
                    label.innerText = jsonSample.current[i].airport_name;
                    delayAirportCheckboxes.appendChild(checkbox);
                    delayAirportCheckboxes.appendChild(label);
                    let nextLine = document.createElement('br');
                    delayAirportCheckboxes.appendChild(nextLine);
                }
                //Iterate to find max and min range of months
                if (jsonSample.current[i].year < earliestDate[0] || (jsonSample.current[i].year == earliestDate[0] && jsonSample.current[i].month > earliestDate[1])) {
                    earliestDate[0] = jsonSample.current[i].year;
                    earliestDate[1] = jsonSample.current[i].month;
                }
                if (jsonSample.current[i].year >= latestDate[0] || (jsonSample.current[i].year == earliestDate[0] && jsonSample.current[i].month > earliestDate[1])) {
                    latestDate[0] = jsonSample.current[i].year;
                    latestDate[1] = jsonSample.current[i].month;
                }

            }

            initDelayViews();


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
                    //Iterate over all checkboxes to set them to what the select all box isdefaultChecked={true}as
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

                let newTable = document.createElement('table');

                let rowInfo = [];


                //Gather lowest and highest value of each category to use to change value css
                let lowest = new Array(9);
                lowest.fill(Number.MAX_VALUE);
                let highest = new Array(9);
                highest.fill(-1);

                //Summarize relevant data by each carrier
                carrierMap.forEach((value, key) => {
                    const carrierBox = document.getElementById(key + '_CarrierCheckbox');
                    if (carrierBox && carrierBox.checked) {
                        //Make sure all summarized data only added if they are a specific carrier
                        let flights = jsonSample.current.reduce((total, row) => {
                            if (row.carrier === key) {
                                return total + Number(row.arr_flights);
                            }
                            return total;
                        }, 0);

                        let delays = jsonSample.current.reduce((total, row) => {
                            if (row.carrier === key) {
                                return total + Number(row.arr_del15);
                            }
                            return total;
                        }, 0);

                        let carrierIssue = jsonSample.current.reduce((total, row) => {
                            if (row.carrier === key) {
                                return total + Number(row.carrier_ct);
                            }
                            return total;
                        }, 0);

                        let late = jsonSample.current.reduce((total, row) => {
                            if (row.carrier === key) {
                                return total + Number(row.late_aircraft_ct);
                            }
                            return total;
                        }, 0);

                        let cancel = jsonSample.current.reduce((total, row) => {
                            if (row.carrier === key) {
                                return total + Number(row.arr_cancelled);
                            }
                            return total;
                        }, 0);

                        let diverted = jsonSample.current.reduce((total, row) => {
                            if (row.carrier === key) {
                                return total + Number(row.arr_diverted);
                            }
                            return total;
                        }, 0);

                        let delayTime = jsonSample.current.reduce((total, row) => {
                            if (row.carrier === key) {
                                return total + Number(row.arr_delay);
                            }
                            return total;
                        }, 0);

                        let carrierIssueTime = jsonSample.current.reduce((total, row) => {
                            if (row.carrier === key) {
                                return total + Number(row.carrier_delay);
                            }
                            return total;
                        }, 0);

                        let lateDelay = jsonSample.current.reduce((total, row) => {
                            if (row.carrier === key) {
                                return total + Number(row.late_aircraft_delay);
                            }
                            return total;
                        }, 0);

                        //Push the html string and the data to be sorted into an array
                        rowInfo.push([`<tr>
      <td>${value}</td>
      <td>${flights}</td>
      <td>${delays}</td>
      <td>${delayTime}</td>
      <td>${late.toFixed(2)}</td>
      <td>${lateDelay}</td>
      <td>${cancel}</td>
      <td>${diverted}</td>
      <td>${carrierIssue.toFixed(2)}</td>
      <td>${carrierIssueTime}</td>
      </tr>`, value, flights, delays, delayTime,
                            late, lateDelay, cancel, diverted,
                        carrierIssue.toFixed(2), carrierIssueTime]);

                        let row = [flights, delays, delayTime, late, lateDelay, cancel, diverted, carrierIssue, carrierIssueTime];

                        //Update highest and lowest information of all columns
                        for (let i = 0; i < row.length; i++) {

                            if (row[i] < lowest[i]) {
                                lowest[i] = row[i];
                            }
                            if (row[i] > highest[i]) {
                                highest[i] = row[i];
                            }
                        }
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
                    carrierDisplay.innerHTML = `<table className='dataTable'>
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

                    let table = carrierDisplay.childNodes[0];

                    let third = [];
                    let fifth = [];
                    let fourfifth = [];
                    let twoThird = [];

                    for (let i = 0; i < highest.length && i < lowest.length; i++) {
                        let difference = highest[i] - lowest[i];
                        fifth.push(lowest[i] + difference / 5);
                        third.push(lowest[i] + difference / 3);
                        twoThird.push(highest[i] - difference / 3);
                        fourfifth.push(highest[i] - difference / 5);
                    }
                    for (let i = 1; i < table.rows.length; i++) {
                        //Skip over carrier name and change value color to each column's range
                        for (let j = 1; j < table.rows[i].cells.length && j - 1 < third.length; j++) {
                            const cell = table.rows[i].cells[j];
                            if (Number(cell.innerText) <= fifth[j - 1]) {
                                if (j == 1) {
                                    cell.className = 'negative';
                                }
                                else {
                                    cell.className = 'positive';
                                }
                            }
                            else if (Number(cell.innerText) <= third[j - 1]) {
                                if (j == 1) {
                                    cell.className = 'leanNegative';
                                }
                                else {
                                    cell.className = 'leanPositive';
                                }
                            }
                            else if (Number(cell.innerText) <= twoThird[j - 1]) {
                                cell.className = 'middle';
                            }
                            else if (Number(cell.innerText) <= fourfifth[j - 1]) {
                                if (j == 1) {
                                    cell.className = 'leanPositive';
                                }
                                else {
                                    cell.className = 'leanNegative';
                                }
                            }
                            else {
                                if (j == 1) {
                                    cell.className = 'positive';
                                }
                                else {
                                    cell.className = 'negative';
                                }
                            }
                        }
                    }
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
                return array;
            }

            //Month inputs for the range of months accounted for in delayReasons
            const delayBeginMonth = document.getElementById('delayBeginMonth');
            const delayEndMonth = document.getElementById('delayEndMonth');
            //Month inputs for date view
            const dateBeginMonth = document.getElementById('dateBeginMonth')
            const dateEndMonth = document.getElementById('dateEndMonth');

            //Find the latest and earliest date in the current JSON
            if (delayBeginMonth && delayEndMonth && dateBeginMonth && dateEndMonth) {
                if (latestDate[1] < 10) {
                    delayBeginMonth.max = `${latestDate[0]}-0${latestDate[1]}`;
                    delayEndMonth.max = `${latestDate[0]}-0${latestDate[1]}`;
                    delayEndMonth.value = `${latestDate[0]}-0${latestDate[1]}`;

                    dateBeginMonth.max = `${latestDate[0]}-0${latestDate[1]}`;
                    dateEndMonth.max = `${latestDate[0]}-0${latestDate[1]}`;
                    dateEndMonth.value = `${latestDate[0]}-0${latestDate[1]}`;
                }
                else {
                    delayBeginMonth.max = `${latestDate[0]}-${latestDate[1]}`;
                    delayEndMonth.max = `${latestDate[0]}-${latestDate[1]}`;
                    delayEndMonth.value = `${latestDate[0]}-${latestDate[1]}`;

                    dateBeginMonth.max = `${latestDate[0]}-${latestDate[1]}`;
                    dateEndMonth.max = `${latestDate[0]}-${latestDate[1]}`;
                    dateEndMonth.value = `${latestDate[0]}-${latestDate[1]}`;
                }
                if (earliestDate[1] < 10) {
                    delayBeginMonth.min = `${earliestDate[0]}-0${earliestDate[1]}`;
                    delayEndMonth.min = `${earliestDate[0]}-0${earliestDate[1]}`;
                    delayBeginMonth.value = `${earliestDate[0]}-0${earliestDate[1]}`;

                    dateBeginMonth.min = `${earliestDate[0]}-0${earliestDate[1]}`;
                    dateEndMonth.min = `${earliestDate[0]}-0${earliestDate[1]}`;
                    dateBeginMonth.value = `${earliestDate[0]}-0${earliestDate[1]}`;
                } else {
                    delayBeginMonth.min = `${earliestDate[0]}-${earliestDate[1]}`;
                    delayEndMonth.min = `${earliestDate[0]}-${earliestDate[1]}`;
                    delayBeginMonth.value = `${earliestDate[0]}-${earliestDate[1]}`;

                    dateBeginMonth.min = `${earliestDate[0]}-${earliestDate[1]}`;
                    dateEndMonth.min = `${earliestDate[0]}-${earliestDate[1]}`;
                    dateBeginMonth.value = `${earliestDate[0]}-${earliestDate[1]}`;
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
                    newArray = jsonSample.current.filter((row) => {
                        return (Number(row.year) > min[0] || (Number(row.year) == min[0] && Number(row.month) >= min[1])) && (Number(row.year) < max[0] || (Number(row.year) == max[0] && Number(row.month) <= max[1]));
                    });
                }

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

                //Gather lowest and highest value of each category to use to change value css
                let lowest = new Array(10);
                lowest.fill(Number.MAX_VALUE);
                let highest = new Array(10);
                highest.fill(-1);

                //For allDelays summarize all delay reasons data
                if (delayReasonsSelect.value === 'allDelays') {
                    carrierDelay = newArray.reduce((total, row) => {
                        return total + Number(row.carrier_ct);
                    }, 0);

                    carrierTime = newArray.reduce((total, row) => {
                        return total + Number(row.carrier_delay);
                    }, 0);

                    weatherDelay = newArray.reduce((total, row) => {
                        return total + Number(row.weather_ct);
                    }, 0);

                    weatherTime = newArray.reduce((total, row) => {
                        return total + Number(row.weather_delay);
                    }, 0);

                    trafficDelay = newArray.reduce((total, row) => {
                        return total + Number(row.nas_ct);
                    }, 0);

                    trafficTime = newArray.reduce((total, row) => {
                        return total + Number(row.nas_delay);
                    }, 0);

                    securityDelay = newArray.reduce((total, row) => {
                        return total + Number(row.security_ct);
                    }, 0);

                    securityTime = newArray.reduce((total, row) => {
                        return total + Number(row.security_delay);
                    }, 0);

                    lateDelay = newArray.reduce((total, row) => {
                        return total + Number(row.late_aircraft_ct);
                    }, 0);

                    lateTime = newArray.reduce((total, row) => {
                        return total + Number(row.late_aircraft_delay);
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
                                    return total + Number(row.carrier_ct);
                                return total;
                            }, 0);

                            carrierTime = newArray.reduce((total, row) => {
                                if (row.airport === key)
                                    return total + Number(row.carrier_delay);
                                return total;
                            }, 0);

                            weatherDelay = newArray.reduce((total, row) => {
                                if (row.airport === key)
                                    return total + Number(row.weather_ct);
                                return total;
                            }, 0);

                            weatherTime = newArray.reduce((total, row) => {
                                if (row.airport === key)
                                    return total + Number(row.weather_delay);
                                return total;
                            }, 0);

                            trafficDelay = newArray.reduce((total, row) => {
                                if (row.airport === key)
                                    return total + Number(row.nas_ct);
                                return total;
                            }, 0);

                            trafficTime = newArray.reduce((total, row) => {
                                if (row.airport === key)
                                    return total + Number(row.nas_delay);
                                return total;
                            }, 0);

                            securityDelay = newArray.reduce((total, row) => {
                                if (row.airport === key)
                                    return total + Number(row.security_ct);
                                return total;
                            }, 0);

                            securityTime = newArray.reduce((total, row) => {
                                if (row.airport === key)
                                    return total + Number(row.security_delay);
                                return total;
                            }, 0);

                            lateDelay = newArray.reduce((total, row) => {
                                if (row.airport === key)
                                    return total + Number(row.late_aircraft_ct);
                                return total;
                            }, 0);

                            lateTime = newArray.reduce((total, row) => {
                                if (row.airport === key)
                                    return total + Number(row.late_aircraft_delay);
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
                            let row = [carrierDelay, carrierTime, weatherDelay, weatherTime, trafficDelay, trafficTime, securityDelay, securityTime, lateDelay, lateTime];

                            //Update highest and lowest information of all columns
                            for (let i = 0; i < row.length; i++) {

                                if (row[i] < lowest[i]) {
                                    lowest[i] = row[i];
                                }
                                if (row[i] > highest[i]) {
                                    highest[i] = row[i];
                                }
                            }
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
                                    return total + Number(row.carrier_ct);
                                return total;
                            }, 0);

                            carrierTime = newArray.reduce((total, row) => {
                                if (row.carrier === key)
                                    return total + Number(row.carrier_delay);
                                return total;
                            }, 0);

                            weatherDelay = newArray.reduce((total, row) => {
                                if (row.carrier === key)
                                    return total + Number(row.weather_ct);
                                return total;
                            }, 0);

                            weatherTime = newArray.reduce((total, row) => {
                                if (row.carrier === key)
                                    return total + Number(row.weather_delay);
                                return total;
                            }, 0);

                            trafficDelay = newArray.reduce((total, row) => {
                                if (row.carrier === key)
                                    return total + Number(row.nas_ct);
                                return total;
                            }, 0);

                            trafficTime = newArray.reduce((total, row) => {
                                if (row.carrier === key)
                                    return total + Number(row.nas_delay);
                                return total;
                            }, 0);

                            securityDelay = newArray.reduce((total, row) => {
                                if (row.carrier === key)
                                    return total + Number(row.security_ct);
                                return total;
                            }, 0);

                            securityTime = newArray.reduce((total, row) => {
                                if (row.carrier === key)
                                    return total + Number(row.security_delay);
                                return total;
                            }, 0);

                            lateDelay = newArray.reduce((total, row) => {
                                if (row.carrier === key)
                                    return total + Number(row.late_aircraft_ct);
                                return total;
                            }, 0);

                            lateTime = newArray.reduce((total, row) => {
                                if (row.carrier === key)
                                    return total + Number(row.late_aircraft_delay);
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

                            let row = [carrierDelay, carrierTime, weatherDelay, weatherTime, trafficDelay, trafficTime, securityDelay, securityTime, lateDelay, lateTime];

                            //Update highest and lowest information of all columns
                            for (let i = 0; i < row.length; i++) {

                                if (row[i] < lowest[i]) {
                                    lowest[i] = row[i];
                                }
                                if (row[i] > highest[i]) {
                                    highest[i] = row[i];
                                }
                            }
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
                    delayReasonsDisplay.innerHTML = `<table className='dataTable'>
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
                    delayReasonsDisplay.innerHTML = `<table className='dataTable'>
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
                    delayReasonsDisplay.innerHTML = `<table className='dataTable'>
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

                if (delayReasonsSelect.value != 'allDelays') {
                    let table = delayReasonsDisplay.childNodes[0];

                    let third = [];
                    let fifth = [];
                    let fourfifth = [];
                    let twoThird = [];

                    for (let i = 0; i < highest.length && i < lowest.length; i++) {
                        let difference = highest[i] - lowest[i];
                        fifth.push(lowest[i] + difference / 5);
                        third.push(lowest[i] + difference / 3);
                        twoThird.push(highest[i] - difference / 3);
                        fourfifth.push(highest[i] - difference / 5);
                    }
                    for (let i = 1; i < table.rows.length; i++) {
                        //Skip over carrier name and change value color to each column's range
                        for (let j = 1; j < table.rows[i].cells.length && j - 1 < third.length; j++) {
                            const cell = table.rows[i].cells[j];
                            if (Number(cell.innerText) <= fifth[j - 1]) {
                                cell.className = 'positive';
                            }
                            else if (Number(cell.innerText) <= third[j - 1]) {
                                cell.className = 'leanPositive';
                            }
                            else if (Number(cell.innerText) <= twoThird[j - 1]) {
                                cell.className = 'middle';
                            }
                            else if (Number(cell.innerText) <= fourfifth[j - 1]) {
                                cell.className = 'leanNegative';
                            }
                            else {
                                cell.className = 'negative';
                            }
                        }
                    }
                }
            }
            //Pamela

            const dateSubmit = document.getElementById('dateSubmit');
            const flightNumSubmit = document.getElementById('flightNumSubmit');


            function displayFlightsByDate() {
                let lowest = new Array(9);
                let highest = new Array(9);
                lowest.fill(Number.MAX_VALUE);
                highest.fill(-1);

                let newArray;
                //Alert user if invalid date range is entered and don't display
                if (dateBeginMonth.value > dateEndMonth.value) {
                    alert('Month range cannot set the starting month greater than the ending month');
                    return;
                }
                //Otherwise filter data to only include those in the date range
                else {
                    let max = dateEndMonth.value.split('-');
                    max = [Number(max[0]), Number(max[1])];
                    let min = dateBeginMonth.value.split('-');
                    min = [Number(min[0]), Number(min[1])];
                    newArray = jsonSample.current.filter((row) => {
                        return (Number(row.year) > min[0] || (Number(row.year) == min[0] && Number(row.month) >= min[1])) && (Number(row.year) < max[0] || (Number(row.year) == max[0] && Number(row.month) <= max[1]));
                    });
                }

                // Sort flights by year and then by month
                const sortedFlights = newArray.sort((a, b) => {
                    if (a.year !== b.year) {
                        return a.year - b.year;
                    }
                    return a.month - b.month;
                });

                newArray.forEach((flight) => {
                    let temp = [];
                    temp.push(flight.arr_flights, flight.arr_del15, flight.carrier_ct, flight.weather_ct, flight.nas_ct,
                        flight.security_ct, flight.late_aircraft_ct, flight.arr_cancelled, flight.arr_diverted);
                    for (let i = 0; i < temp.length; i++) {
                        if (temp[i] < lowest[i]) {
                            lowest[i] = temp[i];
                        }
                        if (temp[i] > highest[i]) {
                            highest[i] = temp[i];
                        }
                    }
                });

                // Create and append HTML elements for each flight
                displayFlightItems(sortedFlights, 'dateDisplay', lowest, highest);
            }

            const flightNumEnd = document.getElementById('flightNumEnd');
            const flightNumBegin = document.getElementById('flightNumBegin');

            //Make sure negative values and unneccessary 0s are removed
            flightNumBegin.addEventListener('change', () => {
                if (flightNumBegin.value == '' || flightNumBegin.value == null || Number(flightNumBegin.value) < 0) flightNumBegin.value = 0;
                else {
                    flightNumBegin.value = Number(flightNumBegin.value);
                }
            })

            flightNumEnd.addEventListener('change', () => {
                if (flightNumEnd.value == '' || flightNumEnd.value == null || Number(flightNumEnd.value) < 0) flightNumEnd.value = 0;
                else {
                    flightNumEnd.value = Number(flightNumEnd.value);
                }

            })

            function displayByFlightNum() {
                let lowest = new Array(9);
                let highest = new Array(9);
                lowest.fill(Number.MAX_VALUE);
                highest.fill(-1);

                if (flightNumBegin && flightNumEnd) {
                    if (flightNumBegin.value == null || flightNumEnd == null) {
                        alert('Flight Number Range not Entered');
                        return;
                    }
                    console.log(flightNumBegin.value)
                    console.log(flightNumEnd.value)
                    if (Number(flightNumBegin.value) > Number(flightNumEnd.value)) {
                        alert('Flight Number Range is Invalid');
                        return;
                    }

                }
                else return;

                let filteredArr = jsonSample.current.filter((row) => {
                    return Number(row.arr_flights) >= flightNumBegin.value && Number(row.arr_flights) <= flightNumEnd.value;
                });

                const sortedFlights = filteredArr.sort((a, b) => {
                    if (Number(a.arr_flights) !== Number(b.arr_flights)) {
                        return Number(a.arr_flights) - Number(b.arr_flights);
                    }
                });

                sortedFlights.forEach((flight) => {
                    let temp = [];
                    temp.push(flight.arr_flights, flight.arr_del15, flight.carrier_ct, flight.weather_ct, flight.nas_ct,
                        flight.security_ct, flight.late_aircraft_ct, flight.arr_cancelled, flight.arr_diverted);
                    for (let i = 0; i < temp.length; i++) {
                        if (temp[i] < lowest[i]) {
                            lowest[i] = temp[i];
                        }
                        if (temp[i] > highest[i]) {
                            highest[i] = temp[i];
                        }
                    }
                });

                displayFlightItems(sortedFlights, 'flightNumDisplay', lowest, highest);
            }

            // helper function for showing flight list
            function displayFlightItems(sortedFlights, id, lowest, highest) {

                // Get the container element
                const flightList = document.getElementById(id);

                // Clear any existing content
                flightList.innerHTML = '';
                let htmlString = `<table className='dataTable'>
  <tr>
  <th>Month</th>
  <th>Year</th>
  <th>Carrier</th>
  <th>Airport</th>
  <th>Flights</th>
  <th>Delays</th>
  <th>Carrier Delays</th>
  <th>Weather Delays</th>
  <th>Traffic Delays</th>
  <th>Security Delays</th>
  <th>Late Arrival</th>
  <th>Cancelled</th>
  <th>Diverted Arrival</th>
  </tr>`;

                sortedFlights.forEach(flight => {
                    htmlString += `<tr>
    <td>${flight.month}</td>
    <td>${flight.year}</td>
    <td>${flight.carrier_name}</td>
    <td>${flight.airport_name}</td>
    <td>${flight.arr_flights}</td>
    <td>${flight.arr_del15}</td>
    <td>${flight.carrier_ct}</td>
    <td>${flight.weather_ct}</td>
    <td>${flight.nas_ct}</td>
    <td>${flight.security_ct}</td>
    <td>${flight.late_aircraft_ct}</td>
    <td>${flight.arr_cancelled}</td>
    <td>${flight.arr_diverted}</td>
    </tr>`;
                });
                htmlString += '</table>';
                flightList.innerHTML = htmlString;

                let table = flightList.childNodes[0];

                let third = [];
                let fifth = [];
                let fourfifth = [];
                let twoThird = [];

                for (let i = 0; i < highest.length && i < lowest.length; i++) {
                    let difference = highest[i] - lowest[i];
                    fifth.push(lowest[i] + difference / 5);
                    third.push(lowest[i] + difference / 3);
                    twoThird.push(highest[i] - difference / 3);
                    fourfifth.push(highest[i] - difference / 5);
                }
                for (let i = 1; i < table.rows.length; i++) {
                    //Skip over carrier name and change value color to each column's range
                    for (let j = 4; j < table.rows[i].cells.length && j - 4 < third.length; j++) {
                        const cell = table.rows[i].cells[j];
                        if (Number(cell.innerText) <= fifth[j - 4]) {
                            if (j == 4) {
                                cell.className = 'negative'
                            }
                            else {
                                cell.className = 'positive';
                            }

                        }
                        else if (Number(cell.innerText) <= third[j - 4]) {
                            if (j == 4) {
                                cell.className = 'leanNegative'
                            }
                            else {
                                cell.className = 'leanPositive';
                            }
                        }
                        else if (Number(cell.innerText) <= twoThird[j - 4]) {
                            cell.className = 'middle';
                        }
                        else if (Number(cell.innerText) <= fourfifth[j - 4]) {
                            if (j == 4) {
                                cell.className = 'leanPositive'
                            }
                            else {
                                cell.className = 'leanNegative';
                            }
                        }
                        else {
                            if (j == 4) {
                                cell.className = 'positive'
                            }
                            else {
                                cell.className = 'negative';
                            }
                        }
                    }
                }
            }

            dateSubmit.addEventListener('click', displayFlightsByDate);
            flightNumSubmit.addEventListener('click', displayByFlightNum);
            setDataChanged(false);
            setFirstRender(false);
        }
    }, [dataChanged, firstRender]);



    return (
        <>
            <div className="bannerHeader">
                <div className="row">
                    <h1>Airport Flight Data</h1>
                    <div className="bannerContainer">
                    </div>
                </div>
            </div>

            <div id="dataViewElements" className="filterElements">
                <div id="numFlightView">

                </div>

            </div>


            <div id="carrierView" className="box">
                <h2>Data by Carrier</h2>
                <div id="carrierCheckboxes">
                    <input type="checkbox" defaultChecked={true} id="carrierSelectAll" name="carrierSelectAll"></input>
                    <label htmlFor="carrierSelectAll">Select All</label> <br />
                </div>
                <label htmlFor="carrierOrderBy">Order By:</label>
                <div className="toolRow">
                    <select name="carrierOrderBy" id="carrierOrderBy" defaultValue={'carrierName'}>
                        <option value="carrierName">Carrier Name</option>
                        <option value="carrierFlights">Flights</option>
                        <option value="carrierDelayFlights">Delay Flights</option>
                        <option value="carrierDelayTime">Delay Time</option>
                        <option value="carrierLateFlights">Late Flights</option>
                        <option value="carrierLateTime">Late Time</option>
                        <option value="carrierCancelled">Cancelled Flights</option>
                        <option value="carrierDiverted">Diverted Flights</option>
                        <option value="carrierByDelay">Delays by Carrier</option>
                        <option value="carrierByDelayTime">Delay Time by Carrier</option>
                    </select>

                    <select name="carrierAscension" id="carrierAscension" defaultValue={'0'}>
                        <option value="0" >Ascending</option>
                        <option value="1">Descending</option>
                    </select>
                    <button id="carrierSubmit">Submit</button>
                </div>
                <div id="carrierDisplay"></div>
            </div>


            <div id="delayReasonsView" className="box">
                <h2>Data by Delay Reasons</h2>
                <label htmlFor="carrierOrderBy">Order By:</label>
                <select name="delayReasonsSelect" id="delayReasonsSelect" defaultValue={'allDelays'}>
                    <option value="allDelays">All Data</option>
                    <option value="airportDelays">Airport</option>
                    <option value="carrierDelays">Carrier</option>
                </select>

                <div id="delayAirportCheckboxes">
                    <h3>Airports</h3>
                    <input type="checkbox" defaultChecked={true} id="delayAirportSelectAll" name="delayAirportSelectAll"></input>
                    <label htmlFor="delayAirportSelectAll">Select All</label> <br />
                </div>

                <div id="delayCarrierCheckboxes">
                    <h3>Carriers</h3>
                    <input type="checkbox" defaultChecked={true} id="delayCarrierSelectAll" name="delayCarrierSelectAll"></input>
                    <label htmlFor="delayCarrierSelectAll">Select All</label> <br />
                </div>
                <div className="toolRow">
                    <label htmlFor="delayBeginMonth">Time Range: </label>
                    <input type="month" name="delayBeginMonth" id="delayBeginMonth" />
                    to
                    <input type="month" name="delayEndMonth" id="delayEndMonth" />
                    <button id="delayReasonsSubmit">Submit</button>
                </div>
                <div id="delayReasonsDisplay"></div>
            </div>

            <div id="delayNumSection" className="box">
                <h2>Data by Number of Delays</h2>

                <label><input type="checkbox" id="delayNumSelectAll"defaultChecked={true}/> Select All</label>
                <div className="toolRow">
                    <label>Order By:</label>
                    <select id="delayNumOrderBy">
                        <option value="carrierName">Carrier Name</option>
                        <option value="carrierFlights">Flights</option>
                        <option value="carrierDelayFlights">Delay Flights</option>
                        <option value="carrierDelayTime">Delay Time</option>
                        <option value="carrierLateFlights">Late Flights</option>
                        <option value="carrierLateTime">Late Time</option>
                        <option value="carrierCancelled">Cancelled Flights</option>
                        <option value="carrierDiverted">Diverted Flights</option>
                        <option value="carrierByDelay">Delays by Carrier</option>
                        <option value="carrierByDelayTime">Delay Time by Carrier</option>
                    </select>
                    <select id="delayNumAscension" defaultValue={'0'}>
                        <option value="0" >Ascending</option>
                        <option value="1">Descending</option>
                    </select>
                    <button id="delayNumSubmit">Submit</button>
                </div>

                <div id="delayNumCarrierCheckboxes"></div>
                <div id="delayNumDisplay"></div>
            </div>

            <div id="delayTimeSection" className="box">
                <h2>Data by Time of Delays</h2>

                <label><input type="checkbox" id="delayTimeSelectAll"defaultChecked={true}/> Select All</label>
                <div className="toolRow">
                    <label>Order By:</label>
                    <select id="delayTimeOrderBy">
                        <option value="carrierName">Carrier Name</option>
                        <option value="carrierFlights">Flights</option>
                        <option value="carrierDelayFlights">Delay Flights</option>
                        <option value="carrierDelayTime">Delay Time</option>
                        <option value="carrierLateFlights">Late Flights</option>
                        <option value="carrierLateTime">Late Time</option>
                        <option value="carrierCancelled">Cancelled Flights</option>
                        <option value="carrierDiverted">Diverted Flights</option>
                        <option value="carrierByDelay">Delays by Carrier</option>
                        <option value="carrierByDelayTime">Delay Time by Carrier</option>
                    </select>
                    <select id="delayTimeAscension" defaultValue={'0'}>
                        <option value="0" >Ascending</option>
                        <option value="1">Descending</option>
                    </select>
                    <button id="delayTimeSubmit">Submit</button>
                </div>

                <div id="delayTimeCarrierCheckboxes"></div>
                <div id="delayTimeDisplay"></div>
            </div>

            <div id="dateView" className="box">
                <h2>Flight Data by Date</h2>
                <div className="toolRow">
                    <label htmlFor="dateBeginMonth">Time Range: </label>
                    <input type="month" name="dateBeginMonth" id="dateBeginMonth" />
                    to
                    <input type="month" name="dateEndMonth" id="dateEndMonth" />
                    <button id="dateSubmit">Submit</button>
                </div>
                <div id="dateDisplay">
                </div>
            </div>

            <div id="flightNumView" className="box">
                <h2>Data by Number of Flights</h2>

                <div className="toolRow">
                    <label htmlFor="flightNumBegin">Range of Number of Flights: </label>
                    <input type="number" name="flightNumBegin" id="flightNumBegin" min="0" step="10" defaultValue={0} />
                    to
                    <input type="number" name="flightNumEnd" id="flightNumEnd" min="0" step="10" defaultValue={10000} />
                    <button id="flightNumSubmit">Submit</button>
                </div>
                <div id="flightNumDisplay">
                </div>
            </div>

        </>
    );
}