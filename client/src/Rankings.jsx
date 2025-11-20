import './App.css';
import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { ExpandableCard } from './ExpandableCard';
import { PieChart} from './PieChart';

export function Rankings({ filteredData, dataChanged, filterSeq, setFilterSeq, carrierMap, airportMap }) {

    const airportRankList = useRef(null);
    const carrierRankList = useRef(null);
    const [carrierRankContent, setCarrierRankContent] = useState([]);
    const [airportRankContent, setAirportRankContent] = useState([]);
    const [summaryContent, setSummaryContent] = useState(null);

    useEffect(() => {

        let top5Carrier = new Array(5);
        let carrierFlights = new Array(5);
        carrierFlights.fill(['', -1, -1]);
        top5Carrier.fill(-1);

            // Summarize relevant data by each carrier
        carrierMap.current.forEach((value, key) => {
            //const carrierBox = document.getElementById(key + '_CarrierCheckbox');
            //if (carrierBox && carrierBox.checked) {                    //Make sure all summarized data only added if they are a specific carrier
            let flights = filteredData.current.reduce((total, row) => {
                    if (row.carrier === key) {
                        return total + Number(row.arr_flights);
                    }
                    return total;
                }, 0);

                let delays = filteredData.current.reduce((total, row) => {
                    if (row.carrier === key) {
                        return total + Number(row.arr_del15);
                    }
                    return total;
                }, 0);

                for (let i = 0; i < top5Carrier.length; i++) {
                    if (top5Carrier[i] < delays / flights || (top5Carrier[i] == delays / flights && carrierFlights[i][2] < flights)) {
                        top5Carrier.splice(i, 0, delays / flights);
                        top5Carrier.pop();
                        carrierFlights.splice(i, 0, [value, delays, flights]);
                        carrierFlights.pop();;
                        break;
                    }
                }
            //}
        });
        //Update ranking ordered list
        let newCarrierRanking = [];
        for (let i = 0; i < 5; i++) {
            if (top5Carrier[i] >= 0 && carrierFlights[i][0].trim() != '') {
                newCarrierRanking.push(<tr key={i}><td>{i + 1 + '.'}</td><td>{carrierFlights[i][0]}</td><td>{(top5Carrier[i] * 100).toFixed(2)}%</td></tr>);
            }
        }
        setCarrierRankContent(newCarrierRanking);

        let top5Airport = new Array(5);
        let airportFlights = new Array(5);
        airportFlights.fill(['', -1, -1]);
        top5Airport.fill(-1);

        airportMap.current.forEach((value, key) => {
            let flights = filteredData.current.reduce((total, row) => {
                if (row.airport === key) {
                    return total + Number(row.arr_flights);
                }
                return total;
            }, 0);

            let delays = filteredData.current.reduce((total, row) => {
                if (row.airport === key) {
                    return total + Number(row.arr_del15);
                }
                return total;
            }, 0);

            for (let i = 0; i < top5Airport.length; i++) {
                if (top5Airport[i] < delays / flights || (top5Airport[i] == delays / flights && airportFlights[i][2] < flights)) {
                    top5Airport.splice(i, 0, delays / flights);
                    top5Airport.pop();
                    airportFlights.splice(i, 0, [value, delays, flights]);
                    airportFlights.pop();;
                    break;
                }
            }
        });

        let newAirportRanking = [];
        for (let i = 0; i < 5; i++) {
            if (top5Airport[i] >= 0 && airportFlights[i][0].trim() != '') {
                newAirportRanking.push(<tr key={i}><td>{i + 1 + '.'}</td><td>{airportFlights[i][0].split(':')[1].trim()}</td><td>{(top5Airport[i] * 100).toFixed(2)}%</td></tr>);
            }
        }
        setAirportRankContent(newAirportRanking);
        try {
            const totalFlights = filteredData.current.reduce((sum, row) => sum + (Number(row.arr_flights) || 0), 0);
            const totalDelays = filteredData.current.reduce((sum, row) => sum + (Number(row.arr_del15) || 0), 0);
            const delayPct = totalFlights ? ((totalDelays / totalFlights) * 100).toFixed(2) : '0.00';
            const carrierSet = new Set(filteredData.current.map(r => r.carrier));
            const airportSet = new Set(filteredData.current.map(r => r.airport));

            const reasonDefs = [
                { key: 'carrier_delay', label: 'Carrier'},
                { key: 'weather_delay', label: 'Weather'},
                { key: 'nas_delay', label: 'NAS'},
                { key: 'security_delay', label: 'Security'},
                { key: 'late_aircraft_delay', label: 'Late aircraft'}
            ];

            const reasonItems = reasonDefs.map(def => ({
                label: def.label,
                value: filteredData.current.reduce((s, r) => s + (Number(r[def.key]) || 0), 0),
            }));

            const totalReason = reasonItems.reduce((s, it) => s + it.value, 0) || 1;

            setSummaryContent(
                <div style={{display: 'flex', gap: '16px', alignItems: 'center'}}>
                    <div>
                        <div id="chartdiv">
                            <PieChart data={reasonItems} />
                        </div>
                        <div style={{marginTop:8, fontSize:12}}><strong>Total delays:</strong> {totalDelays.toLocaleString()}</div>
                    </div>
                </div>
            );
        } catch (e) {
            console.warn('Failed to compute summary', e);
            setSummaryContent(null);
        }
    }, [filterSeq, dataChanged]);

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
            <div id='summaryCard' className='card'>
                <ExpandableCard title={'Delay Reasons'} initialDisplay={true} expandMode={'static'}>
                    {summaryContent}
                </ExpandableCard>
            </div>
        </div>
    </>)
}