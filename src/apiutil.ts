import * as fs from "fs";

/* File Name to save the Customer and Token info */
const fileName = "./authtoken.json";

/**
 * Writes the customer JWT info and token to the file.
 * @param authToken
 * @param customerLogin
 * @param customerId
 */
export function writeCustomerJWTAttributes(authToken: String, customerLogin: String, customerId: String) {
    try {
        const currTimeMillis = Date.now();
        console.log(currTimeMillis);
        const wrData = `{ "createTime": ${currTimeMillis}, "authToken": "${authToken}", "customerLogin": "${customerLogin}", "customerId": "${customerId}" }`;
        // fs.writeFileSync(fileName, wrData, (err) => {
        //     console.log(`Error in writeCustomerJWTAttributes fn():\n${err.message}`);
        // });
        fs.writeFileSync(fileName, wrData);
    } catch (err) {
        console.error(`Error in writeCustomerJWTAttributes fn():\n${err.response.text()}`);
    }
}

/**
 * Get the details of the logged in customer and the JWT info
 * @returns Object
 */
export function readCustomerJWTAttibutes(): Object {
    fs.readFile(fileName, "utf-8", function (err, data) {
        console.log(err);
        console.log(data);
    });
    return;
}
