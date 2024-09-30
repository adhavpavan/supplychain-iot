const axios = require("axios");
const url = "http://localhost:3000/v1/shipment/device/event";
const { parse } = require('csv-parse');

// const { nanoid } = require('nanoid');

const { staticUser } = require("../api/src/utils/bootstrap");
const config = require("../api/src/config/config");

const login = async () => {
    let d = {
        "email": staticUser[1].email,
        "password": config.commonPassword
    }
    try {
        console.log("-------user creds-------", d)
        let resp = await axios.post("http://localhost:3000/v1/auth/login", d, { headers: { "Content-Type": "application/json" } })
        return resp.data.payload.access.token
    } catch (error) {
        return error
    }
}


const test = async () => {
    let token = await login()
    console.log(token)
}



const addEmissionData = async () => {

    let token = await login();
    console.log(token);

    setInterval(() => {
        for (let i = 0; i < 1; i++) {
            let data = {
                deviceID: "DEVICE-TEMP12345",
                shipmentId: "Shipment-8da2dfd3-956",
                type: "Temperature",
                value: 60
            };
            return axios.post(url, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }).then(resp => {
                console.log(resp.data);
            }).catch(function (error) {
                console.log(error);
            });
        }

    }, 200);

};


addEmissionData(0)
