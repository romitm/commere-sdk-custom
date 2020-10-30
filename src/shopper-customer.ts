/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 * Author: rmaity@salesforce.com
 * Date: Oct-25-2020
 * TS Implamentation of the SDK
 */

/**
 * Get authorization token for a guest user
 * Usage: ts-node examples/01-guest-shopper-auth-token.ts
 * Usage (custom): ts-node shopper-customer.ts
 * Note: Replace configuration parameters before running
 */
import * as commerceSdk from "commerce-sdk";
import * as commerceSdkUtils from "@commerce-apps/core";
import { apiConfig } from "../dwconstants";
import { loginAttributes, customerAttributes } from "./apiconstants";
import { readCustomerJWTAttibutes, writeCustomerJWTAttributes } from "./apiutil";
import { ShopperCustomers } from "commerce-sdk/dist/customer/customer";

/* Client configuration parameters */
const clientConfig: commerceSdk.ClientConfig = {
    parameters: {
        clientId: apiConfig.clientId,
        organizationId: apiConfig.organizationId,
        shortCode: apiConfig.shortCode,
        siteId: apiConfig.siteId,
    },
    headers: {},
};

/**
 * Get registered customer object.
 * @param Object: {username: String, password: String}
 * @returns Promise<ShopperToken>
 */
async function getRegisteredCustomerInfo({ loginEmail, loginPwd }: { loginEmail: String; loginPwd: String }): Promise<commerceSdkUtils.ShopperToken<Object>> {
    try {
        //
        const currentCustomer = readCustomerJWTAttibutes();
        const isTokenAvl = (Date.now() - currentCustomer[0].c_tokenCreateTimeInMillis) / 1000 > 1800;
        console.log(isTokenAvl);
        //console.log(currentCustomer[0].c_tokenCreateTimeInMillis);
        if (isTokenAvl) {
            // Credentials and Base64 Encoding of that
            const credentials = `${loginEmail}:${loginPwd}`;
            const buffer = Buffer.from(credentials);
            const base64data = buffer.toString("base64");

            // Add to the Client Config object of the SDK
            clientConfig.headers["Authorization"] = `Basic ${base64data}`;

            // Print the Header
            console.log(`Header:\n${JSON.stringify(clientConfig.headers, null, 4)}`);

            // Instantiate the ShopperCustomers with the new config
            const shopperClient = new commerceSdk.Customer.ShopperCustomers(clientConfig);

            // Authorize the customer and then return the ShopperCustomers object
            /* API call 01: Authorize Customer call here. */
            const resClient = await shopperClient.authorizeCustomer(
                {
                    headers: clientConfig.headers,
                    body: { type: "credentials" },
                },
                true
            );
            
            // Extract the Header and store the object data
            const customerResponseObj = await commerceSdkUtils.getObjectFromResponse(resClient);
            const customerAuthToken = commerceSdkUtils.stripBearer(resClient.headers.get("Authorization"));

            // Write Token and Customer object info to file
            writeCustomerJWTAttributes(customerResponseObj, customerAuthToken);

            // Prepare the ShopperToken Object for subsequent calls
            const shopperToken = new commerceSdkUtils.ShopperToken(customerResponseObj, customerAuthToken);
            return shopperToken;
        } else {
            // No need for Registered Customer Token retrieval as the token is still valid
            const shopperToken = new commerceSdkUtils.ShopperToken(currentCustomer[1], currentCustomer[0].c_customerJWT);
            return shopperToken;
        }
    } catch (err) {
        console.error(`Error in getRegisteredCustomerInfo fn():\n${err.response.text()}`);
    }
}

/**
 *  Invoke Method to Get a Customer token (JWT)
 *  And then proceed with creating a new address block and print it.
 **/
getRegisteredCustomerInfo({ loginEmail: loginAttributes.shopperUsername, loginPwd: loginAttributes.shopperPassword })
    .then((client) => {
        // Retrieve the Customer object to perform following chain functions.
        const customerObj: ShopperCustomers.Customer = client.getCustomerInfo();

        // Add to the Client Config object of the SDK
        clientConfig.headers["Authorization"] = client.getBearerHeader();
        const customerClient = new commerceSdk.Customer.ShopperCustomers(clientConfig);

        // Create a JSON Sample Address body.
        // Ideally this line will move to a constants file.
        const newAddress: commerceSdk.Customer.ShopperCustomers.CustomerAddress = {
            address1: "5 Wall St",
            address2: "Suite 220",
            addressId: "Home",
            city: "Burlington",
            companyName: "Salesforce Commerce Cloud",
            countryCode: "US",
            firstName: "John",
            jobTitle: "Developer",
            lastName: "Murphy",
            phone: "508-320-4189",
            postBox: "12a",
            postalCode: "01803",
            preferred: false,
            salutation: "Mr.",
            secondName: "Jim",
            stateCode: "MA",
            title: "Jr.",
        };

        /* API call 02: Create Customer Address call here. */
        customerClient
            .createCustomerAddress({
                parameters: { customerId: customerObj.customerId },
                body: newAddress,
            })
            .then((addrResponse) => {
                console.log(typeof addrResponse);

                /* API call 03: Get Customer Address call here. */
                customerClient
                    .getCustomerAddress({
                        parameters: { customerId: customerObj.customerId, addressName: customerAttributes.addressName },
                    })
                    .then((customerInfo) => {
                        // Log the customer address information here.
                        console.log(customerInfo);
                    })
                    .catch(async (err) => {
                        console.error(`Error in getCustomerAddress: ${err}`);
                        console.error(await err.response.text());
                    });
            })
            .catch(async (err) => {
                console.error(`Error in createCustomerAddress: ${err}`);
                console.error(await err.response.text());
            });
    })
    .catch(async (error) => {
        console.error(`Error in getRegisteredCustomerInfo: ${error}`);
        console.error(await error.response.text());
    });

// function readCustomerJWTAttibutes(): Object {
//     fs.readFile("./authtoken.json", "utf-8", function (err, data) {
//         console.log(err);
//         console.log(data);
//     });
//     return;
// }

// function writeCustomerJWTAttributes(authToken: String, customerLogin: String, customerId: String) {
//     try {
//         const currTimeMillis = Date.now();
//         const wrData = `{"createTime": ${currTimeMillis}, "authToken": "${authToken}", "customerLogin": "${customerLogin}", "customerId": "${customerId}" }`;
//         fs.writeFileSync("./authtoken.json", wrData);
//     } catch (err) {
//         console.error(err.response.text());
//     }
// }
