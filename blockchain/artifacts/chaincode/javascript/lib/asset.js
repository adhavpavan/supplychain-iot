'use strict';

const { Contract, Transaction } = require('fabric-contract-api');
class Asset extends Contract {
  async CreateAsset(ctx, assetData) {
    try {
      let asset = JSON.parse(assetData);
      await ctx.stub.putState(asset.id, assetData);
      return ctx.stub.getTxID();
    } catch (err) {
      throw new Error(err.stack);
    }
  }

  async CreateShipment(ctx, shipmentData) {
    try {
      let shipment = JSON.parse(shipmentData);
      await ctx.stub.putState(shipment.id, shipmentData);
      return ctx.stub.getTxID();
    } catch (err) {
      throw new Error(err.stack);
    }
  }

  async UpdateShipment(ctx, shipmentData) {
    try {
      let shipment = JSON.parse(shipmentData);
      await ctx.stub.putState(shipment.id, shipmentData);
      return ctx.stub.getTxID();
    } catch (err) {
      throw new Error(err.stack);
    }
  }

  async AddIOTDevice(ctx, iotDeviceData) {
    try {
      let iotDeviceJSON = JSON.parse(iotDeviceData);
      await ctx.stub.putState(iotDeviceJSON.id, iotDeviceData);
      return ctx.stub.getTxID();
    } catch (err) {
      throw new Error(err.stack);
    }
  }

  async AddIOTEvent(ctx, iotDeviceEventData, shipmentId) {
    try {
      const shipment = await ctx.stub.getState(shipmentId);
      let shipmentJSON = JSON.parse(shipment);

      // const event = await ctx.stub.getState(iotDeviceEventData);
      let eventJSON = JSON.parse(iotDeviceEventData);

      // Adding event here
      await ctx.stub.putState(eventJSON.id, iotDeviceEventData);

      // Verifying if any incident with this data
      if(shipmentJSON?.shipmentCondition?.type == 'Temperature'){
        console.log("--------inside temperarture---------",shipmentJSON?.shipmentCondition, eventJSON )
        if (shipmentJSON?.shipmentCondition.minTemperature > eventJSON.value ||
          shipmentJSON?.shipmentCondition.maxTemperature < eventJSON.value ){

            let incident = {
              "id": 'Incident:'+shipmentJSON.id+eventJSON.id,
              docType:'Incident',
              shipmentId:shipment.id,
              eventId:eventJSON.id,
              data:{
                  value: eventJSON.value,
                  minValue: shipmentJSON?.shipmentCondition.minTemperature,
                  maxValue: shipmentJSON?.shipmentCondition.maxTemperature
              },
              "incidentType": "Temperatrure Breach",
              "creationTime": eventJSON.timestamp,
              "closingTime": eventJSON.timestamp,
            }
            // Adding incident
            await ctx.stub.putState(incident.id, Buffer.from(JSON.stringify(incident)))
          }else {
            console.log("--------satisfying condition temperarture---------", )
          }
      }
      return ctx.stub.getTxID();
    } catch (err) {
      throw new Error(err.stack);
    }
  }

  async UpdateShipmentMilestones(ctx, milestone, shipmentId) {
    try {
      const shipmentJSON = await ctx.stub.getState(shipmentId);
      let shipment = JSON.parse(shipmentJSON);
      let milestones = shipment?.milestones || []

      let milestoneData = JSON.parse(milestone);
      milestones.push(milestoneData)
      let shipmentBuffer = Buffer.from(shipment.toString())

      await ctx.stub.putState(shipment.id, shipmentBuffer);
      return ctx.stub.getTxID();
    } catch (err) {
      throw new Error(err.stack);
    }
  }

  // deviceData = JSON.parse(deviceData.toString())
  // ReadAsset returns the asset stored in the world state with given id.
  async getAssetByID(ctx, id) {
    try {
      const assetJSON = await ctx.stub.getState(id);
      if (!assetJSON || assetJSON.length === 0) {
        throw new Error(`The asset ${id} does not exist`);
      }
      return assetJSON.toString();
    } catch (err) {
      throw new Error(err.stack);
    }
  }

  // deleteAsset deletes an given asset from the world state.
  async deleteAsset(ctx, id) {
    try {
      const exists = await this.assetExists(ctx, id);
      if (!exists) {
        throw new Error(`The asset ${id} does not exist`);
      }
      return ctx.stub.deleteState(id);
    } catch (err) {
      return new Error(err.stack);
    }
  }

  // assetExists returns true when asset with given ID exists in world state.
  async assetExists(ctx, id) {
    try {
      const assetJSON = await ctx.stub.getState(id);
      return assetJSON && assetJSON.length > 0;
    } catch (err) {
      return new Error(err.stack);
    }
  }

  // getAllAssets returns all assets found in the world state.
  async getAllAssets(ctx) {
    try {
      const allResults = [];
      // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
      const iterator = await ctx.stub.getStateByRange('', '');
      let result = await iterator.next();
      while (!result.done) {
        const strValue = Buffer.from(result.value.value.toString()).toString(
          'utf8'
        );
        let record;
        try {
          record = JSON.parse(strValue);
        } catch (err) {
          console.log(err);
          record = strValue;
        }
        allResults.push({ Key: result.value.key, Record: record });
        result = await iterator.next();
      }
      return JSON.stringify(allResults);
    } catch (err) {
      return new Error(err.message);
    }
  }

  /**
   * Function getAllResults
   * @param {resultsIterator} iterator within scope passed in
   * @param {Boolean} isHistory query string created prior to calling this fn
   */
  async getAllResults(iterator, isHistory) {
    try {
      let allResults = [];
      while (true) {
        let res = await iterator.next();
        console.log(res.value);

        if (res.value && res.value.value.toString()) {
          let jsonRes = {};
          console.log(res.value.value.toString('utf8'));

          if (isHistory && isHistory === true) {
            jsonRes.txId = res.value.txId;
            jsonRes.Timestamp = res.value.timestamp;
            jsonRes.IsDelete = res.value.is_delete
              ? res.value.is_delete.toString()
              : 'false';
            try {
              jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
            } catch (err) {
              console.log(err);
              jsonRes.Value = res.value.value.toString('utf8');
            }
          } else {
            jsonRes.Key = res.value.key;
            try {
              jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
            } catch (err) {
              console.log(err);
              jsonRes.Record = res.value.value.toString('utf8');
            }
          }
          allResults.push(jsonRes);
        }
        if (res.done) {
          console.log('end of data');
          await iterator.close();
          console.info('allResults : ', allResults);
          return allResults;
        }
      }
    } catch (err) {
      return new Error(err.message);
    }
  }

  /**
   * Function getQueryResultForQueryString
   * getQueryResultForQueryString woerk function executes the passed-in query string.
   * Result set is built and returned as a byte array containing the JSON results.
   * @param {Context} ctx the transaction context
   * @param {any}  self within scope passed in
   * @param {String} the query string created prior to calling this fn
   */
  async getDataForQuery(ctx, queryString) {
    try {
      console.log(
        '- getQueryResultForQueryString queryString:\n' + queryString
      );

      const resultsIterator = await ctx.stub.getQueryResult(queryString);
      let results = await this.getAllResults(resultsIterator, false);

      return results;
    } catch (err) {
      return new Error(err.message);
    }
  }

  /**
   * getAssetHistory takes the asset ID as arg, returns results as JSON
   * @param {String} id the asset ID
   */
  async getAssetHistory(ctx, id) {
    try {
      let resultsIterator = await ctx.stub.getHistoryForKey(id);
      let results = await this.getAllResults(resultsIterator, true);
      console.log('results : ', results);

      return results;
    } catch (err) {
      return new Error(err.stack);
    }
  }

  async getDataWithPagination(ctx, queryString, pageSize, bookmark) {
    try {
      const pageSizeInt = parseInt(pageSize, 10);
      const { iterator, metadata } =
        await ctx.stub.getQueryResultWithPagination(
          queryString,
          pageSizeInt,
          bookmark
        );
      const results = await this.getAllResults(iterator, false);
      let finalData = {
        data: results,
        metadata: {
          RecordsCount: metadata.fetchedRecordsCount,
          Bookmark: metadata.bookmark,
        },
      };
      return finalData;
    } catch (err) {
      return new Error(err.message);
    }
  }
}

module.exports = Asset;
