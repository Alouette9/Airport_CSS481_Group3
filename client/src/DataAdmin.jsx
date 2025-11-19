import { use, useEffect, useLayoutEffect, useRef, useState } from "react";
import { addDoc, collection, deleteDoc, updateDoc, getDoc, doc } from "firebase/firestore";
import { data, json } from "@remix-run/router";

export default function DataAdmin({ jsonSample, databaseRef, docIDs, carrierMap, airportMap, dataChanged, setDataChanged }) {

    const dateInput = useRef(null);
    const carrierCode = useRef(null);
    const carrierName = useRef(null);
    const airportCode = useRef(null);
    const airportName = useRef(null);
    const airportCity = useRef(null);
    const airportRegion = useRef(null);
    const flightsNum = useRef(null);
    const delaysNum = useRef(null);
    const delayTime = useRef(null);
    const carrierDelays = useRef(null);
    const carrierTime = useRef(null);
    const weatherNum = useRef(null);
    const weatherTime = useRef(null);
    const trafficNum = useRef(null);
    const trafficTime = useRef(null);
    const cancelledNum = useRef(null);
    const securityNum = useRef(null);
    const securityTime = useRef(null);
    const lateNum = useRef(null);
    const lateTime = useRef(null);
    const divertedNum = useRef(null);
    const [newEntry, setNewEntry] = useState(false);

    const [carrierOptions, setCarrierOptions] = useState([]);
    const [airportOptions, setAirportOptions] = useState([]);

    const [tableBody, setTableBody] = useState([]);

    const [searchData, setSearchData] = useState(false);

    const carrierSelect = useRef(null);
    const airportSelect = useRef(null);
    const bodyRef = useRef(null);

    const firstDataLoad = useRef(true);

    const [deleteData, setDeleteData] = useState(false);

    const tableRef = useRef(null);

    const searchMethod = useRef(null);
    const carrierUpdate = useRef(null);
    const airportUpdate = useRef(null);

    const [selectChange, setSelectChange] = useState(false);

    useLayoutEffect(() => {
        if (airportUpdate.current) {
            airportUpdate.current.style.display = 'none';
        }
    }, []);

    useEffect(() => {
        if (deleteData) {
            const checkboxes = bodyRef.current.querySelectorAll('input[type="checkbox"]:checked');
            if (checkboxes.length === 0) {
                alert("No entries selected for deletion.");
                setDeleteData(false);
                return;
            }
            let indicesToDelete = Array.from(checkboxes).map(cb => parseInt(cb.value));

            if (databaseRef && databaseRef.current) {
                let ids = [];
                for (let i = 0; i < indicesToDelete.length; i++) {
                    ids.push(docIDs.current[indicesToDelete[i]]);
                }
                console.log(ids);
                deleteEntries(databaseRef.current, jsonSample.current, docIDs.current, ids, indicesToDelete);
            }
            else {
                for (let i = 0; i < indicesToDelete.length; i++) {
                    console.log(jsonSample.current[indicesToDelete[i]]);
                    jsonSample.current.splice(indicesToDelete[i] - i, 1);
                }
                setDataChanged(true);
                setSearchData(true);
            }

            setDeleteData(false);
        }
    }, [deleteData]);

    async function deleteEntries(databaseRef, jsonSample, docIDs, ids, indices) {
        if (indices.length != ids.length) {
            alert("Internal error: mismatch in deletion indices and IDs.");
            return;
        }

        for (let i = 0; i < ids.length; i++) {
            try {
                await deleteDoc(doc(databaseRef, 'allFlightData', ids[i]));
                console.log(jsonSample[indices[i]]);
                jsonSample.splice(indices[i] - i, 1);
                docIDs.splice(indices[i] - i, 1);
                offset++;
                console.log("Deleted document with ID: ", ids[i]);
            } catch (e) {
                alert("Error deleting entry from database.");
                console.error("Error deleting document: ", e);
                console.log("DocID: ", ids[i]);
            }
        }
        // After deletions, signal data change to refresh UI
        setDataChanged(true);
        setSearchData(true);
    }

    useEffect(() => {
        if (dataChanged || firstDataLoad.current == true) {
            if (firstDataLoad.current == true) {
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
                }
                if (carrierMap.current.size != 0 && airportMap.current.size != 0) {
                    {
                        firstDataLoad.current = false;
                    }
                }
            }
            let newAirportOptions = [];
            let newCarrierOptions = [];
            airportMap.current.forEach((value, key) => {
                newAirportOptions.push(<option key={key} value={key}>{value} ({key})</option>);
            });

            carrierMap.current.forEach((value, key) => {
                newCarrierOptions.push(<option key={key} value={key}>{value} ({key})</option>);
            });

            setAirportOptions(newAirportOptions);
            setCarrierOptions(newCarrierOptions);
            setDataChanged(false);
        }
    }, [dataChanged]);

    useEffect(() => {
        if (newEntry) {
            if (!dateInput.current || !carrierCode.current || !carrierName.current || !airportCode.current || !airportName.current ||
                !flightsNum.current || !delaysNum.current || !delayTime.current ||
                !carrierDelays.current || !carrierTime.current || !weatherNum.current || !weatherTime.current ||
                !trafficNum.current || !trafficTime.current || !cancelledNum.current || !securityNum.current || !securityTime.current ||
                !lateNum.current || !lateTime.current || !divertedNum.current || !airportCity.current || !airportRegion.current) {
                console.error("One or more input refs are null");

                setNewEntry(false);
                return;
            }

            if (Number(flightsNum.current.value) < 0 || Number(delaysNum.current.value) < 0 || Number(delayTime.current.value) < 0 ||
                Number(carrierDelays.current.value) < 0 || Number(carrierTime.current.value) < 0 || Number(weatherNum.current.value) < 0 || weatherTime.current.value < 0 ||
                trafficNum.current.value < 0 || trafficTime.current.value < 0 || cancelledNum.current.value < 0 || securityNum.current.value < 0 ||
                Number(lateNum.current.value) < 0 || Number(lateTime.current.value) < 0 || Number(divertedNum.current.value) < 0) {
                alert("Numeric fields cannot have negative values.");
                setNewEntry(false);
                return;
            }

            let dateValues = dateInput.current.value.split('-');
            let year = parseInt(dateValues[0]);
            let month = parseInt(dateValues[1]);

            if (dateInput.current.value == '' || carrierCode.current.value.trim() == '' || carrierName.current.value.trim() == ''
                || airportCode.current.value.trim() == '' || airportName.current.value.trim() == ''
                || airportCity.current.value.trim() == '' || airportRegion.current.value.trim() == '') {
                alert("New entries must fill in all fields.");
                setNewEntry(false);
                return;
            }

            if (carrierCode.current.value.length != 2) {
                alert("Carrier code must be 2 characters.");
                setNewEntry(false);
                return;
            }

            if (airportCode.current.value.length != 3) {
                alert("Airport code must be 3 characters.");
                setNewEntry(false);
                return;
            }

            if (airportRegion.current.value.length != 2) {
                alert("Airport region must be a 2 characters abreviation.");
                setNewEntry(false);
                return;
            }

            //Check if carrier and airport exist in maps
            if (carrierMap.current.has(carrierCode.current.value.trim())) {
                if (carrierName.current.value.trim() != carrierMap.current.get(carrierCode.current.value)) {
                    alert("Carrier code and name do not match existing records.");
                    setNewEntry(false);
                    return;
                }
            }
            else
            //Check if name already exists with different code
            {
                carrierMap.current.forEach((value, key) => {
                    if (value == carrierName.current.value.trim()) {
                        alert("Carrier name has a different existing code.");
                        setNewEntry(false);
                        return;
                    }
                });
                carrierMap.current.set(carrierCode.current.value.trim(), carrierName.current.value.trim());
            }

            let airportFullName = airportCity.current.value.trim() + ', ' + airportRegion.current.value.trim() + ': ' +
                airportName.current.value.trim();

            if (airportMap.current.has(airportCode.current.value.trim())) {
                if (airportFullName != airportMap.current.get(airportCode.current.value)) {
                    alert("Airport code and name do not match existing records.");
                    setNewEntry(false);
                    return;
                }
            }
            else {
                //Check if name already exists with different code
                airportMap.current.forEach((value, key) => {
                    if (value == airportFullName) {
                        alert("Airport name has a different existing code.");
                        setNewEntry(false);
                        return;
                    }
                });
                airportMap.current.set(airportCode.current.value.trim(), airportFullName);
            }

            if (Number(flightsNum.current.value) == 0 && (Number(delaysNum.current.value) > 0 || Number(delayTime.current.value) > 0 ||
                Number(carrierDelays.current.value) > 0 || Number(carrierTime.current.value) > 0 || Number(weatherNum.current.value) > 0 || weatherTime.current.value > 0 ||
                trafficNum.current.value > 0 || trafficTime.current.value > 0 || cancelledNum.current.value > 0 || securityNum.current.value > 0 ||
                securityTime.current.value > 0 || Number(lateNum.current.value) > 0 || Number(lateTime.current.value) > 0 || Number(divertedNum.current.value) > 0)) {
                alert("If there are zero flights, all other numeric fields must also be zero.");
                setNewEntry(false);
                return;
            }

            if (Number(delaysNum.current.value) > Number(flightsNum.current.value)) {
                alert("Number of delays cannot exceed number of flights.");
                setNewEntry(false);
                return;
            }



            let objectEntry = {
                year: year, month: month, carrier: carrierCode.current.value.trim(), carrier_name: airportFullName,
                airport: airportCode.current.value, airport_name: airportName.current.value, arr_flights: Number(Number(flightsNum.current.value)),
                arr_del15: Number(Number(delaysNum.current.value)), carrier_ct: Number(Number(carrierDelays.current.value)),
                weather_ct: Number(Number(weatherNum.current.value)), nas_ct: Number(trafficNum.current.value), security_ct: Number(securityNum.current.value),
                late_aircraft_ct: Number(Number(lateNum.current.value)), arr_cancelled: Number(cancelledNum.current.value),
                arr_diverted: Number(Number(divertedNum.current.value)), arr_delay: Number(Number(delayTime.current.value)),
                carrier_delay: Number(Number(carrierTime.current.value)), weather_delay: Number(weatherTime.current.value), nas_delay: Number(trafficTime.current.value),
                security_delay: Number(securityTime.current.value), late_aircraft_delay: Number(Number(lateTime.current.value))
            };

            console.log("New Entry Object: ", objectEntry);

            //When using Firebase add to the database
            if (databaseRef && databaseRef.current) {
                createNewEntry(databaseRef.current, objectEntry, docIDs);
            }
            //Otherwise just add to useRef JSON for local testing
            else {
                alert("New entry added successfully.");
                jsonSample.current.push(objectEntry);
                setDataChanged(true);
            }
            setNewEntry(false);
        }
    }, [newEntry]);

    async function createNewEntry(databaseRef, entry, docIDs) {
        try {
            const docRef = await addDoc(collection(databaseRef, 'allFlightData'), entry);
            docIDs.current.push(docRef.id);
            alert("New entry added successfully.");
            jsonSample.current.push(entry);
            setDataChanged(true);
        } catch (e) {
            alert("Error adding new entry to database.");
            console.error("Error adding document: ", e);
        }
    }

    useEffect(() => {
        if (searchData) {

            let index = -1;
            let indexMatches = [];
            let results;

            if (searchMethod.current && searchMethod.current.value == '0') {
                if (carrierUpdate.current && carrierSelect.current.value == '') {
                    alert("Please select a carrier to update.");
                    setSearchData(false);
                    return;
                }
                else if (carrierUpdate.current) {
                    results = jsonSample.current.filter((entry) => {
                        index++;
                        if ((carrierSelect.current.value != '' && entry.carrier != carrierSelect.current.value)) {
                            return false;
                        }
                        indexMatches.push(index);
                        return true;
                    });
                }
            }
            else if (searchMethod.current && searchMethod.current.value == '1') {
                if (airportUpdate.current && airportSelect.current.value == '') {
                    alert("Please select an airport to update.");
                    setSearchData(false);
                    return;
                }
                else if (airportUpdate.current) {
                    results = jsonSample.current.filter((entry) => {
                        index++;
                        if ((airportSelect.current.value != '' && entry.airport != airportSelect.current.value)) {
                            return false;
                        }
                        indexMatches.push(index);
                        return true;
                    });
                }
            }
            else {
                alert("Please select a valid search method.");
                setSearchData(false);
                return;
            }

            function doubleClickHandler(event) {
                const target = event.target;
                const originalValue = target.textContent;
                let input;
                if (target.classList.contains('editableNumber')) {
                    input = document.createElement('input');
                    input.type = 'number';
                    input.min = '0';
                    input.defaultValue = originalValue;
                }
                else if (target.classList.contains('editableDate')) {
                    input = document.createElement('input');
                    input.type = 'month';
                    if (originalValue.includes('-')) {
                        let dateParts = originalValue.split('-');
                        let year = dateParts[0];
                        let month = dateParts[1];
                        if (month.length == 1) {
                            month = '0' + month;
                        }
                        input.defaultValue = year + '-' + month;
                    }
                }
                else {
                    return;
                }
                const index = event.target.parentElement.querySelector('input[type="checkbox"]').value;
                target.textContent = '';
                target.appendChild(input);
                input.focus();
                input.addEventListener('blur', (event) => {
                    const newValue = input.value;
                    if (!target.hasChildNodes()) {
                        return;
                    }
                    else {
                        saveEditField(target, newValue, originalValue, databaseRef.current, docIDs.current ? docIDs.current[index] : null, index);
                    }
                });

                input.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter') {
                        const newValue = input.value;
                        input.blur();
                    }
                    else if (event.key === 'Escape') {
                        cancelEditField(event.target, originalValue);
                    }
                });

            }

            function saveEditField(target, newValue, originalValue, databaseRef, docID, index) {
                console.log('saveEditField called with newValue:', newValue);
                console.log(target.classList)
                console.log(target)
                let property = '';

                if(newValue === originalValue) {
                    cancelEditField(target, originalValue);
                    return;
                }

                if (target.classList.length < 1 || target.classList.length > 2) {
                    alert("Internal error: unexpected target class list.");
                    cancelEditField(target, originalValue);
                    return;
                }
                else if (target.classList.length == 2) {
                    property = target.classList[1];
                }

                if (typeof newValue === 'string' && newValue.trim() === '') {
                    alert("Values cannot be set to empty.");
                    cancelEditField(target, originalValue);
                    return;
                }

                console.log(target.classList)

                if (target.classList.contains('editableNumber')) {
                    //Make sure numbers are non-negative
                    console.log('Validating numeric field with value:', newValue);
                    if (newValue < 0 || isNaN(Number(newValue))) {
                        alert("Numeric fields cannot have negative or non-numeric values.");
                        //Remove input boxes and reset to text content
                        cancelEditField(target, originalValue);
                        return;
                    }

                    //Make sure flights cannot be less than delays, delays cannot exceed flights
                    if (target.classList.contains('arr_flights') && Number(newValue) < jsonSample.current[index].arr_del15) {
                        alert("Number of flights cannot be less than number of delays.");
                        cancelEditField(target, originalValue);
                        return;
                    }

                    if (target.classList.contains('arr_del15') && Number(newValue) > jsonSample.current[index].arr_flights &&
                        jsonSample.current[index].carrier_ct + jsonSample.current[index].weather_ct + jsonSample.current[index].nas_ct +
                        jsonSample.current[index].security_ct + jsonSample.current[index].late_aircraft_ct > Number(newValue)) {
                        alert("Number of delays cannot exceed number of flights.");
                        cancelEditField(target, originalValue);
                        return;
                    }

                    //Make sure sum of delay causes does not exceed number of delays
                    if ((target.classList.contains('carrier_ct') && Number(newValue) + jsonSample.current[index].weather_ct + jsonSample.current[index].nas_ct +
                        jsonSample.current[index].security_ct + jsonSample.current[index].late_aircraft_ct > jsonSample.current[index].arr_del15) ||
                        (target.classList.contains('weather_ct') && Number(newValue) + jsonSample.current[index].carrier_ct + jsonSample.current[index].nas_ct +
                            jsonSample.current[index].security_ct + jsonSample.current[index].late_aircraft_ct > jsonSample.current[index].arr_del15) ||
                        (target.classList.contains('nas_ct') && Number(newValue) + jsonSample.current[index].carrier_ct + jsonSample.current[index].weather_ct +
                            jsonSample.current[index].security_ct + jsonSample.current[index].late_aircraft_ct > jsonSample.current[index].arr_del15) ||
                        (target.classList.contains('security_ct') && Number(newValue) + jsonSample.current[index].carrier_ct + jsonSample.current[index].weather_ct +
                            jsonSample.current[index].nas_ct + jsonSample.current[index].late_aircraft_ct > jsonSample.current[index].arr_del15) ||
                        (target.classList.contains('late_aircraft_ct') && Number(newValue) + jsonSample.current[index].carrier_ct + jsonSample.current[index].weather_ct +
                            jsonSample.current[index].nas_ct + jsonSample.current[index].security_ct > jsonSample.current[index].arr_del15)) {
                        alert("Sum of delay causes cannot exceed number of delays.");
                        cancelEditField(target, originalValue);
                        return;
                    }

                    //Make sure cancellations do not exceed flights
                    if (target.classList.contains('arr_diverted') && Number(newValue) > jsonSample.current[index].arr_flights) {
                        alert("Number of diversions cannot exceed number of flights.");
                        cancelEditField(target, originalValue);
                        return;
                    }

                    //Update in local JSON

                    if (databaseRef && docID) {
                        //Update in database as well
                        const docRef = doc(databaseRef, 'allFlightData', docID);
                        let updateObj = {};
                        updateObj[property] = Number(newValue);
                        updateDoc(docRef, updateObj)
                            .then(() => {
                                console.log("Document successfully updated!");
                                jsonSample.current[index][property] = Number(newValue);
                                //Remove input boxes and reset to text content
                                if (target.hasChildNodes()) target.removeChild(target.firstChild);
                                target.textContent = newValue;
                            })
                            .catch((error) => {
                                console.error("Error updating document: ", error);
                                alert("Error updating date in database.");
                                cancelEditField(target, originalValue);
                            });
                        return;
                    }
                    else {
                        console.log('Updating local JSON for index', index, 'field', property, 'to', Number(newValue));
                        jsonSample.current[index][property] = Number(newValue);
                        console.log(jsonSample.current[index]);
                    }
                }
                else if (target.classList.contains('editableDate')) {
                    if (!newValue.includes('-')) {
                        alert("Date must be in YYYY-MM format.");
                        cancelEditField(target, originalValue);
                        return;
                    }
                    let dateParts = newValue.split('-');
                    if (dateParts.length != 2) {
                        alert("Date must be in YYYY-MM format.");
                        cancelEditField(target, originalValue);
                        return;
                    }
                    let year = parseInt(dateParts[0]);
                    let month = parseInt(dateParts[1]);
                    if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
                        alert("Date must be in YYYY-MM format with valid month.");
                        cancelEditField(target, originalValue);
                        return;
                    }

                    if (databaseRef && docID) {
                        //Update in database as well
                        const docRef = doc(databaseRef, 'allFlightData', docID);
                        updateDoc(docRef, { year: year, month: month })
                            .then(() => {
                                console.log("Document successfully updated!");
                                jsonSample.current[index].year = year;
                                jsonSample.current[index].month = month;
                                //Remove input boxes and reset to text content
                                if (target.hasChildNodes()) target.removeChild(target.firstChild);
                                target.textContent = newValue;
                            })
                            .catch((error) => {
                                console.error("Error updating document: ", error);
                                alert("Error updating date in database.");
                                cancelEditField(target, originalValue);
                            });
                        return;
                    }
                    else {
                        //Update year and month fields separately
                        jsonSample.current[index].year = year;
                        jsonSample.current[index].month = month;
                        console.log(jsonSample.current[index])
                    }
                }
                //Remove input boxes and reset to text content
                if (target.hasChildNodes()) target.removeChild(target.firstChild);
                target.textContent = newValue;
            }

            function cancelEditField(target, originalValue) {
                console.log('cancelEditField called');
                if (!target.hasChildNodes()) target.removeChild(target.firstChild);
                target.textContent = originalValue;
            }

            let newTableBody = results.map((entry, index) => {
                return (<tr key={index}>
                    <td><input type='checkbox' value={indexMatches[index]} /></td>
                    <td onDoubleClick={doubleClickHandler} className="editableDate">{entry.year + '-' + entry.month}</td>
                    <td>{entry.carrier}</td>
                    <td>{entry.carrier_name}</td>
                    <td>{entry.airport}</td>
                    <td>{entry.airport_name}</td>
                    <td onDoubleClick={doubleClickHandler} className="editableNumber arr_flights">{entry.arr_flights}</td>
                    <td onDoubleClick={doubleClickHandler} className="editableNumber arr_del15">{entry.arr_del15}</td>
                    <td onDoubleClick={doubleClickHandler} className="editableNumber arr_delay">{entry.arr_delay}</td>
                    <td onDoubleClick={doubleClickHandler} className="editableNumber carrier_ct">{entry.carrier_ct}</td>
                    <td onDoubleClick={doubleClickHandler} className="editableNumber carrier_delay">{entry.carrier_delay}</td>
                    <td onDoubleClick={doubleClickHandler} className="editableNumber weather_ct">{entry.weather_ct}</td>
                    <td onDoubleClick={doubleClickHandler} className="editableNumber weather_delay">{entry.weather_delay}</td>
                    <td onDoubleClick={doubleClickHandler} className="editableNumber nas_ct">{entry.nas_ct}</td>
                    <td onDoubleClick={doubleClickHandler} className="editableNumber nas_delay">{entry.nas_delay}</td>
                    <td onDoubleClick={doubleClickHandler} className="editableNumber arr_cancelled">{entry.arr_cancelled}</td>
                    <td onDoubleClick={doubleClickHandler} className="editableNumber security_ct">{entry.security_ct}</td>
                    <td onDoubleClick={doubleClickHandler} className="editableNumber security_delay">{entry.security_delay}</td>
                    <td onDoubleClick={doubleClickHandler} className="editableNumber late_aircraft_ct">{entry.late_aircraft_ct}</td>
                    <td onDoubleClick={doubleClickHandler} className="editableNumber late_aircraft_delay">{entry.late_aircraft_delay}</td>
                    <td onDoubleClick={doubleClickHandler} className="editableNumber arr_diverted">{entry.arr_diverted}</td>
                </tr>);
            });

            setTableBody(newTableBody);
            setSearchData(false);
        }
    }, [searchData]);

    useEffect(() => {
        if (selectChange) {
            if (searchMethod.current && searchMethod.current.value == '0') {
                if (carrierUpdate.current) {
                    carrierUpdate.current.style.display = 'block';
                }
                if (airportUpdate.current) {
                    airportUpdate.current.style.display = 'none';
                }
            }
            else if (searchMethod.current && searchMethod.current.value == '1') {
                if (carrierUpdate.current) {
                    carrierUpdate.current.style.display = 'none';
                }
                if (airportUpdate.current) {
                    airportUpdate.current.style.display = 'block';
                }
            }

            setSelectChange(false);
        }
    }, [selectChange]);

    return (<>
        <h2>Create Data</h2>
        <div className="leftAlign">
            <div className="gridColumn">
                <div className='flexBox'>
                    <label htmlFor="dateInput">Date (Year-Month): </label>
                    <input type="month" name='dateInput' ref={dateInput} /></div>

                <div className='flexBox'>
                    <label htmlFor="carrierCode">Carrier Code: </label>
                    <input type='text' name='carrierCode' ref={carrierCode} /></div>

                <div className='flexBox'>
                    <label htmlFor="carrierName">Carrier Name: </label>
                    <input type='text' name='carrierName' ref={carrierName} /></div>

                <div className='flexBox'>
                    <label htmlFor="airportCode">Airport Code: </label>
                    <input type='text' name='airportCode' ref={airportCode} /></div>

                <div className='flexBox'>
                    <label htmlFor="airportName">Airport Name: </label>
                    <input type='text' name='airportName' ref={airportName} /></div>

                <div className='flexBox'>
                    <label htmlFor="airportCity">Airport City: </label>
                    <input type='text' name='airportCity' ref={airportCity} /></div>

                <div className='flexBox'>
                    <label htmlFor="airportRegion">Airport Region: </label>
                    <input type='text' name='airportRegion' ref={airportRegion} /></div>

                <div className='flexBox'>
                    <label htmlFor="flightsNum">Number of Flights: </label>
                    <input type='number' name='flightsNum' ref={flightsNum} defaultValue={0} /></div>

                <div className='flexBox'>
                    <label htmlFor="delaysNum">Number of Delays: </label>
                    <input type='number' name='delaysNum' ref={delaysNum} defaultValue={0} /></div>

                <div className='flexBox'>
                    <label htmlFor="delayTime">Total Delay Time: </label>
                    <input type='number' name='delayTime' ref={delayTime} defaultValue={0} /></div>

                <div className='flexBox'>
                    <label htmlFor="carrierDelays">Carrier-related Delays: </label>
                    <input type='number' name='carrierDelays' ref={carrierDelays} defaultValue={0} /></div>

                <div className='flexBox'>
                    <label htmlFor="carrierTime">Carrier-related Delay Time: </label>
                    <input type='number' name='carrierTime' ref={carrierTime} defaultValue={0} /></div>

                <div className='flexBox' >
                    <label htmlFor="weatherNum">Weather-related Delays: </label>
                    <input type='number' name='weatherNum' ref={weatherNum} defaultValue={0} /></div>

                <div className='flexBox'>
                    <label htmlFor="weatherTime">Weather-related Delay Time: </label>
                    <input type='number' name='weatherTime' ref={weatherTime} defaultValue={0} /></div>

                <div className='flexBox'>
                    <label htmlFor="trafficNum">Traffic-related Delays: </label>
                    <input type='number' name='trafficNum' ref={trafficNum} defaultValue={0} /></div>

                <div className='flexBox'>
                    <label htmlFor="trafficTime">Traffic-related Delay Time: </label>
                    <input type='number' name='trafficTime' ref={trafficTime} defaultValue={0} /></div>

                <div className='flexBox'>
                    <label htmlFor="cancelledNum">Number of Cancellations: </label>
                    <input type='number' name='cancelledNum' ref={cancelledNum} defaultValue={0} /></div>

                <div className='flexBox'>
                    <label htmlFor="securityNum">Security-related Delays: </label>
                    <input type='number' name='securityNum' ref={securityNum} defaultValue={0} /></div>

                <div className='flexBox'>
                    <label htmlFor="securityTime">Security-related Delay Time: </label>
                    <input type='number' name='securityTime' ref={securityTime} defaultValue={0} /></div>

                <div className='flexBox'>
                    <label htmlFor="lateNum">Late Aircraft-related Delays: </label>
                    <input type='number' name='lateNum' ref={lateNum} defaultValue={0} /></div>

                <div className='flexBox'>
                    <label htmlFor="lateTime">Late Aircraft-related Delay Time: </label>
                    <input type='number' name='lateTime' ref={lateTime} defaultValue={0} /></div>

                <div className='flexBox'>
                    <label htmlFor="divertedNum">Number of Diversions: </label>
                    <input type='number' name='divertedNum' ref={divertedNum} defaultValue={0} />
                </div>
            </div>
            <button onClick={() => { setNewEntry(true) }}>Submit</button>
        </div>
        <div>
            <h2>Update Data</h2>
            <div className='toolRow'>
                <label htmlFor="searchMethod">Search Method:</label>
                <select name="searchMethod" ref={searchMethod} defaultValue={'0'} onChange={() => setSelectChange(true)}>
                    <option value="0">Carrier</option>
                    <option value="1">Airport</option>
                </select>
                <div ref={carrierUpdate}>
                    <label htmlFor="carrierSelect">Carrier:</label>
                    <select defaultValue={''} name="carrierSelect" ref={carrierSelect}>
                        <option value="" hidden>Select Carrier</option>
                        {carrierOptions}
                    </select>
                </div>

                <div ref={airportUpdate}>
                    <label htmlFor="airportSelect">Airport:</label>
                    <select defaultValue={''} name='airportSelect' ref={airportSelect}>
                        <option value="" hidden>Select Airports</option>
                        {airportOptions}
                    </select>
                </div>
                <button onClick={() => setSearchData(true)}>Search</button>
            </div>
            <div className='toolRow'>
                <button onClick={() => setDeleteData(true)}>Delete</button>
            </div>
            <div className="overFlowBox">
                <table ref={tableRef}>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Date</th>
                            <th>Carrier Code</th>
                            <th>Carrier Name</th>
                            <th>Airport Code</th>
                            <th>Airport Name</th>
                            <th>Flights</th>
                            <th>Delays</th>
                            <th>Delay Time</th>
                            <th>Carrier Delays</th>
                            <th>Carrier Delay Time</th>
                            <th>Weather Delays</th>
                            <th>Weather Delay Time</th>
                            <th>Traffic Delays</th>
                            <th>Traffic Delay Time</th>
                            <th>Cancellations</th>
                            <th>Security Delays</th>
                            <th>Security Delay Time</th>
                            <th>Late Aircraft Delays</th>
                            <th>Late Aircraft Delay Time</th>
                            <th>Diversions</th>
                        </tr>
                    </thead>
                    <tbody ref={bodyRef}>
                        {tableBody}
                    </tbody>
                </table>
            </div>
        </div>
    </>);
}