import { use, useEffect, useState, useRef } from "react";
import { ExpandableCard } from "./ExpandableCard";

export default function GeolocationRecommendation({ filterSeq, filteredData }) {
    const [recContent, setRecContent] = useState([]);
    const region = useRef(null);
    const regionName = useRef(null);
    const city = useRef(null);
    const [locationTitle, setLocationTitle] = useState('Regional Carriers and Airports');
    const [regionFound, setRegionFound] = useState(false);
    useEffect(() => {
        getIP();
    }, []);

    useEffect(() => {
        if (regionFound && region.current != null && regionName.current != null && city.current != null) {
            console.log(filteredData)
            let localCarrriers = new Map();
            let localAirports = new Map();
            //Process filteredData to find recommendations based on region
            let regionCarriers = filteredData.current.filter((entry) => {
                let airportParts = entry.airport_name.split(':')[0].split(',')
                if (airportParts.length > 1 && airportParts[1].includes(region.current)) {
                    if (!localCarrriers.has(entry.carrier)) {
                        localCarrriers.set(entry.carrier, entry.carrier_name);
                    }
                    if (!localAirports.has(entry.airport_name)) {
                        localAirports.set(entry.airport, entry.airport_name);
                    }
                    return true;
                }
                return false;
            });

            let carrierPerformance = [];
            let airportPerformance = [];

            //Summarize carrier performance in region
            localCarrriers.forEach((value, key) => {
                let carrierEntries = regionCarriers.filter((entry) => entry.carrier == key);
                let totalFlights = carrierEntries.reduce((sum, entry) => sum + Number(entry.arr_flights), 0);
                let totalDelays = carrierEntries.reduce((sum, entry) => sum + Number(entry.arr_del15), 0);
                let delayRate = totalFlights > 0 ? totalDelays / totalFlights : 0;
                carrierPerformance.push([key, value, delayRate, totalFlights]);
            });

            localAirports.forEach((value, key) => {
                let airportEntries = regionCarriers.filter((entry) => entry.airport == key);
                let totalFlights = airportEntries.reduce((sum, entry) => sum + Number(entry.arr_flights), 0);
                let totalDelays = airportEntries.reduce((sum, entry) => sum + Number(entry.arr_del15), 0);
                let delayRate = totalFlights > 0 ? totalDelays / totalFlights : 0;
                airportPerformance.push([key, value, delayRate, totalFlights]);
            });

            //Sort by delay rate in ascending order
            carrierPerformance.sort((a, b) => {
                if (a[2] > b[2]) {
                    return 1;
                }
                else if (a[2] == b[2]) {
                    return a[3] > b[3] ? 1 : -1;
                }
                else {
                    return -1;
                }
            });
            airportPerformance.sort((a, b) => {
                if (a[2] > b[2]) {
                    return 1;
                }
                else if (a[2] == b[2]) {
                    return a[3] > b[3] ? 1 : -1;
                }
                else {
                    return -1;
                }
            });

            if(carrierPerformance.length == 0 && airportPerformance.length == 0)
            {
                setRecContent(<h4>We could not find any carrier or airport data for your the {regionName.current} region with the current data.</h4>);
                return;
            }

            let jsx = [];
            let index = 0;

            if(carrierPerformance.length > 0)
            {
                jsx.push(
                    <div key={index} className="recommendationSubsection">
                        <h4>Top Carriers</h4>
                        <table className="rankingList">
                        <tbody>
                            {carrierPerformance.slice(0, 5).map((entry, index) => (
                                <tr key={index}>
                                    <td>{index + 1}.</td>
                                    <td>{entry[1]}</td>
                                    <td>{(entry[2] * 100).toFixed(2)}%</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>);
                index++;
            }
            else
            {
                jsx.push(<h4>Carriers were not found</h4>);
            }

            if(airportPerformance.length > 0)
            {
                jsx.push(
                    <div key={index} className="recommendationSubsection">
                        <h4>Top Airports</h4>
                        <table className='rankingList'>
                        <tbody>
                            {airportPerformance.slice(0, 5).map((entry, index) => (
                                <tr key={index}>
                                    <td>{index + 1}.</td>
                                    <td>{entry[1].split(':')[1]}</td>
                                    <td>{(entry[2] * 100).toFixed(2)}%</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                );
                index++;
            }
            else
            {
                jsx.push(<h4>Airports were not found</h4>);
            }

            setRecContent(<div className="flexRow">{jsx}</div>);
            
        }
    }, [regionFound, filterSeq]);

    //Get user's IP-based region
    const getIP = () => {
        fetch('http://ip-api.com/json/')
            .then((response) => response.json()).then((result) => {
                region.current = result.region;
                city.current = result.city;
                regionName.current = result.regionName;
                setRegionFound(true);
                setLocationTitle(`Carriers and Airports in ${regionName.current}`);
            }).catch((error) => console.log('error', error));
    }

    return (
        <ExpandableCard title={locationTitle} initialDisplay={true} expandMode={'static'} widthPercent={30} minheightPercent={23}>
            {recContent}
        </ExpandableCard>
    )
}