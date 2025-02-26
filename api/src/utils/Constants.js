

const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  OTHER: 'other'
}

const USER_TYPE = {
  ADMIN: 'admin',
  USER: 'user'
}

const ORG_DEFAULT_USER = {
  ADMIN: 'admin'
}

const SHIPMENT_STATUS = {
  PENDING: 'PENDING',
  IN_TRANSIT: 'IN_TRANSIT',
  DELIVERED: 'DELIVERED',
  DELAYED: 'DELAYED',
  RETURNED: 'RETURNED',
  CANCELED: 'CANCELED',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY'
};


const SENSOR_TYPE = {
  TEMPERATURE: 'TEMPERATURE',
  LOCATION: 'LOCATION',
  HUMIDITY: 'HUMIDITY',
}

const BLOCKCHAIN_DOC_TYPE = {
  SHIPMENT: 'SHIPMENT',
  DEVICE: 'DEVICE',
  EVENT: 'EVENT',
  INCIDENT:'INCIDENT'
}

const FILTER_TYPE = {
  COMPLETED:'completed',
  EXPIRING_SOON: 'expiring-soon',
  INPROGRESS:'inprogress',
  ALL:'all',
  ACTIVE: 'active'
}

const NETWORK_ARTIFACTS_DEFAULT ={
  CHANNEL_NAME: 'mychannel',
  CHAINCODE_NAME: 'supplychain-chaincode',
  QSCC:'qscc'
}

const ORG_DEPARTMENT = {
  LEGAL: 'legal',
  FINANCIAL: 'financial'
}

const CHAINCODE_METHODS = {
  CREATE_AGREEMENT: '',
  APPROVE_AGREEMENT:'',
  GET_ASSET_BY_ID: '',
  GET_ASSET_HISTORY:'',
  GET_APPROVALS:''
}

const AGREEMENT_STATUS = {
  ACTIVE: 'active',
  INPROGRESS:'inprogress',
  EXPIRED: 'expired',
  PENDING: 'pending',
  COMPLETED:'completed',
  OTHER: 'other'
}
const APPROVAL_STATUS = {
  APPROVED:'approved',
  REJECTED: 'rejected',
  OTHER: 'other'
}

module.exports = {
  SENSOR_TYPE,
  SHIPMENT_STATUS,
  USER_STATUS,
  USER_TYPE,
  ORG_DEPARTMENT,
  NETWORK_ARTIFACTS_DEFAULT,
  BLOCKCHAIN_DOC_TYPE,
  CHAINCODE_METHODS,
  AGREEMENT_STATUS,
  APPROVAL_STATUS,
  FILTER_TYPE
}