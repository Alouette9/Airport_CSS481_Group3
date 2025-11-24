import './App.css';
import { useRef, useState, useEffect } from 'react';
import { ExpandableCard } from './ExpandableCard';
import { PieChart } from './PieChart';
import GeolocationRecommendation from "./GeolocationRecommendation";
import reviews from "./datasets/airlineReviews.json";
import Reviews from "./Reviews";

export function Rankings({ filteredData, dataChanged, filterSeq, setFilterSeq, carrierMap, airportMap }) {

    const airportRankList = useRef(null);
    const carrierRankList = useRef(null);
    const [carrierRankContent, setCarrierRankContent] = useState([]);
    const [airportRankContent, setAirportRankContent] = useState([]);
    const [summaryContent, setSummaryContent] = useState(null);

    useEffect(() => {

        // Carrier Ranking
        let top5Carrier = Array(5).fill(-1);
        let carrierFlights = Array(5).fill(['', -1, -1]);

        carrierMap.current.forEach((value, key) => {
            let flights = filteredData.current.reduce((t, r) => t + (r.carrier === key ? Number(r.arr_flights) : 0), 0);
            let delays = filteredData.current.reduce((t, r) => t + (r.carrier === key ? Number(r.arr_del15) : 0), 0);

            for (let i = 0; i < 5; i++) {
                if (top5Carrier[i] < delays / flights ||
                    (top5Carrier[i] === delays / flights && carrierFlights[i][2] < flights)) {

                    top5Carrier.splice(i, 0, delays / flights);
                    top5Carrier.pop();

                    carrierFlights.splice(i, 0, [value, delays, flights]);
                    carrierFlights.pop();
                    break;
                }
            }
        });

        let newCarrierRanking = [];
        for (let i = 0; i < 5; i++) {
            if (top5Carrier[i] >= 0 && carrierFlights[i][0].trim() !== '') {
                newCarrierRanking.push(
                    <tr key={i}>
                        <td>{i + 1}.</td>
                        <td>{carrierFlights[i][0]}</td>
                        <td>{(top5Carrier[i] * 100).toFixed(2)}%</td>
                    </tr>
                );
            }
        }
        setCarrierRankContent(newCarrierRanking);


        // Airport Ranking
        let top5Airport = Array(5).fill(-1);
        let airportFlights = Array(5).fill(['', -1, -1]);

        airportMap.current.forEach((value, key) => {
            let flights = filteredData.current.reduce((t, r) => t + (r.airport === key ? Number(r.arr_flights) : 0), 0);
            let delays = filteredData.current.reduce((t, r) => t + (r.airport === key ? Number(r.arr_del15) : 0), 0);

            for (let i = 0; i < 5; i++) {
                if (top5Airport[i] < delays / flights ||
                    (top5Airport[i] === delays / flights && airportFlights[i][2] < flights)) {

                    top5Airport.splice(i, 0, delays / flights);
                    top5Airport.pop();

                    airportFlights.splice(i, 0, [value, delays, flights]);
                    airportFlights.pop();
                    break;
                }
            }
        });

        let newAirportRanking = [];
        for (let i = 0; i < 5; i++) {
            if (top5Airport[i] >= 0 && airportFlights[i][0].trim() !== '') {
                newAirportRanking.push(
                    <tr key={i}>
                        <td>{i + 1}.</td>
                        <td>{airportFlights[i][0].split(':')[1].trim()}</td>
                        <td>{(top5Airport[i] * 100).toFixed(2)}%</td>
                    </tr>
                );
            }
        }
        setAirportRankContent(newAirportRanking);


        // Delay reasons Pie Chart
        const reasonDefs = [
            { key: 'carrier_delay', label: 'Carrier' },
            { key: 'weather_delay', label: 'Weather' },
            { key: 'nas_delay', label: 'NAS' },
            { key: 'security_delay', label: 'Security' },
            { key: 'late_aircraft_delay', label: 'Late aircraft' }
        ];

        const reasonItems = reasonDefs.map(def => ({
            label: def.label,
            value: filteredData.current.reduce((s, r) => s + (Number(r[def.key]) || 0), 0),
        }));

        const totalDelays = reasonItems.reduce((s, it) => s + it.value, 0);

        try {
            setSummaryContent(
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', overflow:'scroll', minWidth:'calc(45vw - 10px)', minHeight:'calc(45vh - 10px)' }}>
                    <div>
                        <div id="chartdiv">
                            <PieChart data={reasonItems} />
                        </div>
                        <div style={{ marginTop: 8, fontSize: 12 }}>
                            <strong>Total delays:</strong> {totalDelays.toLocaleString()}
                        </div>
                    </div>
                </div>
            );
        } catch (e) {
            console.warn('Failed to compute summary', e);
            setSummaryContent(null);
        }

    }, [filterSeq, dataChanged]);

    return (
        <>
            <div className='row center'>
                    <ExpandableCard title={'Airport Delay Ranking'} initialDisplay={true} expandMode={'static'} widthPercent={30} minheightPercent={23}>
                        <table id='airportRankingList' ref={airportRankList} className='rankingList'>
                            <tbody>{airportRankContent}</tbody>
                        </table>
                        <p>*Rankings calculated by number of delays divided by total flights</p>
                    </ExpandableCard>

                    <ExpandableCard title={'Carrier Delay Ranking'} initialDisplay={true} expandMode={'static'} widthPercent={30} minheightPercent={23}>
                        <table className='rankingList' id='carrierRankingList' ref={carrierRankList}>
                            <tbody>{carrierRankContent}</tbody>
                        </table>
                        <p>*Rankings calculated by number of delays divided by total flights</p>
                    </ExpandableCard>
                    <GeolocationRecommendation filteredData={filteredData} filterSeq={filterSeq}/>
            </div>
            <div className='row center'>
                <div id='summaryCard' className='card'>
                    <ExpandableCard title={'Delay Reasons'} initialDisplay={true} expandMode={'static'} widthPercent={45} minheightPercent={45}>
                        {summaryContent}
                    </ExpandableCard>
                </div>
                <Reviews data={reviews}></Reviews>
            </div>
        </>
    );
}
