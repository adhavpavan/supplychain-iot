const httpStatus = require('http-status');
const { User } = require('../models');
const mongoose = require('mongoose');

const ApiError = require('../utils/ApiError');
const { Gateway, Wallets } = require('fabric-network');
const { getContractObject, getAgreementsWithPagination, getDataWithPagination } = require('../utils/blockchainUtils');
const {
  NETWORK_ARTIFACTS_DEFAULT,
  BLOCKCHAIN_DOC_TYPE,
  SHIPMENT_STATUS,
} = require('../utils/Constants');
const { getUUID } = require('../utils/uuid');
const { getSignedUrl } = require('../utils/fileUpload');

// If we are sure that max records are limited, we can use any max number
const DEFAULT_MAX_RECORDS = 100
const utf8Decoder = new TextDecoder();
let stakeholder = [
  {orgName: 'Shipper', orgId: 1},
  {orgName: 'Carrier', orgId: 2},
  {orgName: 'Consinee', orgId: 3}]


const addShipment = async (shipmentData, user) => {

  console.log("----------addshipment--------------",shipmentData, user )
  let gateway;
  let client
  let id = new mongoose.Types.ObjectId()
  try {
    let dateTime = new Date();
    let orgName = `org${user.orgId}`;

    if(parseInt(user.orgId) != 1){
      throw new Error('You are not authorized to create shipment')
    }


    let shipment = {
      "id": 'Shipment-'+getUUID(),
      "description": shipmentData.description,
      docType: BLOCKCHAIN_DOC_TYPE.SHIPMENT,
      status: SHIPMENT_STATUS.PENDING,
      "transportConditions": shipmentData.transportConditions,
      "stakeholders": stakeholder,
      "shipmentCondition":shipmentData.shipmentCondition,
      "milestones": shipmentData.milestones,
      "pickupTimestamp": shipmentData.pickupTimestamp,
      "deliveryTimestamp": shipmentData.deliveryTimestamp,
      "origin": shipmentData.origin,
      "destination": shipmentData.destination,
      "mode": shipmentData.mode,
      comment:[{
        title: 'Shipment Creation', 
        description: `Shipment has been created by ${user.email}`,
        createdBy: user.email,
        createAt: dateTime
      }
      ],
      currentylyWith: parseInt(user.orgId),
      createAt: dateTime,
      updatedAt: dateTime,
      createBy: user.email,
      updatedBy: user.email
    }

    const contract = await getContractObject(
      orgName,
      user.email,
      NETWORK_ARTIFACTS_DEFAULT.CHANNEL_NAME,
      NETWORK_ARTIFACTS_DEFAULT.CHAINCODE_NAME,
      gateway,
      client
    );
    console.log("------shipment-------", shipment)

    await contract.submitTransaction("CreateShipment", JSON.stringify(shipment));

    return shipment;
  } catch (error) {
    console.log(error);
  } finally {
    if (gateway) {
      gateway.close();
    }
    if (client) {
      client.close()
    }
  }
};

const queryAssetsWithPagination = async (filter, user) => {
  try {

    let query
    if (filter.assetType == BLOCKCHAIN_DOC_TYPE.SHIPMENT) {
      query = `{\"selector\":{ \"docType\": \"${BLOCKCHAIN_DOC_TYPE.SHIPMENT}\"}}`
    } else if (filter.assetType == BLOCKCHAIN_DOC_TYPE.DEVICE) {
      query = `{\"selector\":{ \"docType\": \"${BLOCKCHAIN_DOC_TYPE.DEVICE}\"}}`
    }else if (filter.assetType == BLOCKCHAIN_DOC_TYPE.EVENT){
      query = `{\"selector\":{ \"docType\": \"${BLOCKCHAIN_DOC_TYPE.EVENT}\",  \"shipmentId\": \"${filter.shipmentId}\"}}`
    }else if (filter.assetType == BLOCKCHAIN_DOC_TYPE.INCIDENT){
      query = `{\"selector\":{ \"docType\": \"${BLOCKCHAIN_DOC_TYPE.INCIDENT}\", \"shipmentId\": \"${filter.shipmentId}\"}}`
    }else {
       query = `{\"selector\":{ \"docType\": \"${BLOCKCHAIN_DOC_TYPE.SHIPMENT}\"}}`
    }

    console.log("==========================filter type", filter, query)

    // query = `{\"selector\":{\"orgId\": ${filter.orgId},\"status\":\"${filter.filterType}\", \"docType\": \"${BLOCKCHAIN_DOC_TYPE.AGREEMENT}\"}, \"sort\":[{\"updatedAt\":\"desc\"}], \"use_index\":[\"_design/indexOrgDoc\", \"indexDoc\"]}}`;
    console.log('filters--------------', filter, query);
    let data = await getDataWithPagination(
      query,
      filter.pageSize,
      filter.bookmark || '',
      filter.orgName,
      user.email,
      NETWORK_ARTIFACTS_DEFAULT.CHANNEL_NAME,
      NETWORK_ARTIFACTS_DEFAULT.CHAINCODE_NAME
    );

    return data;
  } catch (error) {
    console.log('error--------------', error);
  }
};




const sendShipment = async (shipmentData, user) => {

  console.log("----------addshipment--------------",shipmentData, user )
  let gateway;
  let client
  let id = new mongoose.Types.ObjectId()
  try {
    let dateTime = new Date();
    let orgName = `org${user.orgId}`;

    if(user.orgId != 1){
      throw new Error('You are not authorized to create shipment')
    }

    const contract = await getContractObject(
      orgName,
      user.email,
      NETWORK_ARTIFACTS_DEFAULT.CHANNEL_NAME,
      NETWORK_ARTIFACTS_DEFAULT.CHAINCODE_NAME,
      gateway,
      client
    );

    // let ownership = await contract.submitTransaction('', ownershipId)
    let shipment = await contract.submitTransaction('getAssetByID', shipmentData.id);
    shipmentJSON = JSON.parse(utf8Decoder.decode(shipment));


    shipmentJSON.currentylyWith = 2,
    shipmentJSON.status = SHIPMENT_STATUS.IN_TRANSIT
    shipmentJSON.updatedAt =  dateTime
    shipmentJSON.updatedBy = user.email
    shipmentJSON.pickupTimestamp = dateTime

    shipmentJSON.comment = shipmentJSON.comment || []
    shipmentJSON.comment.push({
      title: 'Shipment Sent viw Carrier', 
      description: `Shipment has been sent viw Carrier`,
      createdBy: user.email,
      createAt: dateTime
    })


    await contract.submitTransaction('UpdateShipment', JSON.stringify(shipmentJSON));
    return shipmentJSON;
  } catch (error) {
    console.log(error);
  } finally {
    if (gateway) {
      gateway.close();
    }
    if (client) {
      client.close()
    }
  }
};


const updateShipment = async (shipmentData, user) => {

  console.log("----------addshipment--------------",shipmentData, user )
  let gateway;
  let client
  let id = new mongoose.Types.ObjectId()
  try {
    let dateTime = new Date();
    let orgName = `org${user.orgId}`;

    if(user.orgId != 3){
      throw new Error('You are not authorized to create shipment')
    }

    const contract = await getContractObject(
      orgName,
      user.email,
      NETWORK_ARTIFACTS_DEFAULT.CHANNEL_NAME,
      NETWORK_ARTIFACTS_DEFAULT.CHAINCODE_NAME,
      gateway,
      client
    );

    // let ownership = await contract.submitTransaction('', ownershipId)
    let shipment = await contract.submitTransaction('getAssetByID', shipmentData.id);
    shipmentJSON = JSON.parse(utf8Decoder.decode(shipment));


    shipmentJSON.currentylyWith = 3,
    shipmentJSON.status = SHIPMENT_STATUS.DELIVERED
    shipmentJSON.updatedAt =  dateTime
    shipmentJSON.updatedBy = user.email
    shipmentJSON.deliveryTimestamp = dateTime

    shipmentJSON.comment = shipmentJSON.comment || []
    shipmentJSON.comment.push({
      title: 'Shipment Delivered', 
      description: `All event checked and verified, hence marking this shipment as delivered`,
      createdBy: user.email,
      createAt: dateTime
    })


    await contract.submitTransaction('UpdateShipment', JSON.stringify(shipmentJSON));
    return shipmentJSON;
  } catch (error) {
    console.log(error);
  } finally {
    if (gateway) {
      gateway.close();
    }
    if (client) {
      client.close()
    }
  }
};

const addIOTData = async (iotData, user) => {

  console.log("----------addshipment--------------",iotData, user )
  let gateway;
  let client
  let id = new mongoose.Types.ObjectId()
  try {
    let dateTime = new Date();
    let orgName = `org${user.orgId}`;

    if(user.orgId != 2){
      throw new Error('You are not authorized to create shipment')
    }

    const contract = await getContractObject(
      orgName,
      user.email,
      NETWORK_ARTIFACTS_DEFAULT.CHANNEL_NAME,
      NETWORK_ARTIFACTS_DEFAULT.CHAINCODE_NAME,
      gateway,
      client
    );

    let iotDataJSON = {
      id: 'EVENT-'+getUUID(),
      docType: BLOCKCHAIN_DOC_TYPE.EVENT,
      deviceID:iotData.deviceID,
      shipmentId:iotData.shipmentId,
      type: iotData.type,
      value: iotData.value,
      createAt: dateTime,
    }

    // let ownership = await contract.submitTransaction('', ownershipId)
     await contract.submitTransaction('AddIOTEvent', JSON.stringify(iotDataJSON), iotData.shipmentId);
    return iotDataJSON;
  } catch (error) {
    console.log(error);
  } finally {
    if (gateway) {
      gateway.close();
    }
    if (client) {
      client.close()
    }
  }
};


const addIOTDeviceData = async (iotDeviceData, user) => {

  console.log("----------addshipment--------------",iotDeviceData, user )
  let gateway;
  let client
  let id = new mongoose.Types.ObjectId()
  try {
    let dateTime = new Date();
    let orgName = `org${user.orgId}`;

    if(user.orgId != 2){
      throw new Error('You are not authorized to create device, only carrier can add device')
    }

    const contract = await getContractObject(
      orgName,
      user.email,
      NETWORK_ARTIFACTS_DEFAULT.CHANNEL_NAME,
      NETWORK_ARTIFACTS_DEFAULT.CHAINCODE_NAME,
      gateway,
      client
    );

    iotDeviceData.createAt= dateTime
    iotDeviceData.docType = BLOCKCHAIN_DOC_TYPE.DEVICE
    iotDeviceData.updatedAt= dateTime
    iotDeviceData.createBy= user.email
    iotDeviceData.updatedBy= user.email

     await contract.submitTransaction('AddIOTDevice', JSON.stringify(iotDeviceData));
    return iotDeviceData;
  } catch (error) {
    console.log(error);
    throw error
  } finally {
    if (gateway) {
      gateway.close();
    }
    if (client) {
      client.close()
    }
  }
};



const queryHistoryById = async (id, user) => {
  let gateway;
  let client
  try {
    let orgName = `org${user.orgId}`;
    const contract = await getContractObject(
      orgName,
      user.email,
      NETWORK_ARTIFACTS_DEFAULT.CHANNEL_NAME,
      NETWORK_ARTIFACTS_DEFAULT.CHAINCODE_NAME,
      gateway,
      client
    );
    let result = await contract.submitTransaction('getAssetHistory', id);
    // result = JSON.parse(result.toString());
    result = JSON.parse(utf8Decoder.decode(result));
    if (result) {
      result = result?.map(elm => {
        return { txId: elm?.txId, IsDelete: elm.IsDelete, ...elm.Value, timeStamp: elm?.Timestamp?.seconds?.low * 1000 }
      })
    }
    return result;
  } catch (error) {
    console.log(error);
  } finally {
    if (gateway) {
      gateway.close();
    }
    if (client) {
      client.close()
    }
  }
};


const getDocSignedURL = async (docId, user) => {
  let orgName = `org${user.orgId}`;
  return getSignedUrl(docId, orgName);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  addShipment,
  sendShipment,
  addIOTData,
  addIOTDeviceData,
  queryAssetsWithPagination,
  updateShipment,


  getUserByEmail,
  updateUserById,
  deleteUserById,
  getDocSignedURL,
  queryHistoryById,
};
