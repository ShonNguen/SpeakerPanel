import { useState, useEffect } from "react";

// export to be used in every useRequestSpeakers hook
export const REQUEST_STATUS = {
    LOADING: "loading",
    SUCCESS: "success",
    FAILURE: "failure",
};

function useRequestDelay(delayTime = 1000, initialData=[]) {

    const [data, setData] = useState(initialData);
    const [requestStatus, setRequestStatus] = useState(REQUEST_STATUS.LOADING);
    const [error, setError] = useState("");

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    //check the use effect
    //for error handling
    useEffect(() => {
        async function delayFunc() {
            try {
                await delay(delayTime);
                setRequestStatus(REQUEST_STATUS.SUCCESS);
                setData(initialData);
            } catch (e) {
                setRequestStatus(REQUEST_STATUS.FAILURE);
                setError(e);
            }

        }

        delayFunc();
    }, []);

    function updateRecord(recordUpdated, doneCallback) {
        const originalRecords = [...data]; // OptimisticUI: copy of original records in case of error 
        const newRecords = data.map( function(rec) {
            return rec.id === recordUpdated.id ? recordUpdated : rec; 
        }); 

        async function delayFunction() {
            try {
                setData(newRecords); // OptimisticUI: set icon first then check 
                await delay(delayTime); 
                if(doneCallback) { // if the function doneCallback is defined then run the function
                    doneCallback();// to stop the loading animation for favorite
                }
                // setData(newRecords); - without OptimisticUI
            } catch(error) {
                console.log("Error thrown: ", error); 
                if(doneCallback) {
                    doneCallback(); 
                }
                setData(originalRecords); // OptimisticUI: set data in original state in case of error
            }
        }
        delayFunction(); 
    }

    function insertRecord(record, doneCallback) {
        const originalRecords = [...data]; 
        const newRecords = [record, ...data]; 

        async function delayFunction() {
            try {
                setData(newRecords); 
                await delay(delayTime); 
                if(doneCallback) { 
                    doneCallback();
                }
            } catch(error) {
                console.log("Error thrown: ", error); 
                if(doneCallback) {
                    doneCallback(); 
                }
                setData(originalRecords);
            }
        }
        delayFunction(); 
    }

    function deleteRecord(record, doneCallback) {
        const originalRecords = [...data]; 
        const newRecords = data.filter ( function(rec) {
            return rec.id != record.id; 
        })

        async function delayFunction() {
            try {
                setData(newRecords); 
                await delay(delayTime); 
                if(doneCallback) { 
                    doneCallback();
                }
            } catch(error) {
                console.log("Error thrown: ", error); 
                if(doneCallback) {
                    doneCallback(); 
                }
                setData(originalRecords);
            }
        }
        delayFunction(); 
    }

    return {
        data,
        requestStatus, 
        error, 
        updateRecord,
        insertRecord,
        deleteRecord,
    };
}

export default useRequestDelay;