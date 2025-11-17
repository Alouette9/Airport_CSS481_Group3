import { useEffect, useState, useLayoutEffect, useRef, useCallback } from "react";
import { Rankings } from './Rankings';
import { Filters } from "./Filters";
import { Prediction } from "./Prediction";

export function AirportHome({ jsonSample, dataChanged, setDataChanged }) {
    //Add states or refs here that may have to be props that are shared between components
    const carrierMap = useRef(new Map());
    const airportMap = useRef(new Map());
    const filteredData = useRef(jsonSample.current);
    const filtersOnlyRef = useRef(jsonSample.current); // base for composing filters (carrier/airport/etc.)
    const [filterSeq, setFilterSeq] = useState(0)
    const latestDate = useRef([0, 0]);
    const earliestDate = useRef([9999, 32]);
    const [firstRender, setFirstRender] = useState(true);
    
    // Refs for form elements
    const submitBtnRef = useRef(null);
    const beginRangeRef = useRef(null);
    const endRangeRef = useRef(null);
    const displayRef = useRef(null);
    
    // Refs to track current slider values (prevent reset on re-render)
    const sliderValuesRef = useRef({ begin: null, end: null });
    const prevRangeRef = useRef({ begin: null, end: null });

    // Callback used by Filters to update the base dataset that date-range composes on
    const onFiltersApplied = useCallback((newBase) => {
        if (Array.isArray(newBase)) filtersOnlyRef.current = newBase;
    }, []);

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
                const beginRange = document.getElementById('dateBeginRange');
                const endRange = document.getElementById('dateEndRange');
                const beginLabel = document.getElementById('dateBeginLabel');
                const endLabel = document.getElementById('dateEndLabel');
                const display = document.getElementById('dateDisplay');

                const validEarliest = earliestDate.current[0] !== 9999 && earliestDate.current[1] >= 1 && earliestDate.current[1] <= 12;
                const validLatest = latestDate.current[0] !== 0 || latestDate.current[1] !== 0;

                function fmt([y, m]) {
                    if (!y || !m) return '';
                    const mm = String(m).padStart(2, '0');
                    return `${y}-${mm}`;
                }

                function indexToMonthStr(index) {
                    if (index === null || index === undefined || Number.isNaN(Number(index))) return '';
                    const idx = Number(index);
                    const y = Math.floor(idx / 12);
                    const m = (idx % 12) + 1;
                    return `${y}-${String(m).padStart(2, '0')}`;
                }

                if (validEarliest && validLatest) {
                    const minIndex = earliestDate.current[0] * 12 + (earliestDate.current[1] - 1);
                    const maxIndex = latestDate.current[0] * 12 + (latestDate.current[1] - 1);
                    
                    if (beginRange && endRange) {
                        beginRange.min = minIndex;
                        beginRange.max = maxIndex;
                        endRange.min = minIndex;
                        endRange.max = maxIndex;
                        beginRange.value = minIndex;
                        endRange.value = maxIndex;
                    }
                    if (beginLabel) beginLabel.textContent = indexToMonthStr(minIndex);
                    if (endLabel) endLabel.textContent = indexToMonthStr(maxIndex);
                    if (display) display.textContent = `Showing rankings for ${fmt(earliestDate.current)} to ${fmt(latestDate.current)}`;
                }
            } catch (e) {
                // DOM may not be ready yet; safe to ignore
                console.warn('Could not set date inputs automatically', e);
            }
                setDataChanged(false);
            //Cause all data dependent sections to initialize
            filteredData.current = jsonSample.current;
            setFilterSeq(s => s + 1);
            setFirstRender(false);
        }
    }, [dataChanged, firstRender]);

    // Handle date-range submit from the sticky footer
    const onDateSubmit = useCallback(() => {
        const beginRange = beginRangeRef.current;
        const endRange = endRangeRef.current;
        const display = displayRef.current;
        
        // Store current values so they don't get reset
        const beginIndex = Number(beginRange.value);
        const endIndex = Number(endRange.value);
        sliderValuesRef.current = { begin: beginIndex, end: endIndex };

        if (beginIndex > endIndex) {
            alert('Invalid date range: start is after end');
            return;
        }

        // Base data: use the filters-only base so date-range composes with other filters
        const base = (Array.isArray(filtersOnlyRef.current) && filtersOnlyRef.current.length) ? filtersOnlyRef.current : jsonSample.current;

        prevRangeRef.current = { begin: beginIndex, end: endIndex };

        const newFiltered = base.filter((row) => {
            if (typeof row.year !== 'number' || typeof row.month !== 'number') return false;
            const rowIndex = row.year * 12 + (row.month - 1);
            if (rowIndex < beginIndex) return false;
            if (rowIndex > endIndex) return false;
            return true;
        });

        filteredData.current = newFiltered;
        // Trigger rankings update by incrementing sequence
        setFilterSeq(s => s + 1);

        // Restore slider values after state change
        setTimeout(() => {
            if (beginRange && endRange && sliderValuesRef.current) {
                beginRange.value = sliderValuesRef.current.begin;
                endRange.value = sliderValuesRef.current.end;
            }
        }, 0);
    }, []);

        const onRangeInput = useCallback(() => {
            const beginRange = beginRangeRef.current;
            const endRange = endRangeRef.current;
            const display = displayRef.current;
            
            const beginIndex = Number(beginRange.value);
            const endIndex = Number(endRange.value);
            sliderValuesRef.current = { begin: beginIndex, end: endIndex };
            
            function indexToMonthStr(index) {
                if (index === null || index === undefined || Number.isNaN(Number(index))) return '';
                const idx = Number(index);
                const y = Math.floor(idx / 12);
                const m = (idx % 12) + 1;
                return `${y}-${String(m).padStart(2, '0')}`;
            }
            
            const beginLabel = document.getElementById('dateBeginLabel');
            const endLabel = document.getElementById('dateEndLabel');
            if (beginLabel) beginLabel.textContent = indexToMonthStr(beginIndex);
            if (endLabel) endLabel.textContent = indexToMonthStr(endIndex);
            if (display) {
                const b = indexToMonthStr(beginIndex);
                const e = indexToMonthStr(endIndex);
                display.textContent = `Showing rankings for ${b} to ${e}`;
            }
        }, []);

    useEffect(() => {
        const submitBtn = submitBtnRef.current;
        const beginRange = beginRangeRef.current;
        const endRange = endRangeRef.current;

        if (!submitBtn || !beginRange || !endRange) return;

        submitBtn.addEventListener('click', onDateSubmit);
        beginRange.addEventListener('input', onRangeInput);
        endRange.addEventListener('input', onRangeInput);

        // Trigger initial label update
        onRangeInput();

        return () => {
            submitBtn.removeEventListener('click', onDateSubmit);
            beginRange.removeEventListener('input', onRangeInput);
            endRange.removeEventListener('input', onRangeInput);
        };
    }, [onDateSubmit, onRangeInput]);

    //Insert your components here!
    return (<>
        <div className="bannerHeader">
            <div className="row">
                <h1>Dashboard</h1>
                <div className="bannerContainer">
                </div>
            </div>
        </div>
        <Rankings dataChanged={dataChanged} filteredData={filteredData} filterSeq={filterSeq} setFilterSeq={setFilterSeq} carrierMap={carrierMap} airportMap={airportMap} />
        <Prediction jsonSample={jsonSample} carrierMap={carrierMap} airportMap={airportMap} earliestDate={earliestDate} latestDate={latestDate} filteredData={filteredData} />
        <Filters setFilterSeq={setFilterSeq} dataChanged={dataChanged} jsonSample={jsonSample}
        carrierMap={carrierMap} airportMap={airportMap} filteredData={filteredData} setDataChanged={setDataChanged} onFiltersApplied={onFiltersApplied}></Filters>
        <div className="sticky-bottom">
            <p align="center"><strong>Date range select</strong></p>
            <div className="toolRow">
                <div className="slidersControl">
                    <input type="range" id="dateBeginRange" ref={beginRangeRef} />
                    <input type="range" id="dateEndRange" ref={endRangeRef} />
                </div>
                <div className="formControl">
                    <span id="dateBeginLabel"></span>
                    to
                    <span id="dateEndLabel"></span>
                    &nbsp;
                    <button id="dateSubmit" ref={submitBtnRef}>Submit</button>
                </div>
            </div>
            <div id="dateDisplay" ref={displayRef}></div>
        </div>
    </>);
}