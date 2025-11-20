import { useEffect, useRef, useState } from "react";
import { ExpandableDrop } from "./ExpandableDrop";

export function Filters({ setFilterSeq, dataChanged, carrierMap, airportMap, setDataChanged, filteredData, jsonSample, onFiltersApplied }) {

    const carrierFilters = useRef(null);
    const airportFilters = useRef(null);
    const [filterClick, setFilterClick] = useState(false);
    const filterSubmit = useRef(null);
    const [carrierCheckBoxes, setCarrierCheckBoxes] = useState([]);
    const carrierCount = useRef(0);
    const airportCount = useRef(0);
    const [airportCheckBoxes, setAirportCheckBoxes] = useState([]);
    const carrierAllButton = useRef(null);
    const airportAllButton = useRef(null);
    const lowestFlightNum = useRef(null);
    const highestFlightNum = useRef(null);
    const lowestDelayNum = useRef(null);
    const highestDelayNum = useRef(null);
    const [selectAllAirports, setSelectAllAirports] = useState(false);
    const [selectAllCarriers, setSelectAllCarriers] = useState(false);

    // --- NEW: Z-index tracking ---
    const [zIndexCounter, setZIndexCounter] = useState(1);
    const [dropdownZIndexes, setDropdownZIndexes] = useState({});

    const handleDropdownClick = (dropdownId) => {
        setDropdownZIndexes(prev => ({
            ...prev,
            [dropdownId]: zIndexCounter
        }));
        setZIndexCounter(zIndexCounter + 1);
    }

    // Initialize filter elements and their events
    useEffect(() => {
        if(dataChanged)
        {
        //Create carrier checkboxes
        let newCheckboxes = [];
        let arrayKey = 0;
        carrierMap.current.forEach((value, key) => {
            newCheckboxes.push(
                <div key={arrayKey} className="expandRow"><input type="checkbox" className="carrierCheckbox"
                    name={value + '_CarrierCheckbox'}
                    id={key + '_CarrierCheckbox'}
                    defaultChecked={true}
                /> <label htmlFor={key + '_CarrierCheckbox'}>{value}</label></div>);
            arrayKey++;
        });
        carrierCount.current = arrayKey;
        setCarrierCheckBoxes(newCheckboxes);

            // --- Airport checkboxes ---
            newCheckboxes = [];
            arrayKey = 0;
            airportMap.current.forEach((value, key) => {
                newCheckboxes.push(
                    <div key={arrayKey} className="expandRow">
                        <input type="checkbox" className="airportCheckbox"
                               name={value + '_AirportDRCheckbox'}
                               id={key + '_AirportDRCheckbox'}
                               defaultChecked={true}
                        />
                        <label htmlFor={key + '_AirportDRCheckbox'}>{value}</label>
                    </div>
                );
                arrayKey++;
            });
            airportCount.current = arrayKey;
            setAirportCheckBoxes(newCheckboxes);
        }
    }, [dataChanged]);

    useEffect(() => {
        // Filter submit button
        filterSubmit.current.addEventListener('click', () => { setFilterClick(true) });

        // Select All checkboxes
        airportAllButton.current.addEventListener('change', () => { setSelectAllAirports(true) });
        carrierAllButton.current.addEventListener('change', () => { setSelectAllCarriers(true) });

        // Prevent negative number inputs
        lowestFlightNum.current.addEventListener('change', () => { if (lowestFlightNum.current.value < 0) lowestFlightNum.current.value = 0; });
        highestFlightNum.current.addEventListener('change', () => { if (highestFlightNum.current.value < 0) highestFlightNum.current.value = 0; });
        lowestDelayNum.current.addEventListener('change', () => { if (lowestDelayNum.current.value < 0) lowestDelayNum.current.value = 0; });
        highestDelayNum.current.addEventListener('change', () => { if (highestDelayNum.current.value < 0) highestDelayNum.current.value = 0; });
    }, []);

    useEffect(() => {
        if (filterClick) {
            if (Number(lowestFlightNum.current.value) > Number(highestFlightNum.current.value)) {
                alert('Invalid range for number of flights was entered');
                setFilterClick(false);
                return;
            }
            if (Number(lowestDelayNum.current.value) > Number(highestDelayNum.current.value)) {
                alert('Invalid range for number of delays was entered');
                setFilterClick(false);
                return;
            }

            // --- Carrier filters ---
            let carrierArray = [];
            const carrierBoxes = carrierFilters.current.children;
            for (let i = 0; i < carrierBoxes.length; i++) {
                if (carrierBoxes[i].tagName === 'DIV') {
                    let children = carrierBoxes[i].children;
                    if (children[0].tagName === 'INPUT' && children[0].type === 'checkbox' && children[0].checked
                        && children[0].className === 'carrierCheckbox') {
                        let key = children[0].id.split('_')[0];
                        carrierArray.push(key);
                    }
                }
            }

            let newFilterData = jsonSample.current.filter((row) => carrierArray.includes(row.carrier));

            // --- Airport filters ---
            let airportArray = [];
            const airportBoxes = airportFilters.current.children;
            for (let i = 0; i < airportBoxes.length; i++) {
                if (airportBoxes[i].tagName === 'DIV') {
                    let children = airportBoxes[i].children;
                    if (children[0].tagName === 'INPUT' && children[0].type === 'checkbox' && children[0].checked
                        && children[0].className === 'airportCheckbox') {
                        let key = children[0].id.split('_')[0];
                        airportArray.push(key);
                    }
                }
            }


            newFilterData = newFilterData.filter((row) => {
                return airportArray.includes(row.airport);
            });

            newFilterData = newFilterData.filter((row) => {
                return row.arr_flights >= Number(lowestFlightNum.current.value) && row.arr_flights <= Number(highestFlightNum.current.value);
            });

            newFilterData = newFilterData.filter((row) => {
                return row.arr_del15 >= Number(lowestDelayNum.current.value) && row.arr_del15 <= Number(highestDelayNum.current.value);
            })

            if (typeof onFiltersApplied === 'function') onFiltersApplied(newFilterData);

            filteredData.current = newFilterData;
            setFilterClick(false);
            setFilterSeq(s => s + 1);
        }
    }, [filterClick]);

    // --- Select all logic remains the same ---
    useEffect(() => {
        if(selectAllCarriers)
        {
            let carrierBoxes = carrierFilters.current.children;
            for (let i = 0; i < carrierBoxes.length; i++) {
                if (carrierBoxes[i].tagName === 'DIV') {
                    let children = carrierBoxes[i].children;
                    if (children[0].tagName === 'INPUT' && children[0].type === 'checkbox' && children[0].className === 'carrierCheckbox') {
                        children[0].checked = carrierAllButton.current.checked;
                    }
                }
            }
            setSelectAllCarriers(false);
        }
    }, [selectAllCarriers]);

    useEffect(() => {
        if(selectAllAirports)
        {
            let airportBoxes = airportFilters.current.children;
            for (let i = 0; i < airportBoxes.length; i++) {
                if (airportBoxes[i].tagName == 'DIV') {
                    let children = airportBoxes[i].children;
                    if (children[0].tagName === 'INPUT' && children[0].type === 'checkbox' && children[0].className === 'airportCheckbox') {
                        children[0].checked = airportAllButton.current.checked;
                    }
                }
            }
            setSelectAllAirports(false);
        }
    }, [selectAllAirports]);

    return (
        <div className="center">
            <div className="flexRow filterBar">
                <h3>Filters</h3>

                {/* --- Airports dropdown --- */}
                <ExpandableDrop
                    id="airportsDrop"
                    title={'Airports'}
                    initialDisplay={false}
                    expandMode={'absolute'}
                    onClick={() => handleDropdownClick('airportsDrop')}
                    style={{ zIndex: dropdownZIndexes['airportsDrop'] || 1 }}
                >
                    <div className="flexColumnScroll dropBorder" ref={airportFilters}>
                        <div className="expandRow">
                            <input type="checkbox" ref={airportAllButton} name="selectAllAirports" defaultChecked={true} />
                            <label htmlFor='selectAllAirports'>Select All</label>
                        </div>
                        {airportCheckBoxes}
                    </div>
                </ExpandableDrop>

                {/* --- Carriers dropdown --- */}
                <ExpandableDrop
                    id="carriersDrop"
                    title={'Carriers'}
                    initialDisplay={false}
                    expandMode={'absolute'}
                    onClick={() => handleDropdownClick('carriersDrop')}
                    style={{ zIndex: dropdownZIndexes['carriersDrop'] || 1 }}
                >
                    <div className="flexColumnScroll dropBorder" ref={carrierFilters}>
                        <div className="expandRow">
                            <input type="checkbox" ref={carrierAllButton} name="selectAllCarriers" defaultChecked={true} />
                            <label htmlFor='selectAllCarriers'>Select All</label>
                        </div>
                        {carrierCheckBoxes}
                    </div>
                </ExpandableDrop>

                {/* --- Number of Flights dropdown --- */}
                <ExpandableDrop
                    id="flightsDrop"
                    title={'Number of Flights'}
                    initialDisplay={false}
                    expandMode={'absolute'}
                    onClick={() => handleDropdownClick('flightsDrop')}
                    style={{ zIndex: dropdownZIndexes['flightsDrop'] || 1 }}
                >
                    <div className="expandRow dropBorder">
                        <input type="number" ref={lowestFlightNum} name="lowestFlightNum" defaultValue={0} min={0} />
                        <p>-</p>
                        <input type="number" ref={highestFlightNum} name="highestFlightNum" defaultValue={1000000} min={0} />
                    </div>
                </ExpandableDrop>

                {/* --- Number of Delays dropdown --- */}
                <ExpandableDrop
                    id="delaysDrop"
                    title={'Number of Delays'}
                    initialDisplay={false}
                    expandMode={'absolute'}
                    onClick={() => handleDropdownClick('delaysDrop')}
                    style={{ zIndex: dropdownZIndexes['delaysDrop'] || 1 }}
                >
                    <div className="expandRow dropBorder">
                        <input type="number" ref={lowestDelayNum} name="lowestDelayNum" defaultValue={0} min={0} />
                        <p>-</p>
                        <input type="number" ref={highestDelayNum} name="highestDelayNum" defaultValue={1000000} min={0} />
                    </div>
                </ExpandableDrop>

                <button ref={filterSubmit} className="filterButton" id="filterSubmit">Submit</button>
            </div>
        </div>
    );
}
