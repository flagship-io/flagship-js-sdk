# Flagship JS SDK - Release notes

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
