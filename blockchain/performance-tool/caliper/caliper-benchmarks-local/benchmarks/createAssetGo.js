'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');
const { v1: uuidv4 } = require('uuid')

let assetIdArrayGo = [];
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
        assetIdArrayGo.push(id)

        // let assetData = {
        //     id: id,
        //     Color: "White",
        //     Size: "Large",
        //     Owner: "Pavan",
        //     AppraisedValue: "2000000",
        // };

        // CreateAsset
        // - uuid
        // - randomString8
        // - randomNumber0_50
        // - randomString8
        // - randomNumber0_50
        let args = {
            contractId: 'performance-go',
            contractVersion: 'v1',
            contractFunction: 'CreateAsset',
            contractArguments: [id, "Red", "22", "Pavan", "100"],
            // invokerIdentity: 'client0.org2.example.com',
            // transientMap
            timeout: 30
        };

        // const contractRequest = {
        //     contractId: "myContractID",  // Required. Matches the contract ID in the network configuration file.
        //     contractFunction: "createAsset",  // Required. Function name in the contract to be called.
        //     contractArguments: ["asset001","blue","500","Tom"],
        //     readOnly: false,  // Optional. Set to true for query, false for a transaction (defaults to false).
        //     transientMap: {},
        //     invokerIdentity: "User1@org1.example.com",  // Optional. Name of the user invoking the contract.
        //     invokerMspId: "Org1MSP",  // Optional. MSP ID of the user's organization.
        //     targetPeers: [ "peer0.org1.example.com","peer0.org2.example.com"],
        //     targetOrganizations: ["Org1","Org2"],
        //     channel: "mychannel",  // Optional. The name of the channel on which the contract resides.
        //     timeout: 30,  // Optional. Timeout in seconds for the request.
        //     orderer: "orderer.example.com"  // Optional. The target orderer for transaction broadcast.
        //   };

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
module.exports.assetIdArrayGo = assetIdArrayGo;
