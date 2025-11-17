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

    // Helper: convert YYYY-MM string (from type=month) to numeric month index
    function monthToIndex(monthStr) {
        if (!monthStr || monthStr.trim() === '') return null;
        const parts = monthStr.split('-');
        if (parts.length !== 2) return null;
        const y = Number(parts[0]);
        const m = Number(parts[1]);
        if (Number.isNaN(y) || Number.isNaN(m)) return null;
        return y * 12 + (m - 1);
    }

    // Helper: convert numeric month index back to YYYY-MM string
    function indexToMonthStr(index) {
        if (index === null || index === undefined || Number.isNaN(Number(index))) return '';
        const idx = Number(index);
        const y = Math.floor(idx / 12);
        const m = (idx % 12) + 1;
        return `${y}-${String(m).padStart(2, '0')}`;
    }

    //To be ran only on intialization of the DOM once. 
    useLayoutEffect(() => {
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
        //Cause all data dependent sections to initialize
        setNewFilter(true);

        // Set sticky date inputs to the earliest and latest months found in the data
        try {
            const display = document.getElementById('dateDisplay');
            const beginRange = document.getElementById('dateBeginRange');
            const endRange = document.getElementById('dateEndRange');
            const beginLabel = document.getElementById('dateBeginLabel');
            const endLabel = document.getElementById('dateEndLabel');
            const beginMonth = document.getElementById('dateBeginMonth');
            const endMonth = document.getElementById('dateEndMonth');

            const validEarliest = earliestDate.current[0] !== 9999 && earliestDate.current[1] >= 1 && earliestDate.current[1] <= 12;
            const validLatest = latestDate.current[0] !== 0 || latestDate.current[1] !== 0;

            const minIndex = validEarliest ? earliestDate.current[0] * 12 + (earliestDate.current[1] - 1) : null;
            const maxIndex = validLatest ? latestDate.current[0] * 12 + (latestDate.current[1] - 1) : null;

            if (beginRange && endRange && minIndex !== null && maxIndex !== null) {
                beginRange.min = minIndex;
                beginRange.max = maxIndex;
                endRange.min = minIndex;
                endRange.max = maxIndex;
                beginRange.value = minIndex;
                endRange.value = maxIndex;
                if (beginLabel) beginLabel.textContent = indexToMonthStr(minIndex);
                if (endLabel) endLabel.textContent = indexToMonthStr(maxIndex);
            }

            function fmtIdx(idx) { return idx === null ? '' : indexToMonthStr(Number(idx)); }

            if (beginMonth && validEarliest) beginMonth.value = indexToMonthStr(minIndex);
            if (endMonth && validLatest) endMonth.value = indexToMonthStr(maxIndex);
            if (display && minIndex !== null && maxIndex !== null) display.textContent = `Showing rankings for ${fmtIdx(minIndex)} to ${fmtIdx(maxIndex)}`;
        } catch (e) {
            // DOM may not be ready yet; safe to ignore
            console.warn('Could not set date inputs automatically', e);
        }
    }, [dataChanged, firstRender]);

    useEffect(() => {
        const submitBtn = document.getElementById('dateSubmit');
        const beginRange = document.getElementById('dateBeginRange');
        const endRange = document.getElementById('dateEndRange');
        const beginMonth = document.getElementById('dateBeginMonth');
        const endMonth = document.getElementById('dateEndMonth');
        const display = document.getElementById('dateDisplay');

        function onDateSubmit() {
            // Prefer range inputs if present
            let beginIndex = null;
            let endIndex = null;
            if (beginRange && endRange) {
                beginIndex = Number(beginRange.value);
                endIndex = Number(endRange.value);
            } else if (beginMonth || endMonth) {
                beginIndex = beginMonth ? monthToIndex(beginMonth.value) : null;
                endIndex = endMonth ? monthToIndex(endMonth.value) : null;
            }

            if (beginIndex !== null && endIndex !== null && beginIndex > endIndex) {
                alert('Invalid date range: start is after end');
                return;
            }

            // Base data: use the current filteredData (so date range composes with other filters)
            const base = filteredData.current && filteredData.current.length ? filteredData.current : jsonSample.current;

            const newFiltered = base.filter((row) => {
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
            setDataChanged((prev) => !prev);
        }

        // Live update display when using range inputs
        function onRangeInput() {
            const beginIndex = beginRange ? Number(beginRange.value) : (beginMonth ? monthToIndex(beginMonth.value) : null);
            const endIndex = endRange ? Number(endRange.value) : (endMonth ? monthToIndex(endMonth.value) : null);
            const beginLabel = document.getElementById('dateBeginLabel');
            const endLabel = document.getElementById('dateEndLabel');
            if (beginLabel) beginLabel.textContent = beginIndex !== null ? indexToMonthStr(beginIndex) : '';
            if (endLabel) endLabel.textContent = endIndex !== null ? indexToMonthStr(endIndex) : '';
            if (display) {
                const b = beginIndex !== null ? indexToMonthStr(beginIndex) : 'earliest';
                const e = endIndex !== null ? indexToMonthStr(endIndex) : 'latest';
                display.textContent = `Showing rankings for ${b} to ${e}`;
            }
        }

        if (submitBtn) submitBtn.addEventListener('click', onDateSubmit);
        if (beginRange) beginRange.addEventListener('input', onRangeInput);
        if (endRange) endRange.addEventListener('input', onRangeInput);

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
                        <div className="sliders_control">
                            <input type="range" id="dateBeginRange" />
                            <input type="range" id="dateEndRange"/>
                        </div>
                        <div className="form_control">
                            <span id="dateBeginLabel"></span>
                            to
                            <span id="dateEndLabel"></span>
                        </div>
                        <div>
                            <span id="dateDisplay"></span>
                            &nbsp;
                            <button id="dateSubmit">Submit</button>
                        </div>
                    </div>
            </div>
            <div id="dateDisplay"></div>
        </div>
    </>);
}