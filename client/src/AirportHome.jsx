import { useEffect, useState, useLayoutEffect, useRef } from "react";
import { Rankings } from './Rankings';
import { Filters } from "./Filters";
import { Prediction } from "./Prediction";
import  GeolocationRecommendation  from "./GeolocationRecommendation";

export function AirportHome({ jsonSample, dataChanged, setDataChanged, carrierMap, airportMap }) {
    //Add states or refs here that may have to be props that are shared between components
    const filteredData = useRef(jsonSample.current);
    const [newFilter, setNewFilter] = useState(false)
    const latestDate = useRef([0, 0]);
    const earliestDate = useRef([9999, 32]);
    const [firstRender, setFirstRender] = useState(true);

    //To be ran only on intialization of the DOM once. 
    useLayoutEffect(() => {
        if ((dataChanged || firstRender) && Array.isArray(jsonSample.current) && jsonSample.current.length > 0) {
            //Iterate over JSON to gather max, min, and other display info
            for (let i = 0; i < jsonSample.current.length; i++) {
                //Check if in the carrierMap.current and already included
                if (!carrierMap.current.has(jsonSample.current[i].carrier)) {
                    //Set map that Carrier is accounted for
                    carrierMap.current.set(jsonSample.current[i].carrier, jsonSample.current[i].carrier_name);
                }
                //Set map that airport is accounted for
                if (!airportMap.current.has(jsonSample.current[i].airport)) {
                    airportMap.current.set(jsonSample.current[i].airport, jsonSample.current[i].airport_name);
                }
                //Iterate to find max and min range of months
                if (jsonSample.current[i].year < earliestDate.current[0] || (jsonSample.current[i].year == earliestDate.current[0] && jsonSample.current[i].month < earliestDate.current[1])) {
                    earliestDate.current[0] = jsonSample.current[i].year;
                    earliestDate.current[1] = jsonSample.current[i].month;
                }
                if (jsonSample.current[i].year >= latestDate.current[0] || (jsonSample.current[i].year == earliestDate.current[0] && jsonSample.current[i].month > earliestDate.current[1])) {
                    latestDate.current[0] = jsonSample.current[i].year;
                    latestDate.current[1] = jsonSample.current[i].month;
                }
            }

            // Set sticky date inputs to the earliest and latest months found in the data
            try {
                const beginInput = document.getElementById('dateBeginMonth');
                const endInput = document.getElementById('dateEndMonth');
                const display = document.getElementById('dateDisplay');

                const validEarliest = earliestDate.current[0] !== 9999 && earliestDate.current[1] >= 1 && earliestDate.current[1] <= 12;
                const validLatest = latestDate.current[0] !== 0 || latestDate.current[1] !== 0;

                function fmt([y, m]) {
                    if (!y || !m) return '';
                    const mm = String(m).padStart(2, '0');
                    return `${y}-${mm}`;
                }

                if (beginInput && validEarliest) beginInput.value = fmt(earliestDate.current);
                if (endInput && validLatest) endInput.value = fmt(latestDate.current);
                if (display && validEarliest && validLatest) display.textContent = `Showing rankings for ${fmt(earliestDate.current)} to ${fmt(latestDate.current)}`;
            } catch (e) {
                // DOM may not be ready yet; safe to ignore
                console.warn('Could not set date inputs automatically', e);
            }
            setDataChanged(false);
            //Cause all data dependent sections to initialize
            filteredData.current = jsonSample.current;
            setNewFilter(true);
            setFirstRender(false);
        }
    }, [dataChanged, firstRender]);

    // Handle date-range submit from the sticky footer
    useEffect(() => {
        const submitBtn = document.getElementById('dateSubmit');
        const beginInput = document.getElementById('dateBeginMonth');
        const endInput = document.getElementById('dateEndMonth');
        const display = document.getElementById('dateDisplay');

        function monthToIndex(monthStr) {
            // monthStr expected in format "YYYY-MM" from <input type="month">
            if (!monthStr || monthStr.trim() === '') return null;
            const parts = monthStr.split('-');
            if (parts.length !== 2) return null;
            const y = Number(parts[0]);
            const m = Number(parts[1]);
            if (Number.isNaN(y) || Number.isNaN(m)) return null;
            return y * 12 + (m - 1);
        }

        function onDateSubmit() {
            const beginVal = beginInput ? beginInput.value : '';
            const endVal = endInput ? endInput.value : '';
            const beginIndex = monthToIndex(beginVal);
            const endIndex = monthToIndex(endVal);

            if (beginIndex !== null && endIndex !== null && beginIndex > endIndex) {
                alert('Invalid date range: start is after end');
                return;
            }

            // Base data: use the current filteredData (so date range composes with other filters)
            const base = filteredData.current && filteredData.current.length ? filteredData.current : jsonSample.current;

            const newFiltered = base.filter((row) => {
                // Expect row to have `year` and `month` numeric fields
                if (typeof row.year !== 'number' || typeof row.month !== 'number') return false;
                const rowIndex = row.year * 12 + (row.month - 1);
                if (beginIndex !== null && rowIndex < beginIndex) return false;
                if (endIndex !== null && rowIndex > endIndex) return false;
                return true;
            });

            filteredData.current = newFiltered;
            // show selection to user
            if (display) {
                const b = beginVal || 'earliest';
                const e = endVal || 'latest';
                display.textContent = `Showing rankings for ${b} to ${e}`;
            }

            // Trigger ranking recompute
            setNewFilter(true);
            // Also signal dataChanged to let Filters update their UI if needed
            setDataChanged((prev) => !prev);
        }

        if (submitBtn) submitBtn.addEventListener('click', onDateSubmit);

        return () => {
            if (submitBtn) submitBtn.removeEventListener('click', onDateSubmit);
        };
    }, [filteredData, jsonSample, setNewFilter, setDataChanged]);

    //Insert your components here!
    return (<>
        <div className="bannerHeader">
            <div className="row">
                <h1>Dashboard</h1>
                <div className="bannerContainer">
                </div>
            </div>
        </div>
        <Rankings dataChanged={dataChanged} filteredData={filteredData} newFilter={newFilter} setNewFilter={setNewFilter} carrierMap={carrierMap} airportMap={airportMap} />
        <GeolocationRecommendation jsonSample={jsonSample} filteredData={filteredData} newFilter={newFilter}/>
        <Prediction jsonSample={jsonSample} carrierMap={carrierMap} airportMap={airportMap} earliestDate={earliestDate} latestDate={latestDate} filteredData={filteredData} />
        <Filters setNewFilter={setNewFilter} dataChanged={dataChanged} jsonSample={jsonSample}
            carrierMap={carrierMap} airportMap={airportMap} filteredData={filteredData} setDataChanged={setDataChanged}></Filters>
        <div className="sticky-bottom">
            <p align="center"><strong>Date range select</strong></p>
            <div className="toolRow">
                <input type="month" name="dateBeginMonth" id="dateBeginMonth" />
                to
                <input type="month" name="dateEndMonth" id="dateEndMonth" />
                <button id="dateSubmit">Submit</button>
            </div>
            <div id="dateDisplay"></div>
        </div>
    </>);
}