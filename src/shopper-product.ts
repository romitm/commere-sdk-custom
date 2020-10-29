/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 * Author: rmaity@salesforce.com
 * Date: Oct-24-2020
 * TS Implamentation of the SDK
 */

/**
 * Get authorization token for a guest user
 * Usage: ts-node examples/01-guest-shopper-auth-token.ts
 * Usage (custom): ts-node shopper-product.ts
 * Note: Replace configuration parameters before running
 */
import * as commerceSdk from "commerce-sdk";
import { apiConfig } from "../dwconstants";
import { storefrontAttributes } from "./apiconstants";

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
 * Invoke helper function to retrieve the authorization token for the guest user
 * Doc: https://salesforcecommercecloud.github.io/commerce-sdk/modules/_helpers_.html#getshoppertoken
 */
commerceSdk.helpers
    .getShopperToken(clientConfig, { type: "guest" })
    .then(async (token) => {
        try {
            if (clientConfig.headers) {
                // Add the bearer token to the client configuration
                clientConfig.headers["Authorization"] = token.getBearerHeader();
                // Create a new ShopperProduct API client
                const productClient = new commerceSdk.Product.ShopperProducts(clientConfig);
                // Get Details for the particular Product
                const getProductResults = await productClient.getProduct({
                    parameters: {
                        id: storefrontAttributes.productId,
                        siteId: apiConfig.siteId,
                    },
                });
                // Log the Product information retrieved. The Product ID was supplied in the dwconstants file
                console.log(`\n\n${JSON.stringify(getProductResults, null, 4)}`);
                // Send the client to the next chain
                return productClient;
            }
        } catch (e) {
            console.error(e);
            console.error(await e.response.text());
        }
    })
    .then(async (productClient) => {
        try {
            if (productClient) {
                // Get Details for the particular Product
                const getProductsResults = await productClient.getProducts({
                    parameters: {
                        ids: storefrontAttributes.productIds,
                        siteId: apiConfig.siteId,
                    },
                });
                // Log the Product information retrieved. The Product ID was supplied in the dwconstants file
                console.log(`\n\n${JSON.stringify(getProductsResults, null, 4)}`);
            }
            // Send the client to the next chain
            return productClient;
        } catch (e) {
            console.error(e);
            console.error(await e.response.text());
        }
    })
    .then(async (productClient) => {
        try {
            if (productClient) {
                // Get Details for the particular Product
                const getProductsCategory = await productClient.getCategory({
                    parameters: { id: storefrontAttributes.catId, siteId: apiConfig.siteId },
                });
                // Log the Product information retrieved. The Product ID was supplied in the dwconstants file
                console.log(`\n\n${JSON.stringify(getProductsCategory, null, 4)}`);
            }
            // Send the client to the next chain
            return productClient;
        } catch (e) {
            console.error(e);
            console.error(await e.response.text());
        }
    })
    .then(async (productClient) => {
        try {
            if (productClient) {
                // Get Details for the particular Product
                const getProductsCategories = await productClient.getCategories({
                    parameters: { ids: storefrontAttributes.catIds, siteId: apiConfig.siteId },
                });
                // Log the Product information retrieved. The Product ID was supplied in the dwconstants file
                console.log(`\n\n${JSON.stringify(getProductsCategories, null, 4)}`);
            }
        } catch (e) {
            console.error(e);
            console.error(await e.response.text());
        }
    })
    .catch(async (e) => {
        console.error(e);
        console.error(await e.response.text());
    });
