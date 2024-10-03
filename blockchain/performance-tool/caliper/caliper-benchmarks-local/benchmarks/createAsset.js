'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');
const { v1: uuidv4 } = require('uuid')

let assetIdArray = [];
/**
 * Workload module for the benchmark round.
 */
class CreateDeviceWorkload extends WorkloadModuleBase {
    /**
     * Initializes the workload module instance.
     */
    constructor() {
        super();
    }

    /**
     * Assemble TXs for the round.
     * @return {Promise<TxStatus[]>}
     */
    async submitTransaction() {
        let id = uuidv4()
        assetIdArray.push(id)

        // Generate random number between -10 and 10
        const randomValue = Math.floor(Math.random() * 21) - 10;

        let assetData = {
            deviceID: "DEVICE-TEMP12345",
            id,
            shipmentId: "Shipment-8da2dfd3-956",
            type: "Temperature",
            value: randomValue
        };

        let args = {
            contractId: 'supplychain-chaincode',
            contractVersion: 'v1',
            contractFunction: 'AddIOTEvent',
            contractArguments: [JSON.stringify(assetData), 'Shipment-73b520d7-ae6'],
            // invokerIdentity: 'client0.org2.example.com',
            // transientMap
            timeout: 30
        };
        await this.sutAdapter.sendRequests(args);
    }
}

/**
 * Create a new instance of the workload module.
 * @return {WorkloadModuleInterface}
 */
function createWorkloadModule() {
    return new CreateDeviceWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;
module.exports.assetIdArray = assetIdArray;
