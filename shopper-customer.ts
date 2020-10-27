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
//import { ShopperCustomers } from "commerce-sdk/dist/customer/customer";
import * as commerceSdkUtils from "@commerce-apps/core";
import { ShopperToken } from "@commerce-apps/core";
import { apiConfig, loginAttributes, customerAttributes } from "./dwconstants";
import { ShopperCustomers } from "commerce-sdk/dist/customer/customer";

//client configuration parameters
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
 * Get registered customer object
 * @returns Promise<ShopperCustomers.Customer>
 */
async function getRegisteredCustomerInfo(loginEmail: String, loginPwd: String): Promise<ShopperToken<Object>> {
    try {
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
        const resClient = await shopperClient.authorizeCustomer(
            {
                headers: clientConfig.headers,
                body: { type: "credentials" },
            },
            true
        );
        const shopperToken = new commerceSdkUtils.ShopperToken(
            await commerceSdkUtils.getObjectFromResponse(resClient),
            commerceSdkUtils.stripBearer(resClient.headers.get("Authorization"))
        );
        return shopperToken;
    } catch (e) {
        console.error(e);
        console.error(e.response.text());
    }
}

getRegisteredCustomerInfo(loginAttributes.shopperUsername, loginAttributes.shopperPassword)
    .then((client) => {
        const customerObj: ShopperCustomers.Customer = client.getCustomerInfo();
        //console.log(client.getBearerHeader());
        // Add to the Client Config object of the SDK
        clientConfig.headers["Authorization"] = client.getBearerHeader();
        const customerClient = new commerceSdk.Customer.ShopperCustomers(clientConfig);

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
        // customerClient.removeCustomerAddress
        customerClient
            .createCustomerAddress({
                parameters: { customerId: customerObj.customerId },
                body: newAddress,
            })
            .then((addrResponse) => {
                console.log(typeof addrResponse);
                customerClient
                    .getCustomerAddress({
                        parameters: { customerId: customerObj.customerId, addressName: customerAttributes.addressName },
                    })
                    .then((customerInfo) => {
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
