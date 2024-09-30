const express = require('express');
const {auth} = require('../../middlewares/auth');
const { createShipment, sendShipmentToCarrier, addIOTDevice, addIOTEvent, getAssets, updateShipmentAtConsignee } = require('../../controllers/shipment.controller');

const router = express.Router();


// router
//   .route('/history/:id')
//   .get(auth, getHistoryById);

router
  .route('/device/event')
  .post(auth, addIOTEvent)

router
  .route('/device')
  .post(auth, addIOTDevice)


router
  .route('/deliver')
  .put(auth, updateShipmentAtConsignee)

router
  .route('/')
  .put(auth, sendShipmentToCarrier)
  .get(auth, getAssets)
  .post(auth, createShipment)


module.exports = router;
