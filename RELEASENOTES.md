# Flagship JS SDK - Release notes

## ➡️ Version 1.0.1

### Bug fixes 🐛

- Fix `activate` http requests which had bad payload.

## ➡️ Version 1.0.0

- Release version.

## ➡️ Version 0.1.14

### Improvements

- The SDK is now saving modifications in cache differently:

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

- New setting `initialModifications` available.

## ➡️ Version 0.1.12

### Improvements

- New setting `apiKey` available.

## ➡️ Version 0.1.11

### Improvements

- Move some `info` logs as `debug` logs.

### Bug fixes 🐛

- Add `events` as node module dependency.

## ➡️ Version 0.1.10

### Improvements

- Improve debug logs when sending a hit.

## ➡️ Version 0.1.9

- Jumped version.

## ➡️ Version 0.1.8

### Bug fixes 🐛

- Minor typescript fix

## ➡️ Version 0.1.7

### Breaking changes ⚠️

- New behavior for:

  - getModifications, it will return modifications from cache and won't return a promise anymore.

- Some functions name have changed. Both are supported for now but deprecated names will be deleted soon:

  - setContext --> [`updateContext`](README.md#updateContext)
  - newVisitor --> [`createVisitor`](README.md#createVisitor)
  - initSdk --> [`start`](README.md#start)
  - getModificationsCache --> Will be deleted soon, you can replace it with [`getModifications`](README.md#getModifications).

### New features 🎉

- New function added:

  - [`sendHit`](README.md#sendHit)

### Bug fixes 🐛

- Typescript supports `saveCache` listener

## ➡️ Version 0.1.6

### New features 🎉

- New listener for <i>FlagshipVisitor</i> class => `saveCache` ([click here](README.md#events-listener) to see the documentation)

## ➡️ Version 0.1.5

- Build not minified.
- `index.d.ts` without errors.

### Bug fixes 🐛

- Minor fix

## ➡️ Version 0.1.4

- Jumped version.

## ➡️ Version 0.1.3

- Jumped version.

## ➡️ Version 0.1.2

### Bug fixes 🐛

- Fix issue depending on if you use the sdk in a node or browser environment.

## ➡️ Version 0.1.1

### Bug fixes 🐛

- Fix handling flags defined with a falsy value instead or returning default flag value.

## ➡️ Version 0.1.0

### New features 🎉

- Documentation improved (developer friendly ++).

### Bug fixes 🐛

- Minor bug fixes

## ➡️ Version 0.0.8

### Breaking changes ⚠️

- The following functions does not have any more `fetchMode` argument:

  - [`getModificationsForCampaign`](README.md#getModificationsForCampaign)
  - [`getAllModifications`](README.md#getAllModifications)

  As a result, they always return same output shape.

- The following functions returns now a **new** specific output shape:

  - [`getModificationsForCampaign`](README.md#getModificationsForCampaign)
  - [`getAllModifications`](README.md#getAllModifications)

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

- New available function `getModificationsCache`.

  Basically, it allows you to get modifications without using promise after it has been saved in cache. More info [here 👈](README.md#getModificationsCache)

- New available function `activateModifications`.

  It allows you to activate automatically the campaigns which are matching the modifications that you specify in arguments. More info [here 👈](README.md#activateModifications)
