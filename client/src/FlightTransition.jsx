import { useEffect, useRef } from "react";

export default function FlightTransition({ playing }) {
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!wrapRef.current) return;
    if (playing) {
      wrapRef.current.classList.add("flight-in");
      // remove the class when the animation ends so it's re-playable
      const t = setTimeout(() => {
        wrapRef.current.classList.remove("flight-in");
      }, 1100); // match CSS duration + small buffer
      return () => clearTimeout(t);
    }
  }, [playing]);

  return (
    <div ref={wrapRef} className="flight-wrap" aria-hidden="true">
      <div className="sky">
        <div className="plane">
          {/* simple plane using emoji; swap for an SVG if you prefer */}
          ✈️
        </div>
        <div className="contrail"></div>
      </div>
    </div>
  );
}
