const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService, agreementService } = require('../services');
const { getSuccessResponse } = require('../utils/Response');
const {  addShipment, sendShipment, addIOTDeviceData, addIOTData, queryAssetsWithPagination, updateShipment } = require('../services/shipment.service');

const createShipment = catchAsync(async (req, res) => {
  let { user } = req.loggerInfo;
  console.log('============user========', user);
  const result = await addShipment(req.body, user) 
  res.status(httpStatus.CREATED).send(getSuccessResponse(httpStatus.CREATED, 'Shipment data created successfully', result));
});

const sendShipmentToCarrier = catchAsync(async (req, res) => {
  let { user } = req.loggerInfo;
  console.log('============user========', user);
  const result = await sendShipment(req.body, user) 
  res.status(httpStatus.CREATED).send(getSuccessResponse(httpStatus.CREATED, 'Shipment sent to carrier successfully', result));
});

const updateShipmentAtConsignee = catchAsync(async (req, res) => {
  let { user } = req.loggerInfo;
  console.log('============user========', user);
  const result = await updateShipment(req.body, user) 
  res.status(httpStatus.CREATED).send(getSuccessResponse(httpStatus.CREATED, 'Shipment has been updated at consignee end successfully', result));
});

const addIOTDevice = catchAsync(async (req, res) => {
  let { user } = req.loggerInfo;
  console.log('============user========', user);
  const result = await addIOTDeviceData(req.body, user) 
  res.status(httpStatus.CREATED).send(getSuccessResponse(httpStatus.CREATED, 'IOT device added successfully', result));
});

const addIOTEvent = catchAsync(async (req, res) => {
  let { user } = req.loggerInfo;
  console.log('============user========', user);
  const result = await addIOTData(req.body, user) 
  res.status(httpStatus.CREATED).send(getSuccessResponse(httpStatus.CREATED, 'IOT device event data added successfully', result));
});

const getAssets = catchAsync(async (req, res) => {
  const { pageSize, bookmark, shipmentId, assetType } = req.query;
  let orgId = parseInt(req.loggerInfo.user.orgId)

  let filter = {
    orgId,
    orgName:`org${orgId}`,
    pageSize,
    bookmark: bookmark || '',
    shipmentId,
    assetType
  };
  console.log('------orgid is---', filter);
  let { user } = req.loggerInfo;
  let data = await queryAssetsWithPagination(filter, user) 

  res.status(httpStatus.OK).send(getSuccessResponse(httpStatus.OK, 'Land fetched successfully', data));
});

const getHistoryById = catchAsync(async (req, res) => {
  const { id } = req.params;

  let { user } = req.loggerInfo;
  let data = await agreementService.queryHistoryById(id, user);

  res.status(httpStatus.OK).send(getSuccessResponse(httpStatus.OK, 'Shipment fetched successfully', data));
});

const getShipmentById = catchAsync(async (req, res) => {
  const { id } = req.params;

  let { user } = req.loggerInfo;
  let data = await queryShipmentById(id, user) 

  res.status(httpStatus.OK).send(getSuccessResponse(httpStatus.OK, 'Shipment fetched successfully', data));
});

module.exports = {
  createShipment,
  sendShipmentToCarrier,
  addIOTDevice,
  addIOTEvent,
  getAssets,
  updateShipmentAtConsignee,

  getShipmentById,
  getHistoryById,
};
