import { ExpandableCard } from "./ExpandableCard";

function GeolocationRecommendation() {
    const [recContent, setRecContent] = useState([]);

    const getIP = () => {
        fetch('https://api.ipgeolocation.io/v2/ipgeo?apiKey=' + import.meta.env.VITE_GEOLOCATION_API_KEY)
        .then((response) => response.text()).then((result)=> console.log(result)).catch((error) => console.log('error', error));
    }

    return (
        <ExpandableCard title={'Carrier and Airport Recommendations'} initialDisplay={true} expandMode={'static'}>
            {recContent}
        </ExpandableCard>
    )
}