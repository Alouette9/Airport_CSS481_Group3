import './App.css';
import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { ExpandableCard } from './ExpandableCard';

export function Rankings({ filteredData, dataChanged, setNewFilter, newFilter, carrierMap, airportMap }) {

    const airportRankList = useRef(null);
    const carrierRankList = useRef(null);
    const [carrierRankContent, setCarrierRankContent] = useState([]);
    const [airportRankContent, setAirportRankContent] = useState([]);

    useEffect(() => {
        if (newFilter) {
            //let rowInfo = [];
            let top5Carrier = new Array(5);
            let carrierFlights = new Array(5);
            carrierFlights.fill(['', -1, -1]);
            top5Carrier.fill(-1);

            console.log(filteredData)
                //Summarize relevant data by each carrier
            carrierMap.current.forEach((value, key) => {
                //const carrierBox = document.getElementById(key + '_CarrierCheckbox');
                //if (carrierBox && carrierBox.checked) {
                    //Make sure all summarized data only added if they are a specific carrier
                    let flights = filteredData.current.reduce((total, row) => {
                        if (row.carrier === key) {
                            return total + row.arr_flights;
                        }
                        return total;
                    }, 0);

                    let delays = filteredData.current.reduce((total, row) => {
                        if (row.carrier === key) {
                            return total + row.arr_del15;
                        }
                        return total;
                    }, 0);

                    //Push the html string and the data to be sorted into an array
                    //rowInfo.push([flights, delays]);

                    //let row = [flights, delays, delayTime, late, lateDelay, cancel, diverted, carrierIssue, carrierIssueTime];
                    for (let i = 0; i < top5Carrier.length; i++) {
                        //First check if ratio is larger. If equal ratio, compare the total number of flights. Prioritize higher flight number
                        if (top5Carrier[i] < delays / flights || (top5Carrier[i] == delays / flights && carrierFlights[i][2] < flights)) {
                            //Insert into rankings
                            top5Carrier.splice(i, 0, delays / flights);
                            //Pop the last in the rankings
                            top5Carrier.pop();
                            //Insert carrier name, delay num, and flight num
                            carrierFlights.splice(i, 0, [value, delays, flights]);
                            carrierFlights.pop();;
                            break;
                        }
                    }
                //}
            });
            //Update ranking ordered list
            //Remove previous ranking items
            let newCarrierRanking = [];
            for (let i = 0; i < 5; i++) {
                if (top5Carrier[i] >= 0 && carrierFlights[i][0].trim() != '') {
                    newCarrierRanking.push(<tr key={i}><td>{i + 1 + '.'}</td><td>{carrierFlights[i][0]}</td><td>{(top5Carrier[i] * 100).toFixed(2)}%</td></tr>);
                }
            }
            setCarrierRankContent(newCarrierRanking);

            //let rowInfo = [];
            let top5Airport = new Array(5);
            let airportFlights = new Array(5);
            airportFlights.fill(['', -1, -1]);
            top5Airport.fill(-1);

                //Summarize relevant data by each carrier
            airportMap.current.forEach((value, key) => {
                //const carrierBox = document.getElementById(key + '_CarrierCheckbox');
                //if (carrierBox && carrierBox.checked) {
                    //Make sure all summarized data only added if they are a specific carrier
                    let flights = filteredData.current.reduce((total, row) => {
                        if (row.airport === key) {
                            return total + row.arr_flights;
                        }
                        return total;
                    }, 0);

                    let delays = filteredData.current.reduce((total, row) => {
                        if (row.airport === key) {
                            return total + row.arr_del15;
                        }
                        return total;
                    }, 0);

                    //Push the html string and the data to be sorted into an array
                    //rowInfo.push([flights, delays]);

                    //let row = [flights, delays, delayTime, late, lateDelay, cancel, diverted, carrierIssue, carrierIssueTime];
                    for (let i = 0; i < top5Airport.length; i++) {
                        //First check if ratio is larger. If equal ratio, compare the total number of flights. Prioritize higher flight number
                        if (top5Airport[i] < delays / flights || (top5Airport[i] == delays / flights && airportFlights[i][2] < flights)) {
                            //Insert into rankings
                            top5Airport.splice(i, 0, delays / flights);
                            //Pop the last in the rankings
                            top5Airport.pop();
                            //Insert carrier name, delay num, and flight num
                            airportFlights.splice(i, 0, [value, delays, flights]);
                            airportFlights.pop();;
                            break;
                        }
                    }
                //}
            });
            //Update ranking ordered list
            //Remove previous ranking items
            let newAirportRanking = [];
            for (let i = 0; i < 5; i++) {
                if (top5Airport[i] >= 0 && airportFlights[i][0].trim() != '') {
                    newAirportRanking.push(<tr key={i}><td>{i + 1 + '.'}</td><td>{airportFlights[i][0].split(':')[1].trim()}</td><td>{(top5Airport[i] * 100).toFixed(2)}%</td></tr>);
                }
            }
            setAirportRankContent(newAirportRanking);
            setNewFilter(false);
        }
    }, [newFilter]);

    return (<>
        <div className='row center'>
            <div id='airportRanking' className='card'>
                <ExpandableCard title={'Airport Delay Ranking'} initialDisplay={true} expandMode={'static'}>
                    <table id='airportRankingList' ref={airportRankList} className='rankingList'>
                        <tbody>
                        {airportRankContent}
                         </tbody>
                    </table>
                    <p>*Rankings calculated by number of delays divided by total flights</p>
                </ExpandableCard>
            </div>
            <div id='carrierRanking'>
                <ExpandableCard title={'Carrier Delay Ranking'} initialDisplay={true} expandMode={'static'}>
                    <table className='rankingList' id='carrierRankingList' ref={carrierRankList}>
                        <tbody>
                            {carrierRankContent}
                        </tbody>
                        
                    </table>
                    <p>*Rankings calculated by number of delays divided by total flights</p>
                </ExpandableCard>
            </div>
        </div>
    </>)
}