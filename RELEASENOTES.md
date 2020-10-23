# Flagship JS SDK - Release notes

## ➡️ Version 2.1.8

### New features 🎉

-   Contains minor optimizations for [REACT SDK](https://developers.flagship.io/docs/sdk/react/v2.0#onupdate) (onUpdate).

## ➡️ Version 2.1.7

-   Minor change.

## ➡️ Version 2.1.6

### New features 🎉

-   This new version includes a stand alone version which you can import like this:

    ```javascript

    <script src="https://cdn.jsdelivr.net/npm/@flagship.io/js-sdk@X.X.X/public/index.standalone.js"></script>
    <script>
      window.Flagship.init(...)
      // code...
    </script>

    ```

    Where `X.X.X` should be a version of the JS SDK.

## ➡️ Version 2.1.5

-   Minor change with Typescript.

## ➡️ Version 2.1.4

-   Fix issue when executing `flagship.start(envId, apiKey, { ... );` and `apiKey` is null.

## ➡️ Version 2.1.3

-   Minor change.

## ➡️ Version 2.1.2

### New features 🎉

-   Contains minor optimizations for [REACT SDK](https://github.com/abtasty/flagship-react-sdk) (updateVisitor).

## ➡️ Version 2.1.1

### New features 🎉

-   [Server side] In bucketing mode, a performance optimization has been made to avoid the use of events listener between each visitor created and the bucketing.

-   Panic mode supported. When you've enabled panic mode through the web dashboard, the SDK will detect it and be in safe mode. Logs will appear to warns you and default values for modifications will be return.

-   `timeout` setting added. It specify the timeout duration when fetching campaigns via API mode (`decisionMode = "API"`), defined in **seconds**. Minimal value should be greater than 0. More to come on this setting soon...

### Breaking changes #1 ⚠️

-   `pollingInterval` setting is now a period interval defined in **seconds** (not minutes). Minimal value is 1 second.

## ➡️ Version 2.1.0

### New features 🎉

-   New setting `initialBucketing`. It takes the data received from the flagship bucketing api endpoint. Can be useful when you save this data in cache.

-   Add `flagshipSdk.stopBucketingPolling()` function. It allows to stop the bucketing polling whenever you want.

    Example:

    ```javascript
    flagshipSdk.start('ENV_ID', { fetchNow: false, decisionMode: 'Bucketing', pollingInterval: 5 /*, other settings...*/ });

    // [...]

    flagshipSdk.startBucketingPolling(); // start manually the bucketing (as fetchNow is equal to "false")

    setTimeout(() => flagshipSdk.stopBucketingPolling(), 100 * 1000); // stop bucketing 100 minutes later...
    ```


    ```

### Bug fixes 🐛

-   When bucketing enabled, fix event's http request sent twice.

### Breaking changes #1 ⚠️

Due to bucketing optimization, the bucketing allocate a variation to a visitor differently than in SDK v2.0.X

-   As a result, assuming you have campaign with the following traffic allocation:

    -   50% => `variation1`
    -   50% => `variation2`

    By upgrading to this version, you might see your visitor switching from `variation1` to `variation2` and vice-versa.

### Breaking changes #2 ⚠️

Be aware that `apiKey` will be mandatory in the next major release as it will use the [Decision API v2](http://developers.flagship.io/api/v2/).

-   `start` function signature will change. It will takes `apiKey` (string) as second argument and `settings` is moving as third argument:

    -   **BEFORE**:

    ```javascript
    flagshipSdk.start('ENV_ID', { apiKey: 'API_KEY' /*, other settings...*/ }); // "apiKey" was not required
    ```

    -   **NOW**:

    ```javascript
    flagshipSdk.start('ENV_ID', 'API_KEY', {
        /*some settings...*/
    }); // "apiKey" IS required and MUST NOT be set in the settings argument
    ```

### Breaking changes #3 ⚠️

-   `fetchNow` setting is now `true` by default.

## ➡️ Version 2.0.4

### Bug fixes 🐛

-   Fix an error where requests are incorrectly set in case of SDK is using API v1 and `apiKey` settings is defined.

## ➡️ Version 2.0.3

### Bug fixes 🐛

-   Fix an error with murmurhash function not defined when bundling a project with Webpack.

## ➡️ Version 2.0.2

### Bug fixes 🐛

-   Fix timestamp displayed in logs.

## ➡️ Version 2.0.1

### Optimization ⚙️

-   The SDK is now checking activate http requests to avoid to send the same more than once.

### Bug fixes 🐛

-   Hot fix with `decisionMode="API"` not working correctly due to bad implementation of `exposeAllKeys=true`.

## ➡️ Version 2.0.0

### Breaking changes ⚠️

-   Following functions not available anymore:

    -   `setContext` use [`updateContext`](README.md#updateContext) instead.
    -   `initSdk` use [`start`](README.md#start) instead.
    -   `getModificationsCache` use [`getModifications`](README.md#getModifications) instead.

### New features 🎉

-   Can use `Decision API V2`, to do so, initialize the SDK like this:

```javascript
flagshipSdk.start('ENV_ID', { flagshipApi: 'https://decision.flagship.io/v2/', apiKey: 'YOUR_API_KEY' /*, other settings...*/ });
```

-   New mode `Bucketing` when initializing SDK:

```javascript
flagshipSdk.start('ENV_ID', { decisionMode: 'Bucketing', pollingInterval: 5 /*, other settings...*/ });
```

-   New option `simpleMode` for function `getAllModifications`:

```javascript
visitorInstance.getAllModifications(false, { simpleMode: true }).then((response) => {
    /*
    "response" will have following shape:
    {
      modificationKey1: modificationValue1,
      modificationKey2: modificationValue2,
      modificationKeyN: modificationValueN,
    }
    */
});
```

## ➡️ Version 1.2.1

### Bug fixes 🐛

-   Minor log fix when sending hits.

## ➡️ Version 1.2.0

### Breaking changes ⚠️

-   When sending a hit "Item", the attribute `ic`(="item code") is now **required** (was optional before). If you do not specify it, the hit won't be send and an error log will be display.

## ➡️ Version 1.1.2

### Bug fixes 🐛

-   Minor typescript fix

## ➡️ Version 1.1.1

### Bug fixes 🐛

-   Fix `config` issue when specifying empty values.

## ➡️ Version 1.1.0

### New features 🎉

-   Add [`getModificationInfo`](README.md#getModificationInfo) function.

### Breaking changes ⚠️

-   Function removed:

    -   createVisitor --> [use `newVisitor` instead](README.md#newVisitor)

## ➡️ Version 1.0.1

### Bug fixes 🐛

-   Fix `activate` http requests which had bad payload.

## ➡️ Version 1.0.0

-   Release version.

## ➡️ Version 0.1.14

### Improvements

-   The SDK is now saving modifications in cache differently:

#### Shape after:

```javascript
arrayOf(
  {
    id: string;
    variationGroupId: string;
    variation: {
      id: string;
      modifications: {
        type: string;
        value: {
          [key: string]: any;
        };
      };
    };
  }
)
```

#### Shape before:

```javascript
{
    visitorId: string;
    campaigns: arrayOf(
      {
        id: string;
        variationGroupId: string;
        variation: {
          id: string;
          modifications: {
            type: string;
            value: {
              [key: string]: any;
            };
          };
        };
      }
    )
}
```

## ➡️ Version 0.1.13

### Improvements

-   New setting `initialModifications` available.

## ➡️ Version 0.1.12

### Improvements

-   New setting `apiKey` available.

## ➡️ Version 0.1.11

### Improvements

-   Move some `info` logs as `debug` logs.

### Bug fixes 🐛

-   Add `events` as node module dependency.

## ➡️ Version 0.1.10

### Improvements

-   Improve debug logs when sending a hit.

## ➡️ Version 0.1.9

-   Jumped version.

## ➡️ Version 0.1.8

### Bug fixes 🐛

-   Minor typescript fix

## ➡️ Version 0.1.7

### Breaking changes ⚠️

-   New behavior for:

    -   getModifications, it will return modifications from cache and won't return a promise anymore.

-   Some functions name have changed. Both are supported for now but deprecated names will be deleted soon:

    -   setContext --> [`updateContext`](README.md#updateContext)
    -   newVisitor --> [`createVisitor`](README.md#createVisitor)
    -   initSdk --> [`start`](README.md#start)
    -   getModificationsCache --> Will be deleted soon, you can replace it with [`getModifications`](README.md#getModifications).

### New features 🎉

-   New function added:

    -   [`sendHit`](README.md#sendHit)

### Bug fixes 🐛

-   Typescript supports `saveCache` listener

## ➡️ Version 0.1.6

### New features 🎉

-   New listener for <i>FlagshipVisitor</i> class => `saveCache` ([click here](README.md#events-listener) to see the documentation)

## ➡️ Version 0.1.5

-   Build not minified.
-   `index.d.ts` without errors.

### Bug fixes 🐛

-   Minor fix

## ➡️ Version 0.1.4

-   Jumped version.

## ➡️ Version 0.1.3

-   Jumped version.

## ➡️ Version 0.1.2

### Bug fixes 🐛

-   Fix issue depending on if you use the sdk in a node or browser environment.

## ➡️ Version 0.1.1

### Bug fixes 🐛

-   Fix handling flags defined with a falsy value instead or returning default flag value.

## ➡️ Version 0.1.0

### New features 🎉

-   Documentation improved (developer friendly ++).

### Bug fixes 🐛

-   Minor bug fixes

## ➡️ Version 0.0.8

### Breaking changes ⚠️

-   The following functions does not have any more `fetchMode` argument:

    -   [`getModificationsForCampaign`](README.md#getModificationsForCampaign)
    -   [`getAllModifications`](README.md#getAllModifications)

    As a result, they always return same output shape.

-   The following functions returns now a **new** specific output shape:

    -   [`getModificationsForCampaign`](README.md#getModificationsForCampaign)
    -   [`getAllModifications`](README.md#getAllModifications)

    They now returns the following output shape:

    ```
    {
      data: {
          visitorId: 'VISITOR_ID',
          campaigns: [
              {
              id: 'CAMPAIGN_ID',
              variationGroupId: 'VARIATION_GROUP_ID',
              variation: {
                  id: 'VARIATION_ID',
                  modifications: {
                  type: 'FLAG',
                  value: {
                      btnColor: '#fff',
                  },
                  },
              },
              },
              // {...}
          ]
      }
    }
    ```

### New features 🎉

-   New available function `getModificationsCache`.

    Basically, it allows you to get modifications without using promise after it has been saved in cache. More info [here 👈](README.md#getModificationsCache)

-   New available function `activateModifications`.

    It allows you to activate automatically the campaigns which are matching the modifications that you specify in arguments. More info [here 👈](README.md#activateModifications)
