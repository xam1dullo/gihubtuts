const dayjs = require("dayjs");
const filters = (load, props) => {
    const {
        transitOperatorType,
        workOpportunityType,
        startLocation,
        endLocation,
        exclude,
        WhiteList,
        MinDistance,
        MaxDistance,
        MaxDuration,
        MinDuration,
        include,
        payout,
        firstPickupTime,
        lastDeliveryTime,
        stopCount,
        trailerStatus,
        equipmentType,
        totalDistance,
        rate,
        loadType,
        filterStatus,
    } = props;

    console.table({exclude})
    if (!load.hasOwnProperty('version') || !load.hasOwnProperty('id') || !load.hasOwnProperty('payout') || !load.payout.hasOwnProperty('value')) {
        console.log({mag: "error 1 qatorda"})
        return false;
    }


    // Check
    /*  if (cacheCheck({"id": load.id, "version": load.version}) || treasureCheck({"id": load.id, "payout": load.payout.value})) {
    //     return false
    //   }*/

    //Payout
    if (payout && (isNaN(load.payout.value) || !load.hasOwnProperty('payout') || load.payout.value < payout.value || typeof load.payout.value !== "number")) {
        console.log({
            loadPayout: load.payout.value,
            payout: payout.value,
            notequail: load.payout.value !== payout,
            hasPayout: load.payout.hasOwnProperty('value'),
            typeofPayout: typeof load.payout.value,
            big: load.payout.value > payout.value,
            small: load.payout.value < payout.value,
            isNaN: isNaN(load.payout.value),
        })

        return false;
    }

    console.log({
        loadType,
        load: load.loads[0].loadType,
    })
    if (loadType && load.loads[0].loadType !== loadType || typeof load.loads[0].loadType !== "string") {
        return false;
    }
    // stopCount
    if (stopCount && (load.stopCount == "NaN" || !load.hasOwnProperty('stopCount') || typeof load.stopCount !== "number" || typeof stopCount !== "number" || load.stopCount < 0 || load.stopCount > stopCount || load.stopCount !== stopCount)) {
        console.log({
            stopCount,
            loadStopCount: load.stopCount
        })
        return false
    }
//transitOperatorType
    if (transitOperatorType && (!load.hasOwnProperty('transitOperatorType') || load.transitOperatorType !== transitOperatorType || typeof load.transitOperatorType !== "string")) {
        console.log({
            transitOperatorType,
            loadTransitOperatorType: load.transitOperatorType
        })
        return false
    }
//Buffer time AKA Minimum range
    /*if (bufferTime) {
      if (!load.hasOwnProperty('firstPickupTime') || toTimestamp(load.firstPickupTime) < bufferTimestamp()) {
        return false
      }
    }*/


//monetaryAmount
    const monetaryAmount = load.aggregatedCostItems.find(element => element.name === "Base Rate").monetaryAmount.value;
    if (typeof monetaryAmount !== "number" || typeof (load.totalDistance.value) != "number" || monetaryAmount < 0 || load.totalDistance.value < 0 || !load.totalDistance.hasOwnProperty("value")) {
        console.log({
            monetaryAmount,
        })
        return false
    }


//Rate
    let loadReate = monetaryAmount / load.totalDistance.value;


    if (rate && (loadReate < rate.value || isNaN(loadReate) || loadReate == "Infinity") || typeof loadReate !== "number") {
        console.log({
            rate: rate.value,
            loadReate: loadReate,
        })
        return false
    }

//Exclude covered load
    /* if (ignoreRecovery) {
       if (!load.hasOwnProperty('startLocation') || !load.startLocation.hasOwnProperty('label') || load.startLocation.label.indexOf("_ITR") > -1) {
         return false;
       }
     }*/


// startLocation
    if (startLocation) {
        if (!load.hasOwnProperty("startLocation")) {
            console.log("Error One 140 line")
            return false;
        }
        const {
            city, //array
            state,//array
        } = startLocation;


        let sumCity = 0;
        let sumState = 0;
        load.loads[0].stops.filter((item) => {
            const {city: loadCity} = item.location;
            const {state: loadState} = item.location;
            if (city.includes(loadCity)) {
                sumCity++;
            }
            if (state.includes(loadState)) {
                sumState++;
            }
        })
        if (sumState == 0 || sumCity == 0) {

            console.table({
                state,
                city,
                loadCity: load.startLocation.city,
                loadState: load.startLocation.state,
                sumState,
                sumCity,
            })
            return false
        }


    }

// endLocation
    if (endLocation) {
        if (!load.hasOwnProperty("endLocation")) {
            console.log("Error One 140 line")
            return false;
        }

        const {
            city, //array
            state,//array
        } = endLocation;

        let sumCity = 0;
        let sumState = 0;
        load.loads[0].stops.filter((item) => {
            const {city: loadCity} = item.location;
            const {state: loadState} = item.location;
            if (city.includes(loadCity)) {
                sumCity++;
            }
            if (state.includes(loadState)) {
                sumState++;
            }
        })
        if (sumState == 0 || sumCity == 0) {
            console.count({state})
            console.table({
                sumState,
                sumCity,
            })
            return false
        }
    }

    //exclude
    if (exclude) {
        const {
            city, //array
            state,//array
        } = exclude;

        let sumCity = 0;
        let sumState = 0;
        load.loads[0].stops.filter((item) => {
            const {city: loadCity} = item.location;
            const {state: loadState} = item.location;
            if (!city.includes(loadCity)) {
                sumCity++;
            }
            if (!state.includes(loadState)) {
                sumState++;
            }
        })
        if (sumState == 0 || sumCity == 0) {
            console.count({state})
            console.table({
                sumState,
                sumCity,
            })
            return false
        }
    }
    //whitelist
    // if (whitelist) {
    //     const {
    //         city, //array
    //         state,//array
    //     } = whitelist;
    //
    //     let sumCity = 0;
    //     let sumState = 0;
    //     load.loads[0].stops.filter((item) => {
    //         const {city: loadCity} = item.location;
    //         const {state: loadState} = item.location;
    //         if (city.includes(loadCity)) {
    //             sumCity++;
    //         }
    //         if (state.includes(loadState)) {
    //             sumState++;
    //         }
    //     })
    //     if (sumState == 0 || sumCity == 0) {
    //         console.count({state})
    //         console.table({
    //             sumState,
    //             sumCity,
    //         })
    //         return false
    //     }
    // }
    //
    // trailerLoadingStatus
    if (trailerStatus && (load.loads[0].stops[0].trailerDetails[0].trailerLoadingStatus !== trailerStatus)) {
        console.log({
            trailerStatus,
            loadTrailerStatus: load.loads[0].stops[0].trailerDetails[0].trailerLoadingStatus
        })
        return false
    }

// workOpportunityType


    if (workOpportunityType && (load.workOpportunityType != workOpportunityType || typeof workOpportunityType !== "string")) {
        console.log({
            workOpportunityType,
            loadWorkOpportunityType: load.workOpportunityType,
            equal: load.workOpportunityType !== workOpportunityType,
            equl2: load.workOpportunityType == workOpportunityType,
            type: typeof workOpportunityType !== "string",
        })
        return false;
        console.log("ok")
    }

//equipmentType
    if (equipmentType && (load.loads[0].equipmentType !== equipmentType || !load.loads[0].hasOwnProperty("equipmentType"))) {
        console.log({
            equipmentType,
            equipmentType2: load.loads[0].equipmentType
        })
        return false;
    }
//totalDistance
    if (totalDistance && (load.totalDistance.value !== totalDistance || typeof load.totalDistance.value !== "number" || !load.hasOwnProperty("totalDistance"))) {
        console.log({
            totalDistance,
            totalDistance2: load.totalDistance.value
        })
        return false;
    }

// PickupTime
    const firstPickupTimeISO = dayjs(firstPickupTime)
    const firstPickupTimeISOData = dayjs(load.firstPickupTime)
    const diffPickUp = firstPickupTimeISO.diff(firstPickupTimeISOData, "hour")

    if (firstPickupTime && (diffPickUp == "NaN" || diffPickUp > 0)) {
        console.log({
            firstPickupTime,
            loadFirstPickupTime: load.firstPickupTime,
        })
        return false
    }
// lastDeliveryTime
    const deliveryTimeISO = dayjs(lastDeliveryTime);
    const lastDeliveryTimeISO = dayjs(load.lastDeliveryTime)

    const diffDelivery = deliveryTimeISO.diff(lastDeliveryTimeISO, "hour")
    console.table({
        diffDelivery,
        lastDeliveryTime,
        deliveryTimeISO,
        lastDeliveryTimeISO,
        loadLastDeliveryTime: load.lastDeliveryTime,
        NaN: diffDelivery === "NaN",
        log: "NaN"

    })
    if (lastDeliveryTime && (diffDelivery == "NaN" || diffDelivery < 0 || !load.hasOwnProperty("lastDeliveryTime"))) {
        console.log({
            diffDelivery
        })
        return false
    }


// MinDuration
    if (MinDuration && (load.totalDuration < MinDuration)) {
        console.log({
            MinDuration,
            loadMinDuration: load.totalDuration
        })
        return false
    }
// maxDuration
    if (MaxDuration && (load.totalDuration < MaxDuration)) {
        console.log({
            MaxDuration,
            loadMaxDuration: load.totalDuration
        })
        return false
    }

// MinDistance
    if (MinDistance && (load.totalDistance.value > MinDistance)) {
        console.log({
            MinDistance,
            loadMinDistance: load.totalDistance.value
        })
        return false

    }

// MaxDistance
    if (MaxDistance && (load.totalDistance > MaxDistance)) {
        console.log({
            MaxDistance,
            loadMaxDistance: load.totalDistance
        })
        return false
    }


    console.log({msg: "congratulation"})
    return true
}


module.exports = {filters}