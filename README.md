
## Project: Commerce SDK Evaluation

The scope of this project is to demonstrate the capabilities of the Commerce SDK. The Commerce SDK is scripted in TypeScript which can be compiled into JavaScript and can be leveraged with any presentation / BFF layer utilizing JavaScript technologies.

**_Description_**: The code here will evaluate the new CCAPIs released from Salesfore Commere Cloud in August 2020. Please follow the link for more on the API details, documentation and training: [Commerce Cloud Developer Center](https://developer.commercecloud.com/s/commerce-api)

## Version

**Stable Build:** 0.0.1

**Dated:** October 24, 2020

**Type:** TypeScript file (Compile with TypeScript Compiler)

## Release Info

1. Will be updated if there is a significant change.

## Known Issues

There are some known issues and they are mentioned below:
 
1. None so far as this is still demo.

## Setup

This section describes what you will need to get started. Please note that you will need to estimate effort for the initial Setup as it involves Open Source components and also Salesforce Commerce Cloud specific setup to invoke the APIs. This assumes that you are trying to setup in a *Nix / Mac environment. Windows environment may have additional items for setup outside the scope of the project and documentation.

**Open Source setup**

1. Download NodeJS & NPM from [Node](https://nodejs.org/en/). Supported versions are Node 10.0.0 LTS and 12.0.0 LTS.
2. Recommended usage is to install Node from NVM or [Node Version Manager](https://github.com/nvm-sh/nvm). Please follow the installation steps as shown in the link.
3. Strongly recommend download and Install [VSCode](https://code.visualstudio.com/download). This is the best available IDE that allows you to work with TypeScript, including Auto-complete and Code-Complete and easy compile options.
4. Install the TypeScript compiler from the [NPM repository](https://www.npmjs.com/package/typescript). Run the command `sudo npm install -g typescript`.
5. Install [TS-Node](https://www.npmjs.com/package/ts-node) which will allow you to run the `*.ts` file directly without compiling to `*.js` files. Run the command `sudo npm install -g ts-node`.

**Salesforce Commerce Cloud setup**

1. Get a Commerce Cloud sandbox and install the storfront reference application.
2. Get an API Short Code.
3. Get the API Organization ID.
4. Log into Account Manager and get an API Client ID.
5. Make sure when you follow the steps below when you create the API Client ID.

>Salesforce Commerce API (Scope):
Add your sandbox otherwise it will not work on that sandbox

>Allowed Scopes:
sfcc.shopper-products
sfcc.shopper-customers

>Token Endpoint Auth Method: client_secret_post
>Access Token Format: JWT

## Execution

Once you have the project downloaded open it using VSCode. You will be able to see the syntax highlighting and code completion features right away. Before you begin to execute the `*.ts` files you will need to add your own `dwconstants.ts` to start with. The `dwconstants.sample` file has been provided to you. You will need to change the minimum of these four lines to compile and / or execute any of the `*.ts` OR `*.js` files.

```
export const apiConfig = {
    clientId: "your-ocapi-client-id-in-am",
    organizationId: "your-org-id",
    shortCode: "your-short-code",
    siteId: "your-site-id",
};
```

Once you have changed the file and the filename you are ready! Go to VSCode > View > Terminal. You will be able to see a shell open up here. You can now enter the command to run the desired `*.ts` file directly. For instance:

```
$ ts-node shopper-product.ts
```

If you want to compile to a JavaScript file use the `tsc` followed by a `node` command. Note how the `*.js` file has been created in the same root:

```
$ tsc shopper-product.ts
$ node shopper-product.js
```

If you are keen on experimenting with the compiler options then create a `tsconfig.json` file. Here are some references to get setup with a `tsconfig.json` file. Currently tsconfig is out of scope of the current evaluation.

https://www.typescriptlang.org/docs/handbook/tsconfig-json.html
https://stackoverflow.com/questions/37413533/what-is-the-purpose-of-tsconfig-json

## Warranty & Support

This is completely open source and free to modify and distribute. There is no warranty or support for anything related to performance, scalbility or code compatibility. Security assessment of the code and what it performs has to be verified by the party that agrees to download and use this evaluation code. The evaluation code is not supported, and is provided "as is", without warranty of any kind, express or implied. in no event shall the distributor, Romit (romitmaity@yahoo.com) have any liability for any damages.

## Copyright

&copy; Romit Maity 2020
*Free to modify and distribute.*
