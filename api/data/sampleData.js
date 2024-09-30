
let shipment = {
  "shipment": {
    "shipmentId": 1,
    "description": "string",
    "transportConditions": "string",
    "stakeholders": [
      {
        "stakeholderId": "string",
        "name": "string"
      }
    ],
    "shipmentCondition": {
      type:"Temperature | Location | Humidity",
      "shipmentId": 1,
      "code": "string",
      "label": "string",
      "minTemperature": 0.0,
      "maxTemperature": 0.0,
      "validateCondition": "function"
    },
    "shipmentIncident": {
      "incidentId": "string",
      "incidentType": "string",
      "creationTime": "2023-09-27T12:00:00Z",
      "closingTime": "2023-09-27T12:00:00Z",
      "detectIncident": "function"
    },
    "milestones": [
      {
        "milestoneId": 1,
        "code": "string",
        "label": "string",
        "negotiatedDate": "2023-09-27",
        "actualDate": "2023-09-27",
        "stakeholders": [
          {
            "stakeholderId": "string",
            "name": "string"
          }
        ]
      }
    ],
    "pickupTimestamp": "2023-09-27T12:00:00Z",
    "deliveryTimestamp": "2023-09-27T12:00:00Z",
    "origin": "string",
    "destination": "string",
    "mode": "string"
  },
  "assignment": {
    "assignmentId": 1,
    "startAssTime": "2023-09-27T12:00:00Z",
    "endAssTime": "2023-09-27T12:00:00Z",
    "createAssignment": "function"
  },

}

let   iotDataSource= {
  "dataSourceId": "TEMPERATURE-12345",
  "name": "Temperature Sensor",
  "measureSpecifications": "C",
  "type":"TEMPERATURE",
}




let iotEiotDataEventvent =   {
  "eventId": 1,
  "timestamp": "2023-09-27T12:00:00Z",
  type:"Temperature | Location | Humidity",
  "data": "string",
  "Value":22,
  "source": {
    "dataSourceId": "string",
    "name": "string"
  },
  "receptionTimestamp": "2023-09-27T12:00:00Z",
  "verifyData": "function"
}