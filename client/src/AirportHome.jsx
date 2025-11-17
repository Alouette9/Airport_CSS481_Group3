import { useEffect, useState, useLayoutEffect, useRef } from "react";
import { Rankings } from './Rankings';
import { Filters } from "./Filters";
import { Prediction } from "./Prediction";

export function AirportHome({ jsonSample, dataChanged, setDataChanged }) {
    //Add states or refs here that may have to be props that are shared between components
    const carrierMap = useRef(new Map());
    const airportMap = useRef(new Map());
    const filteredData = useRef(jsonSample.current);
    const [newFilter, setNewFilter] = useState(false)
    const latestDate = useRef([0, 0]);
    const earliestDate = useRef([9999, 32]);
    const [firstRender, setFirstRender] = useState(true);

    //To be ran only on intialization of the DOM once. 
    useLayoutEffect(() => {
        if (dataChanged || firstRender) {
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
        const beginRange = document.getElementById('dateBeginRange');
        const endRange = document.getElementById('dateEndRange');
        const display = document.getElementById('dateDisplay');

        function indexToMonthStr(index) {
            if (index === null || index === undefined || Number.isNaN(Number(index))) return '';
            const idx = Number(index);
            const y = Math.floor(idx / 12);
            const m = (idx % 12) + 1;
            return `${y}-${String(m).padStart(2, '0')}`;
        }

        function onDateSubmit() {
            let beginIndex = null;
            let endIndex = null;
            if (beginRange && endRange) {
                beginIndex = Number(beginRange.value);
                endIndex = Number(endRange.value);
            }

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
                const b = beginIndex !== null ? indexToMonthStr(beginIndex) : 'earliest';
                const e = endIndex !== null ? indexToMonthStr(endIndex) : 'latest';
                display.textContent = `Showing rankings for ${b} to ${e}`;
            }

            // Trigger ranking recompute
            setNewFilter(true);
            // Also signal dataChanged to let Filters update their UI if needed
            setDataChanged((prev) => !prev);
        }

        function onRangeInput() {
            const beginIndex = beginRange ? Number(beginRange.value) : null;
            const endIndex = endRange ? Number(endRange.value) : null;
            const beginLabel = document.getElementById('dateBeginLabel');
            const endLabel = document.getElementById('dateEndLabel');
            if (beginLabel) beginLabel.textContent = beginIndex !== null ? indexToMonthStr(beginIndex) : '';
            if (endLabel) endLabel.textContent = endIndex !== null ? indexToMonthStr(endIndex) : '';
            if (display) {
                const b = beginIndex !== null ? indexToMonthStr(beginIndex) : 'earliest';
                const e = endIndex !== null ? indexToMonthStr(endIndex) : 'latest';
                display.textContent = `Showing rankings for ${b} to ${e}`;
            }
            // Visual: draw a filled track between the two handles
            try {
                if (beginRange && endRange) {
                    const min = Number(beginRange.min);
                    const max = Number(beginRange.max);
                    const a = Number(beginRange.value);
                    const b = Number(endRange.value);
                    const startPct = ((Math.min(a, b) - min) / (max - min)) * 100;
                    const endPct = ((Math.max(a, b) - min) / (max - min)) * 100;
                    const trackColor = '#C6C6C6';
                    const fillColor = '#387bbe';
                    const gradient = `linear-gradient(90deg, ${trackColor} 0%, ${trackColor} ${startPct}%, ${fillColor} ${startPct}%, ${fillColor} ${endPct}%, ${trackColor} ${endPct}%, ${trackColor} 100%)`;
                    beginRange.style.background = gradient;
                    endRange.style.background = gradient;
                }
            } catch (err) {
                // ignore if any calculation fails
            }
        }

        if (submitBtn) submitBtn.addEventListener('click', onDateSubmit);
        if (beginRange) beginRange.addEventListener('input', onRangeInput);
        if (endRange) endRange.addEventListener('input', onRangeInput);

        // initialize track fill on mount
        try {
            if (beginRange && endRange) {
                const evt = new Event('input');
                beginRange.dispatchEvent(evt);
                endRange.dispatchEvent(evt);
            }
        } catch (e) { }

        return () => {
            if (submitBtn) submitBtn.removeEventListener('click', onDateSubmit);
            if (beginRange) beginRange.removeEventListener('input', onRangeInput);
            if (endRange) endRange.removeEventListener('input', onRangeInput);
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
        <Prediction jsonSample={jsonSample} carrierMap={carrierMap} airportMap={airportMap} earliestDate={earliestDate} latestDate={latestDate} filteredData={filteredData} />
        <Filters setNewFilter={setNewFilter} dataChanged={dataChanged} jsonSample={jsonSample}
        carrierMap={carrierMap} airportMap={airportMap} filteredData={filteredData} setDataChanged={setDataChanged}></Filters>
        <div className="sticky-bottom">
            <p align="center"><strong>Date range select</strong></p>
            <div className="toolRow">
                <div className="slidersControl">
                    <input type="range" id="dateBeginRange" />
                    <input type="range" id="dateEndRange"/>
                </div>
                <div className="formControl">
                    <span id="dateBeginLabel"></span>
                    to
                    <span id="dateEndLabel"></span>
                    &nbsp;
                    <button id="dateSubmit">Submit</button>
                </div>
            </div>
            <div id="dateDisplay"></div>
        </div>
    </>);
}