import { useEffect, useLayoutEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, addDoc, collection } from "firebase/firestore";

//DO NOT CALL THIS MORE THAN ONCE. IT WILL FILL THE DATABASE WITH DUPLICATE ENTRIES.

/*
export default function FirebaseInitialize() {
    useLayoutEffect(() => {
        // Initialize Firebase
        const app = initializeApp(firebaseConfig);

        // Initialize Realtime Database and get a reference to the service
        const db = getFirestore(app);

        const path = './datasets/airlineData.json';

        //let flightData;
        fetch(path).then(response => {
            response.text().then(data => {
                let flightData = JSON.parse(data);
                addData(db, flightData);
            });
        });



    }, []);
    return (<></>);
}

async function addData(db, flightData) {
    console.log(flightData.length);

    flightData = shuffleArray(flightData);
    let max = 5000;
    for (let i = 0; i < flightData.length && i < max; i++) {
        try {
            const docRef = await addDoc(collection(db, "flightData"), flightData[i]);
        } catch (e) {
            max++;
            console.error("Error adding document: ", e);
        }
    }
}

function shuffleArray(array) {
    let arrayCopy = array;
    let currentIndex = array.length;
    let randomIndex;

    while(currentIndex !== 0)
    {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        let k = arrayCopy[currentIndex];
        arrayCopy[currentIndex] = arrayCopy[randomIndex];
        arrayCopy[randomIndex] = k;
    }
    return arrayCopy;
}*/
