<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> f0f5d634abf107f4943299095e0e694839fac42a
>>>>>>> 63d006dce74baff3efdfdce1c5cfd30a4c82c11d
const dayjs = require("dayjs");

/*
  payout: payOut - minimum,
  is_round_trip: is_round_trip - Boolean //TODO Delete is_round_trip from DB and server api code Mardonbek
  work_type: workType - round-trip ,//TODO add "workOpportunityType": "ONE_WAY", "ROUND_TRIP"
  rate: rate - minimum totalDistance/base rate,
  stop: stop - maximum,

  //Origin - stops[1]
  origin_country: origin_country - US, //TODO send data to Mongo DB
  origin_state: origin_state - States list,
  origin_city: origin_city - Cities list,

  //destination - stops[stops.length - 1]
  destination_country: destination_country,
  destination_state: destination_state,
  destination_city: destination_city,

  //stops not include
  exclude_warehouse: exclude_warehouse,
  exclude_state: exclude_state,
  exclude_city: exclude_city,

  //stops include TODO NOT DOING
  WhiteList_warehouse: WhiteList_warehouse,
  WhiteList_state: WhiteList_state,
  WhiteList_city: WhiteList_city,

  //Constant WORK_OPPORTUNITY_TYPE : ["ONE_WAY", "ROUND_TRIP"]
  //TODO add "exclude_covered_load" to the UI
  exclude_covered_load: exclude_covered_load, - //check if name includes "RTF" TODO add "excludeCoveredLoad" ask Ilhom
  first_pickup_time: first_pickup_time - // TODO remove diff = 0, diff !== -1 minumum,
  end_time: end_time, // TODO remove from filter
  trip_length_min: trip_length_min, // totalDistance min
  trip_length_max: trip_length_max, // totalDistance max
  trip_duration_min: trip_length_min, // totalDuration min
  trip_duration_max: trip_length_max, // totalDuration max
  trailer_status: trailer_status, //TODO add "trailerStatus" location
  load_type: load_type, //loadingType //TODO add "loadingType": "PRELOADED", "LIVE"
  driver_type: driver_type, // transitOperatorType //TODO add "transitOperatorType": "SINGLE_DRIVER", "TEAM_DRIVER"
  equipment: equipment, //TODO add "equipment" name and values
  start_time: start_time,  - //"firstPickupTime"
  end_time: end_time  -     //"lastDeliveryTime"
*/

const filters = (load, props) => {

    const {
        rate,
        payout,
        pickupTime,
        stop,
        trailerStatus,
        equipmentType,
        totalDistance,
        loadType,
        exclude
    } = props;

    //Sanity check
    if (!load.hasOwnProperty('version') || !load.hasOwnProperty('id') || !load.hasOwnProperty('payout') || !load.payout.hasOwnProperty('value')) {
        return false;
    }


    // Check
    // cache
    /*  if (cacheCheck({"id": load.id, "version": load.version}) || treasureCheck({"id": load.id, "payout": load.payout.value})) {
    //     return false
    //   }*/

    //Payout

    if (payout && (!load.hasOwnProperty('payout') || load.payout.value < payout || typeof load.payout.value !== "number")) {

        return false;
    }


    //Stop
    const stopCount = load.stopCount
    if (stop && (!load.hasOwnProperty('stopCount') || isNaN(stopCount) || stopCount > stop || typeof stopCount !== "number" || stopCount < 0)) {
        return false
    }
    //Buffer time AKA Minimum range
    /*if (bufferTime) {
      if (!load.hasOwnProperty('firstPickupTime') || toTimestamp(load.firstPickupTime) < bufferTimestamp()) {
        return false
      }
    }*/

    //Total distance sanity check
    if (!load.hasOwnProperty('totalDistance') || !load.totalDistance.hasOwnProperty('value') || isNaN(load.totalDistance.value)) {
        return false;
    }


    const monetaryAmount = load.aggregatedCostItems.find(element => element.name === "Base Rate").monetaryAmount.value;
    if (typeof monetaryAmount !== "number" || typeof (load.totalDistance.value) != "number" || monetaryAmount < 0 || load.totalDistance.value < 0 || !load.totalDistance.hasOwnProperty("value")) {
        return false
    }


    //Rate
    let actualRate = monetaryAmount / load.totalDistance.value;
    // actualRate = +actualRate
    if (rate && (actualRate < rate || typeof actualRate !== "number" || actualRate == "Infinity")) {
        return false
    }

    //Exclude covered load
    /* if (ignoreRecovery) {
       if (!load.hasOwnProperty('startLocation') || !load.startLocation.hasOwnProperty('label') || load.startLocation.label.indexOf("_ITR") > -1) {
         return false;
       }
     }*/

    // Exclude warehouse
    if (exclude && exclude.length > 0) {
        if (!load.hasOwnProperty("loads")) {
            return false;
        }
        for (let loadList of load.loads) {
            for (let stop of loadList.stops) {
                if (!stop.hasOwnProperty('location') || !stop.location.hasOwnProperty('city')) {
                    return false;
                }
                let isForbidden = exclude.some(item => stop.location.city.indexOf(item) > -1)
                if (isForbidden) {
                    return false;
                }
            }
        }
    }


    // trailerLoadingStatus


    if (trailerStatus && (load.loads[0].stops[0].trailerDetails[0].trailerLoadingStatus !== trailerStatus || typeof trailerStatus !== "string" || typeof trailerStatus == "undefined" || !load.loads[0].stops[0].trailerDetails[0].hasOwnProperty("trailerLoadingStatus"))) {
        return false;
    }

    //equipmentType
    if (equipmentType && (load.loads[0].equipmentType !== equipmentType || !load.loads[0].hasOwnProperty("equipmentType"))) {
        return false;
    }
    //totalDistance
    if (totalDistance && (load.totalDistance.value !== totalDistance || typeof load.totalDistance.value !== "number" || !load.hasOwnProperty("totalDistance"))) {
        return false;
    }
    // loadingType
    if (loadType && (load.loads[0].stops[0].loadType !== loadType || typeof load.loads[0].loadType !== "string" || !load.loads[0].stops[0].hasOwnProperty("loadType"))) {
        return false;
    }
    // PickupTime
    const pickupTimeISO = dayjs(pickupTime)
    const firstPickupTimeISO = dayjs(load.firstPickupTime)
    const diff = firstPickupTimeISO.diff(pickupTimeISO);
    if (pickupTime && (diff == "NaN" || diff > 0 || !load.hasOwnProperty("firstPickupTime"))) {
        return false
    }

    return true;
}

module.exports = {filters}

<<<<<<< HEAD


/*
=======
=======
  // Exclude warehouse
  if (exclude && exclude.length > 0) {
    if (!load.hasOwnProperty("loads")) {
      return false;
    }
    for (let loadList of load.loads) {
      for (let stop of loadList.stops) {
        if (
          !stop.hasOwnProperty("location") ||
          !stop.location.hasOwnProperty("city")
        ) {
          return false;
        }
        let isForbidden = exclude.some(
          (item) => stop.location.city.indexOf(item) > -1
        );
        if (isForbidden) {
          return false;
        }
      }
    }
  }

  // trailerLoadingStatus

  if (
    trailerStatus &&
    (load.loads[0].stops[0].trailerDetails[0].trailerLoadingStatus !==
      trailerStatus ||
      typeof trailerStatus !== "string" ||
      typeof trailerStatus == "undefined" ||
      !load.loads[0].stops[0].trailerDetails[0].hasOwnProperty(
        "trailerLoadingStatus"
      ))
  ) {
    return false;
  }const dayjs = require("dayjs");

/*
  payout: payOut - minimum,
  is_round_trip: is_round_trip - Boolean //TODO Delete is_round_trip from DB and server api code Mardonbek
  work_type: workType - round-trip ,//TODO add "workOpportunityType": "ONE_WAY", "ROUND_TRIP"
  rate: rate - minimum totalDistance/base rate,
  stop: stop - maximum,

  //Origin - stops[1]
  origin_country: origin_country - US, //TODO send data to Mongo DB
  origin_state: origin_state - States list,
  origin_city: origin_city - Cities list,

  //destination - stops[stops.length - 1]
  destination_country: destination_country,
  destination_state: destination_state,
  destination_city: destination_city,

  //stops not include
  exclude_warehouse: exclude_warehouse,
  exclude_state: exclude_state,
  exclude_city: exclude_city,

  //stops include TODO NOT DOING
  WhiteList_warehouse: WhiteList_warehouse,
  WhiteList_state: WhiteList_state,
  WhiteList_city: WhiteList_city,

  //Constant WORK_OPPORTUNITY_TYPE : ["ONE_WAY", "ROUND_TRIP"]
  //TODO add "exclude_covered_load" to the UI
  exclude_covered_load: exclude_covered_load, - //check if name includes "RTF" TODO add "excludeCoveredLoad" ask Ilhom
  first_pickup_time: first_pickup_time - // TODO remove diff = 0, diff !== -1 minumum,
  end_time: end_time, // TODO remove from filter
  trip_length_min: trip_length_min, // totalDistance min
  trip_length_max: trip_length_max, // totalDistance max
  trip_duration_min: trip_length_min, // totalDuration min
  trip_duration_max: trip_length_max, // totalDuration max
  trailer_status: trailer_status, //TODO add "trailerStatus" location
  load_type: load_type, //loadingType //TODO add "loadingType": "PRELOADED", "LIVE"
  driver_type: driver_type, // transitOperatorType //TODO add "transitOperatorType": "SINGLE_DRIVER", "TEAM_DRIVER"
  equipment: equipment, //TODO add "equipment" name and values
  start_time: start_time,  - //"firstPickupTime"
  end_time: end_time  -     //"lastDeliveryTime"
*/

const filters = (load, props) => {

    const {
        rate,
        payout,
        pickupTime,
        stop,
        trailerStatus,
        equipmentType,
        totalDistance,
        loadType,
        exclude
    } = props;

    //Sanity check
    if (!load.hasOwnProperty('version') || !load.hasOwnProperty('id') || !load.hasOwnProperty('payout') || !load.payout.hasOwnProperty('value')) {
        return false;
    }


    // Check
    // cache
    /*  if (cacheCheck({"id": load.id, "version": load.version}) || treasureCheck({"id": load.id, "payout": load.payout.value})) {
    //     return false
    //   }*/

    //Payout

    if (payout && (!load.hasOwnProperty('payout') || load.payout.value < payout || typeof load.payout.value !== "number")) {

        return false;
    }


    //Stop
    const stopCount = load.stopCount
    if (stop && (!load.hasOwnProperty('stopCount') || isNaN(stopCount) || stopCount > stop || typeof stopCount !== "number" || stopCount < 0)) {
        return false
    }
    //Buffer time AKA Minimum range
    /*if (bufferTime) {
      if (!load.hasOwnProperty('firstPickupTime') || toTimestamp(load.firstPickupTime) < bufferTimestamp()) {
        return false
      }
    }*/

    //Total distance sanity check
    if (!load.hasOwnProperty('totalDistance') || !load.totalDistance.hasOwnProperty('value') || isNaN(load.totalDistance.value)) {
        return false;
    }


    const monetaryAmount = load.aggregatedCostItems.find(element => element.name === "Base Rate").monetaryAmount.value;
    if (typeof monetaryAmount !== "number" || typeof (load.totalDistance.value) != "number" || monetaryAmount < 0 || load.totalDistance.value < 0 || !load.totalDistance.hasOwnProperty("value")) {
        return false
    }


    //Rate
    let actualRate = monetaryAmount / load.totalDistance.value;
    // actualRate = +actualRate
    if (rate && (actualRate < rate || typeof actualRate !== "number" || actualRate == "Infinity")) {
        return false
    }

    //Exclude covered load
    /* if (ignoreRecovery) {
       if (!load.hasOwnProperty('startLocation') || !load.startLocation.hasOwnProperty('label') || load.startLocation.label.indexOf("_ITR") > -1) {
         return false;
       }
     }*/

    // Exclude warehouse
    if (exclude && exclude.length > 0) {
        if (!load.hasOwnProperty("loads")) {
            return false;
        }
        for (let loadList of load.loads) {
            for (let stop of loadList.stops) {
                if (!stop.hasOwnProperty('location') || !stop.location.hasOwnProperty('city')) {
                    return false;
                }
                let isForbidden = exclude.some(item => stop.location.city.indexOf(item) > -1)
                if (isForbidden) {
                    return false;
                }
            }
        }
    }


    // trailerLoadingStatus


    if (trailerStatus && (load.loads[0].stops[0].trailerDetails[0].trailerLoadingStatus !== trailerStatus || typeof trailerStatus !== "string" || typeof trailerStatus == "undefined" || !load.loads[0].stops[0].trailerDetails[0].hasOwnProperty("trailerLoadingStatus"))) {
        return false;
    }

    //equipmentType
    if (equipmentType && (load.loads[0].equipmentType !== equipmentType || !load.loads[0].hasOwnProperty("equipmentType"))) {
        return false;
    }
    //totalDistance
    if (totalDistance && (load.totalDistance.value !== totalDistance || typeof load.totalDistance.value !== "number" || !load.hasOwnProperty("totalDistance"))) {
        return false;
    }
    // loadingType
    if (loadType && (load.loads[0].stops[0].loadType !== loadType || typeof load.loads[0].loadType !== "string" || !load.loads[0].stops[0].hasOwnProperty("loadType"))) {
        return false;
    }
    // PickupTime
    const pickupTimeISO = dayjs(pickupTime)
    const firstPickupTimeISO = dayjs(load.firstPickupTime)
    const diff = firstPickupTimeISO.diff(pickupTimeISO);
    if (pickupTime && (diff == "NaN" || diff > 0 || !load.hasOwnProperty("firstPickupTime"))) {
        return false
    }

    return true;
}

module.exports = {filters}


/*
>>>>>>> 63d006dce74baff3efdfdce1c5cfd30a4c82c11d
    this.singleData.stop
    this.singleData.payout
    this.singleData.rate
    this.singleData.trailer_status
    this.singleData.equipment
    this.singleData.totalDistance.value
    this.singleData.loadType
    this.singleData.exclude_city
    this.singleData.pickupTime
<<<<<<< HEAD
*/
=======
*/
    }

    return true;
}

module.exports = {filters}


/*
    this.singleData.stop
    this.singleData.payout
    this.singleData.rate
    this.singleData.trailer_status
    this.singleData.equipment
    this.singleData.totalDistance.value
    this.singleData.loadType
    this.singleData.exclude_city
    this.singleData.pickupTime
*/
=======
>>>>>>> 9e746df60d32787fbf5f97f6eb2aee77b05418bc
>>>>>>> 63d006dce74baff3efdfdce1c5cfd30a4c82c11d
