![Flagship logo](../../src/assets/img/flagshipLogo.jpg)

# Sample of Express server using [Flagship - JS SDK](../../README.md)

### Prerequisites

-   **Node.js**: version 6.0.0 or later...

-   **Npm**: version 3.0.0 or later...

    ```

    ```

## Getting Started

-   **Install** the node module:

```
examples/api-server$ npm install
```

-   **Start** the project:

on Mac:

```
examples/api-server$ npm run start:mac
```

on Linux:

```
examples/api-server$ npm run start:linux
```

on Windows:

```
examples/api-server$ npm run start:windows
```

## Run with local Flagship JS SDK

-   You need to link `@flagship.io/js-sdk` :

    -   1 - At the root level (=`PATH/TO/flagship-js-sdk`), run:

        ```
        flagship-js-sdk$ npm link
        ```

    -   2 - Then, move to `examples/api-server`:
        ```
        examples/api-server$ npm link PATH/TO/flagship-js-sdk
        ```

## Demo

### Customize your API responses

Assuming you have a e-commerce website and you're looking to display some items on your home page.

To fetch the items, you're currently calling `http://localhost:3000/items`

```
// api-server/routes/items.js

router.get('/', function(req, res, next) {
    res.send(items);
}
```

**Check the output:**

```
curl -X GET http://localhost:3000/items
```

> The output is an array of json (=item data)

Now considering it's black friday, you're looking to target your users and provide a discount according to their purchasing frequency. Here comes Flagship SDK ~ ⛵️

In our example, we will specify it using a parameter: `discount`, which will give in our code:

```
// api-server/routes/items.js

router.get('/', function(req, res, next) {
  if(req.query.discount === 'blackfriday') {
      // USE FLAGSHIP HERE !
  } else {
    res.sendStatus(422);
  }
}
```

The code which we need to write into the `if` condition is the following:

```
const visitorId= '134546';
const visitorContext= {
    // For the purpose of this example, let's generate a random context value
    buyerFrequency: Math.floor(Math.random() * (5) ),
};
const activateAllModifications = true;

// Create the flagship visitor with given context
const fsVisitor = flagship.newVisitor(visitorId, visitorContext)

// Wait initialization...
fsVisitor.on('ready', () => {

    // Now extract desired modifications (in our case 'globalDiscount') + don't forget to specify the defaultValue
    fsVisitor.getModifications([
    {
        key: 'globalDiscount',
        defaultValue: 0,
    }
    ], activateAllModifications)
    .then(({globalDiscount}) => {

    // Flagship returns the value specified on Flagship Dashboard according the visitor which we're targeting
    items.forEach(item => {
        item.discountPercentage = globalDiscount;
    });

    // Send the items containing Flagship modifications
    res.send(items);
    });
})
```

**Check the output:**

```
curl -X GET http://localhost:3000/items\?discount\=blackfriday
```

> The ouput is the same as previous response but the `discountPercentage` has been overridden for each item according to the data provided by Flagship <br/> As you can see in the response, the overridden value is either `15` (if our visitor has less than 2 purchase frequency) or `30` (if more than 2) as we specified on the Flagship campaign

### Notify Flagship with a hit

Following our `Customize your API responses` example, let's send a `transaction` if a user purchased an item.

To do so, we defined a `POST` request:

```
// examples/api-server/routes/checkout.js

router.post('/', function(req, res, next) {
  if (req.body && req.body.transactionId) {

      // USE FLAGSHIP HERE !

      res.sendStatus(200);
    });
  } else {
    res.sendStatus(422);
  }
```

The code which we need to write into the `if` condition is the following:

```
const visitorId = '134546';
const visitorContext = {
    buyerFrequency: Math.floor(Math.random() * 5)
};

// Create the flagship visitor with given context
const fsVisitor = flagship.newVisitor(visitorId, visitorContext);

// Wait initialization...
fsVisitor.on('ready', () => {
    // Now you can send the hit !
    fsVisitor.sendHits([
    {
        type: 'Transaction',
        data: {
        transactionId: req.body.transactionId,  // required attribute
        affiliation: 'transaction'              // required attribute
                                                // NOTE: value of 'affiliation' should match the KPI specified on Flagship Dashboard
        }
    }
    ]);
```

**Check the output:**
Open your terminal, then execute:

```
curl -d "username=scott&password=secret&transactionId=12345" -X POST http://localhost:3000/checkout
```

### Stress test / Ram performance

Create a lot of visitor on your server, to see how it impacts the performance:

```
# creating 3 visitors:
curl -d "nbVisitor=3" -X POST http://localhost:3000/fsVisitor/create
```

Search for a visitor with its id.

```
curl -X GET http://localhost:3000/getInfo\?id\=VISITOR_ID
```

Search for modifications assigned to a specific visitor.

```
curl -X GET http://localhost:3000/getModifications\?id\=VISITOR_ID
```

That's it ! 🎉

Don't forget to have a look to the Flagship Dashboard screenshots of the use case which we used for those examples. 👇 👇 👇

## Flagship Dashboard screenshots

> This is the screenshots of the use case which we used for this demo

### 1 - Summary

![Summary](https://storage.googleapis.com/flagship-dev-public-storage/Screenshot%20at%20Dec%2006%2015-08-55.png)

### 2 - Description

![Description](https://storage.googleapis.com/flagship-dev-public-storage/Screenshot%20at%20Dec%2006%2015-09-15.png)

### 3 - Cases

![Cases](https://storage.googleapis.com/flagship-dev-public-storage/Screenshot%20at%20Dec%2006%2015-09-29.png)

### 4 - Targeting

![Targeting](https://storage.googleapis.com/flagship-dev-public-storage/Screenshot%20at%20Dec%2006%2015-09-45.png)

## More about Flagship SDK ?

[👉Click here 😎](../../README.md)

## What is Flagship ? ⛵️

[👉Click here 😄](https://www.abtasty.com/solutions-product-teams/)
