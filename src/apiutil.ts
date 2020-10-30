import * as fs from "fs";

/* File Name to save the Customer and Token info */
const fileName = "./authtoken.json";

/**
 * Writes the customer JWT info and token to the file.
 * @param authToken
 * @param customerLogin
 * @param customerId
 */
export function writeCustomerJWTAttributes(registeredCustomerObj: Object, registeredCustomerToken: String) {
    try {
        const currTimeMillis = Date.now();
        console.log(`Current Time in ms: ${currTimeMillis}`);
        const wrData = `[{"c_tokenCreateTimeInMillis": ${currTimeMillis}, "c_customerJWT": "${registeredCustomerToken}"}, ${JSON.stringify(registeredCustomerObj)}]`;
        fs.writeFile(fileName, wrData, (err) => {
            console.log(`Error in writeCustomerJWTAttributes fn():\n${err.message}`);
        });
    } catch (err) {
        console.error(`Error in writeCustomerJWTAttributes fn():\n${err.response.text()}`);
    }
}

/**
 * Get the details of the logged in customer and the JWT info
 * @returns Object
 */
export function readCustomerJWTAttibutes() {
    try {
        const fContents = fs.readFileSync(fileName);
        //console.log(JSON.parse(fContents.toString()));
        return JSON.parse(fContents.toString());
    } catch (err) {
        console.error(`Error in readCustomerJWTAttibutes fn():\n${err.response.text()}`);
    }
}
