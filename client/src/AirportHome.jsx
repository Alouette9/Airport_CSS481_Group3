import { useEffect, useState, useLayoutEffect, useRef } from "react";
import { Rankings } from './Rankings';
import { Filters } from "./Filters";

export function AirportHome({ jsonSample }) {
    //Add states or refs here that may have to be props that are shared between components
    const carrierMap = useRef(new Map());
    const airportMap = useRef(new Map());
    const filteredData = useRef(jsonSample.current);
    const [dataChanged, setDataChanged] = useState(false);
    const [newFilter, setNewFilter] = useState(false)
    const latestDate = useRef([0,0]);
    const earliestDate = useRef([9999,32]);

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
            if (jsonSample.current[i].year < earliestDate.current[0] || (jsonSample.current[i].year == earliestDate.current[0] && jsonSample.current[i].month > earliestDate.current[1])) {
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
    }, []);

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
        <Filters setNewFilter={setNewFilter} dataChanged={dataChanged} jsonSample={jsonSample}
        carrierMap={carrierMap} airportMap={airportMap} filteredData={filteredData} setDataChanged={setDataChanged}></Filters>
    </>);
}