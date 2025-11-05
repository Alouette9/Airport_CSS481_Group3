import { useState } from "react";
import { ExpandableCard } from "./ExpandableCard";

export function Prediction({ jsonSample, carrierMap, airportMap, earliestDate, latestDate, filteredData }) {
  const [carrier, setCarrier] = useState("");
  const [airport, setAirport] = useState("");
  const [ym, setYm] = useState("");
  const [reason, setReason] = useState("");
  const [result, setResult] = useState(null);
  const [breakdown, setBreakdown] = useState([]);

  const carrierOptions = (() => {
    const out = [{ label: "No Selection", value: "" }];
    carrierMap.current.forEach((v, k) => out.push({ label: v, value: k }));
    return out;
  })();

  const airportOptions = (() => {
    const out = [{ label: "No Selection", value: "" }];
    airportMap.current.forEach((v, k) => out.push({ label: v, value: k }));
    return out;
  })();

  const monthOptions = (() => {
    const [ey, em] = earliestDate.current;
    const [ly, lm] = latestDate.current;
    const pads = (n) => (n < 10 ? `0${n}` : `${n}`);
    const seq = [];
    if (ey <= ly) {
      let y = ey, m = em;
      while (y < ly || (y === ly && m <= lm)) {
        seq.push({ label: `${y}-${pads(m)}`, value: `${y}-${pads(m)}` });
        m++;
        if (m > 12) { m = 1; y++; }
      }
    }
    return [{ label: "No Selection", value: "" }, ...seq];
  })();

  const reasonOptions = [
    { label: "No Selection", value: "" },
    { label: "All", value: "allDelays" },
    { label: "Carrier", value: "carrier" },
    { label: "Weather", value: "weather" },
    { label: "NAS (Traffic)", value: "nas" },
    { label: "Security", value: "security" },
    { label: "Late Aircraft", value: "late" },
  ];

  function delayPredictionCalculator(values) {
    const data = (filteredData?.current?.length ? filteredData.current : jsonSample.current) || [];
    const matchYM = (row) => {
      if (!values.ym) return true;
      const [yy, mm] = values.ym.split("-").map(Number);
      return row.year === yy && row.month === mm;
    };
    const matchCarrier = (row) => (values.carrier ? row.carrier === values.carrier : true);
    const matchAirport = (row) => (values.airport ? row.airport === values.airport : true);

    const subset = data.filter((r) => matchYM(r) && matchCarrier(r) && matchAirport(r));
    const baseSet = subset.length ? subset : data;

    const sum = (arr, f) => arr.reduce((t, r) => t + f(r), 0);
    const safeRatio = (num, den) => (den > 0 ? num / den : 0);

    const totalDelay = sum(baseSet, (r) => r.arr_delay || 0);
    const totalDelayedFlights = sum(baseSet, (r) => r.arr_del15 || 0);
    const baseAvg = safeRatio(totalDelay, totalDelayedFlights);

    const overall = {
      avg: baseAvg,
      carrierAvg: avgForKey(baseSet, "carrier", values.carrier),
      airportAvg: avgForKey(baseSet, "airport", values.airport),
      monthAvg: avgForMonth(baseSet, values.ym),
      reasonAvg: avgForReason(baseSet, values.reason),
    };

    const contributions = [];
    if (values.carrier) contributions.push({ label: "Carrier effect", minutes: overall.carrierAvg - overall.avg });
    if (values.airport) contributions.push({ label: "Airport effect", minutes: overall.airportAvg - overall.avg });
    if (values.ym) contributions.push({ label: "Month effect", minutes: overall.monthAvg - overall.avg });
    if (values.reason) contributions.push({ label: "Reason effect", minutes: overall.reasonAvg - overall.avg });

    const totalMinutes = Math.max(0, round2(overall.avg + contributions.reduce((t, c) => t + c.minutes, 0)));

    return {
      totalMinutes,
      breakdown: contributions.map((c) => ({ ...c, minutes: round2(c.minutes) })),
      baseline: round2(overall.avg),
    };

    function round2(n) { return Math.round(n * 100) / 100; }
    function avgForKey(arr, key, sel) {
      if (!sel) return avg(arr);
      const sub = arr.filter((r) => r[key] === sel);
      return avg(sub.length ? sub : arr);
    }
    function avgForMonth(arr, yymm) {
      if (!yymm) return avg(arr);
      const [yy, mm] = yymm.split("-").map(Number);
      const sub = arr.filter((r) => r.year === yy && r.month === mm);
      return avg(sub.length ? sub : arr);
    }
    function avgForReason(arr, reasonVal) {
      if (!reasonVal || reasonVal === "allDelays") return avg(arr);
      const map = {
        carrier: (r) => r.carrier_delay || 0,
        weather: (r) => r.weather_delay || 0,
        nas: (r) => r.nas_delay || 0,
        security: (r) => r.security_delay || 0,
        late: (r) => r.late_aircraft_delay || 0,
      };
      const num = sum(arr, map[reasonVal]);
      const den = sum(arr, (r) => r.arr_del15 || 0);
      return safeRatio(num, den);
    }
    function avg(arr) {
      const num = sum(arr, (r) => r.arr_delay || 0);
      const den = sum(arr, (r) => r.arr_del15 || 0);
      return safeRatio(num, den);
    }
  }

  function onSubmit(e) {
    e.preventDefault();
    const values = { carrier, airport, ym, reason };
    const res = delayPredictionCalculator(values);
    setResult({ minutes: res.totalMinutes, baseline: res.baseline });
    setBreakdown(res.breakdown);
  }

  function onReset() {
    setCarrier("");
    setAirport("");
    setYm("");
    setReason("");
    setResult(null);
    setBreakdown([]);
  }

  return (
    <div className="row center">
      <ExpandableCard title={"Prediction"} initialDisplay={true} expandMode={"static"}>
        <form className="expandRow" onSubmit={onSubmit}>
          <div className="expandRow">
            <label htmlFor="pred-carrier">Carrier</label>
            <select id="pred-carrier" value={carrier} onChange={(e) => setCarrier(e.target.value)}>
              {carrierOptions.map((o) => (
                <option key={`c-${o.value || "none"}`} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <div className="expandRow">
            <label htmlFor="pred-airport">Airport</label>
            <select id="pred-airport" value={airport} onChange={(e) => setAirport(e.target.value)}>
              {airportOptions.map((o) => (
                <option key={`a-${o.value || "none"}`} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <div className="expandRow">
            <label htmlFor="pred-month">Month</label>
            <select id="pred-month" value={ym} onChange={(e) => setYm(e.target.value)}>
              {monthOptions.map((o) => (
                <option key={`m-${o.value || "none"}`} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <div className="expandRow">
            <label htmlFor="pred-reason">Delay Reason</label>
            <select id="pred-reason" value={reason} onChange={(e) => setReason(e.target.value)}>
              {reasonOptions.map((o) => (
                <option key={`r-${o.value || "none"}`} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <div className="expandRow" style={{ gap: 8, marginTop: 8 }}>
            <button type="submit">Submit</button>
            <button type="button" onClick={onReset}>Reset</button>
          </div>
        </form>

        {result && (
          <div className="expandRow" style={{ marginTop: 12 }}>
            <div className="card" style={{ padding: 12 }}>
              <div><strong>Estimated delay per delayed flight:</strong> {result.minutes} min</div>
              <div style={{ opacity: 0.8 }}>Baseline: {result.baseline} min</div>
              {breakdown.length > 0 && (
                <table className="rankingList" style={{ marginTop: 8 }}>
                  <thead>
                    <tr><th>Component</th><th>Effect (min)</th></tr>
                  </thead>
                  <tbody>
                    {breakdown.map((b, i) => (
                      <tr key={i}><td>{b.label}</td><td>{b.minutes >= 0 ? `+${b.minutes}` : `${b.minutes}`}</td></tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </ExpandableCard>
    </div>
  );
}
