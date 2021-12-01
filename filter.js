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
    loadingType,
    payout,
    firstPickupTime,
    lastDeliveryTime,
    stopCount,
    equipmentType,
    rate,
    loadType,
    filterStatus,
  } = props;

  if (
    !load.hasOwnProperty("version") ||
    !load.hasOwnProperty("id") ||
    !load.hasOwnProperty("payout") ||
    !load.payout.hasOwnProperty("value")
  ) {
    console.log({ mag: "load has no payout", load });
    return false;
  }
  //filterStatus
  if (filterStatus !== "active") {
    console.log({
      mag: "filterStatus is not active",
    });
    return false;
  }

  // Check
  /*  if (cacheCheck({"id": load.id, "version": load.version}) || treasureCheck({"id": load.id, "payout": load.payout.value})) {
    //     return false
    //   }*/

  //Payout
  if (
    payout &&
    (isNaN(load.payout.value) ||
      !load.hasOwnProperty("payout") ||
      load.payout.value < payout.value ||
      typeof load.payout.value !== "number")
  ) {
    console.log({
      loadPayout: load.payout.value,
      payout: payout.value,
      notequail: load.payout.value !== payout,
      hasPayout: load.payout.hasOwnProperty("value"),
      typeofPayout: typeof load.payout.value,
      big: load.payout.value > payout.value,
      small: load.payout.value < payout.value,
      isNaN: isNaN(load.payout.value),
      msg: "payout failed",
    });

    return false;
  }
  //loadType
  for (let i = 0; i < load.loads.length; i++) {
    if (
      load.loads[i].hasOwnProperty("loadType") &&
      (load.loads[i].loadType !== loadType ||
        typeof load.loads[i].loadType !== "string")
    ) {
      console.log({
        loadType: load.loads[i].loadType,
        loadType2: loadType,
        typeofLoadType: typeof load.loads[i].loadType,
        loadTypeEqual: load.loads[i].loadType === loadType,
        msg: "loadType failed",
      });
      return false;
    }
  }

  // stopCount
  if (
    stopCount &&
    (load.stopCount == "NaN" ||
      !load.hasOwnProperty("stopCount") ||
      typeof load.stopCount !== "number" ||
      typeof stopCount !== "number" ||
      load.stopCount < 0 ||
      load.stopCount > stopCount ||
      load.stopCount !== stopCount)
  ) {
    console.log({
      stopCount,
      loadStopCount: load.stopCount,
      msg: "stopCount failed",
    });
    return false;
  }
  //transitOperatorType
  if (
    transitOperatorType &&
    (!load.hasOwnProperty("transitOperatorType") ||
      load.transitOperatorType !== transitOperatorType ||
      typeof load.transitOperatorType !== "string")
  ) {
    console.log({
      transitOperatorType,
      loadTransitOperatorType: load.transitOperatorType,
      msg: "transitOperatorType failed",
    });
    return false;
  }
  //Buffer time AKA Minimum range
  /*if (bufferTime) {
      if (!load.hasOwnProperty('firstPickupTime') || toTimestamp(load.firstPickupTime) < bufferTimestamp()) {
        return false
      }
    }*/

  if (
    load.payout.value < 0 ||
    typeof load.payout.value !== "number" ||
    typeof payout.value !== "number"
  ) {
    console.log({
      msg: "payout error",
    });
    return false;
  }
  let loadReate = load.payout.value / load.totalDistance.value;

  // console.table({
  //     loadpayout: load.payout.value,
  //     loadtotalDistance: load.totalDistance.value,
  //     rate,
  //     loadtype: typeof load.payout.value,
  //     isNaN: isNaN(load.payout.value),
  //     isNaNload: isNaN(load.totalDistance.value),
  //     typeofload: typeof loadReate !== "number",
  //     ratetype: typeof rate.value !== "number"
  //
  // })

  if (
    (rate && (loadReate < rate.value || isNaN(loadReate))) ||
    typeof loadReate !== "number" ||
    typeof rate.value !== "number"
  ) {
    console.log({
      loadReate,
      rate: rate.value,
      loadReateBigger: loadReate > rate.value,
      msg: "loadReate < rate.value",
    });
    return false;
  }

  //Rate

  if (
    (rate &&
      (loadReate < rate.value ||
        isNaN(loadReate) ||
        loadReate == "Infinity")) ||
    typeof loadReate !== "number"
  ) {
    console.log({
      rate: rate.value,
      loadReate: loadReate,
      msg: "return fail",
    });
    return false;
  }

  //Exclude covered load
  /* if (ignoreRecovery) {
       if (!load.hasOwnProperty('startLocation') || !load.startLocation.hasOwnProperty('label') || load.startLocation.label.indexOf("_ITR") > -1) {
         return false;
       }
     }*/
  //startLocations
  if (startLocation) {
    if (!load.hasOwnProperty("startLocation")) {
      console.log("loadStartLocation not defined");
      return false;
    }

    const {
      city, //array
      state, //array
    } = startLocation;

    const cityItem = city.includes(load.startLocation.city);
    if (!cityItem) {
      console.log({
        city,
        loadCity: load.startLocation.city,
        cityItem,
        msg: "city not found",
      });
      return false;
    }

    const stateItem = state.includes(load.startLocation.state);
    if (!stateItem) {
      console.log({
        state,
        loadState: load.startLocation.state,
        stateItem,
        msg: "stateItem failed",
      });
      return false;
    }
  } else {
    console.log({
      startLocation,
      msg: "startLocation is not defined",
    });
    return false;
  }

  //endLocations
  if (endLocation) {
    if (!load.hasOwnProperty("endLocation")) {
      console.log("loadEndLocation is not defined");
      return false;
    }
    const {
      city, //array
      state, //array
    } = endLocation;

    const cityItem = city.includes(load.endLocation.city);

    if (!cityItem) {
      console.table({
        loadEndlocation: load.endLocation.city,
        city,
        cityItem,
        msg: "cityItem is not defined",
      });
      return false;
    }
    const stateItem = state.includes(load.endLocation.state);
    if (!stateItem) {
      console.table({
        loadEndlocation: load.endLocation.state,
        state,
        stateItem,
        msg: "stateItem is not defined",
      });
      return false;
    }
  } else {
    console.log({
      endLocation,
      msg: "endLocation  is not defined",
    });
    return false;
  }

  //Exclude
  if (exclude && WhiteList) {
    // console.table({
    //     excludehasOwnProperty: exclude.hasOwnProperty("city"),
    //     excludehasOwnProperty2: exclude.hasOwnProperty("state"),
    //     excludehasOwnProperty3: exclude.hasOwnProperty("warehouse"),
    // })
    if (
      !exclude.hasOwnProperty("city") ||
      !exclude.hasOwnProperty("state") ||
      !exclude.hasOwnProperty("warehouse")
    ) {
      console.log({
        msg: "city, state or country is defined in exclude",
      });
      return false;
    }

    if (
      !WhiteList.hasOwnProperty("city") ||
      !WhiteList.hasOwnProperty("state") ||
      !WhiteList.hasOwnProperty("warehouse")
    ) {
      console.log({
        msg: "city, state or country is defined in whiteList",
      });
      return false;
    }

    const {
      warehouse: excludeWarehouse,
      city: excludeCity,
      state: exludeState,
    } = exclude;

    const {
      warehouse: whiteListWarehouse,
      city: whiteListCity,
      state: whiteListState,
    } = WhiteList;

    const loadLoadsStops = load.loads[0].stops;
    for (let i = 0; i < loadLoadsStops.length; i++) {
      //warehouse ni topib ol
      // if (excludeWarehouse && excludeWarehouse.indexOf(loadLoadsStops[i].city) > 0) {
      // console.log({
      //     excludeWarehouse,
      //     loadLoadsStops: loadLoadsStops[i].city
      // })
      //     return false;
      // }
      console.table({
        whiteListState,
        l1sate: loadLoadsStops[i].location.state,
        l2city: loadLoadsStops[i].location.city,
        whiteListCity,
        msg: "whiteListCity",
      });
      const excludeCityItem = excludeCity.includes(
        loadLoadsStops[i].location.city
      );
      if (
        excludeCity &&
        (excludeCityItem || !loadLoadsStops[i].location.hasOwnProperty("city"))
      ) {
        console.log({
          excludeCity,
          loadLoadsStops: loadLoadsStops[i].location.city,
          msg: "excludeCityItem failed",
        });
        return false;
      }
      const excludeStateItem = exludeState.includes(
        loadLoadsStops[i].location.state
      );

      if (
        exludeState &&
        (excludeStateItem ||
          !loadLoadsStops[i].location.hasOwnProperty("state"))
      ) {
        console.log({
          exludeState,
          loadLoadsStops: loadLoadsStops[i].location.state,
          msg: "excludeStateItem failed",
        });
        return false;
      }

      ///whiteListvalidation

      // whiteListWarehouse ni topib ol
      if (
        whiteListWarehouse &&
        excludeWarehouse.indexOf(loadLoadsStops[i].city) > 0
      ) {
        console.log({
          whiteListWarehouse,
          loadLoadsStops: loadLoadsStops[i].city,
        });
        return false;
      }
      const whiteListCityItem = whiteListCity.includes(
        loadLoadsStops[i].location.city
      );
      if (
        whiteListCity &&
        (whiteListCityItem ||
          !loadLoadsStops[i].location.hasOwnProperty("city"))
      ) {
        console.log({
          whiteListCity,
          loadLoadsStops: loadLoadsStops[i].location.city,
          msg: "whiteListCity failed",
        });
        return false;
      }

      const whiteListStateItem = whiteListState.includes(
        loadLoadsStops[i].location.state
      );
      if (
        whiteListState &&
        (whiteListStateItem ||
          !loadLoadsStops[i].location.hasOwnProperty("state"))
      ) {
        console.log({
          whiteListState,
          loadLoadsStops: loadLoadsStops[i].location.state,
          msg: "whiteListState failed",
        });
        return false;
      }
      //loadingType
      if (
        (loadingType && loadingType !== loadLoadsStops.loadType) ||
        typeof loadType !== "string"
      ) {
        console.log({
          loadingType,
          loadLoadsStops: loadLoadsStops.loadType,
          msg: "loadingType failed",
        });
        return false;
      }
    }
  }

  // workOpportunityType

  if (
    workOpportunityType &&
    (load.workOpportunityType !== workOpportunityType ||
      typeof workOpportunityType !== "string")
  ) {
    console.log({
      workOpportunityType,
      loadWorkOpportunityType: load.workOpportunityType,
      equal: load.workOpportunityType !== workOpportunityType,
      equl2: load.workOpportunityType == workOpportunityType,
      type: typeof workOpportunityType !== "string",
    });
    console.log("workOpportunityType failed");
    return false;
  }

  //equipmentType
  if (
    equipmentType &&
    (load.loads[0].equipmentType !== equipmentType ||
      !load.loads[0].hasOwnProperty("equipmentType"))
  ) {
    console.log({
      equipmentType,
      equipmentType2: load.loads[0].equipmentType,
      mdg: "equipmentType failed",
    });
    return false;
  }

  // PickupTime
  const firstPickupTimeISO = dayjs(firstPickupTime);
  const firstPickupTimeISOData = dayjs(load.firstPickupTime);
  const diffPickUp = firstPickupTimeISO.diff(firstPickupTimeISOData, "minutes");

  if (firstPickupTime && (diffPickUp == "NaN" || diffPickUp > 0)) {
    console.log({
      firstPickupTime,
      loadFirstPickupTime: load.firstPickupTime,
      msg: "firstPickupTime failed",
    });
    return false;
  }
  // lastDeliveryTime
  const deliveryTimeISO = dayjs(lastDeliveryTime);
  const lastDeliveryTimeISO = dayjs(load.lastDeliveryTime);

  const diffDelivery = deliveryTimeISO.diff(lastDeliveryTimeISO, "minutes");
  // console.table({
  //     diffDelivery,
  //     lastDeliveryTime,
  //     deliveryTimeISO,
  //     lastDeliveryTimeISO,
  //     loadLastDeliveryTime: load.lastDeliveryTime,
  //     NaN: diffDelivery === "NaN",
  //     log: "NaN"
  // })
  if (
    lastDeliveryTime &&
    (diffDelivery == "NaN" ||
      diffDelivery < 0 ||
      !load.hasOwnProperty("lastDeliveryTime"))
  ) {
    console.log({
      diffDelivery,
      msg: "lastDeliveryTime failed",
    });
    return false;
  }

  // MinDuration
  if (MinDuration && load.totalDuration.value < MinDuration) {
    console.log({
      MinDuration,
      loadMinDuration: load.totalDuration,
      msg: "MinDuration failed",
    });
    return false;
  }
  // maxDuration
  if (MaxDuration && load.totalDuration < MaxDuration) {
    console.log({
      MaxDuration,
      loadMaxDuration: load.totalDuration,
      msg: "MaxDuration failed",
    });
    return false;
  }

  // MinDistance
  if (MinDistance && load.totalDistance.value > MinDistance) {
    console.log({
      MinDistance,
      loadMinDistance: load.totalDistance.value,
      msg: "MinDistance failed",
    });
    return false;
  }

  // MaxDistance
  if (MaxDistance && load.totalDistance > MaxDistance) {
    console.log({
      MaxDistance,
      loadMaxDistance: load.totalDistance,
      msg: "MaxDistance failed",
    });
    return false;
  }

  console.log({ msg: "congratulation" });
  return true;
};

module.exports = { filters };
