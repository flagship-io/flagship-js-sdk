# Flagship JS SDK - Release notes

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
