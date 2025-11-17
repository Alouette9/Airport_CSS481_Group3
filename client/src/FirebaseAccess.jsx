import { useEffect, useLayoutEffect, useState, useRef, use } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, addDoc, collection, query, getDocs } from "firebase/firestore";
import App from './App.jsx';

export default function FirebaseAccess() {

    //See categories in more detail at https://www.kaggle.com/datasets/jawadkhattak/us-flight-delay-from-january-2017-july-2022
    const jsonSample = useRef([]);
    const databaseRef = useRef(null);
    const [dataChanged, setDataChanged] = useState(false);

    useLayoutEffect(() => {
        // Initialize Firebase
        
        //Uncomment below to use local sample data instead of Firebase. DUring development. Saves on read times.
        const path = './datasets/airlineSampleData.json';
        fetch(path).then(response => {
            response.text().then(data => {
                let flightData = JSON.parse(data);
                jsonSample.current = flightData;
                setDataChanged(true);
            });
        });

        //Uncomment below to use Firebase database
        /*try {
            const firebaseConfig = {
                apiKey: import.meta.env.VITE_API_KEY,
                authDomain: import.meta.env.VITE_AUTH_DOMAIN,
                projectId: import.meta.env.VITE_PROJECT_ID,
                storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
                messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
                appId: import.meta.env.VITE_APP_ID,
                measurementId: import.meta.env.VITE_MEASUREMENT_ID
            }

            const app = initializeApp(firebaseConfig);

            // Initialize Realtime Database and get a reference to the service
            const db = getFirestore(app);
            databaseRef.current = db;

            const collectionRef = collection(db, 'allFlightData');

            const querySnapshot = query(collectionRef);
            const querySnapshotGet = getDocs(querySnapshot).then((querySnapshot) => {
                let flightData = [];
                querySnapshot.forEach((doc) => {
                    flightData.push(doc.data());
                });
                if (flightData.length == 1 && 'data' in flightData[0]) {
                    jsonSample.current = flightData[0].data;
                    console.log(flightData);
                    setDataChanged(true);
                }
                else
                {
                    alert('Unexpected data format from server');
                }

            });
        } catch (e) {
            alert('Unable to connect to server');
            console.log(e);
        }*/
    }, []);

    return (<>
        <App jsonSample={jsonSample} databaseRef={databaseRef} dataChanged={dataChanged} setDataChanged={setDataChanged} />
    </>);
}