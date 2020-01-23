export default {
  getModifications: {
    args: {
      default: [
        // = (1x unexisting key, 2x existing key + activate)
        {
          key: 'algorithmVersion',
          defaultValue: 'NOOOOO',
          activate: true,
        },
        {
          key: 'psp',
          defaultValue: 'YESESES',
          activate: true,
        },
        {
          key: 'testUnexistingKey',
          defaultValue: 'YOLOOOO',
          activate: true,
        },
      ],
      noActivate: [
        {
          key: 'algorithmVersion',
          defaultValue: 'NOOOOO',
          activate: false,
        },
        {
          key: 'psp',
          defaultValue: 'YESESES',
          activate: false,
        },
        {
          key: 'pspezrze',
          defaultValue: 'YOLOOOO',
          activate: false,
        },
      ],
      oneModifAndOneActivate: [
        {
          key: 'algorithmVersion',
          defaultValue: 'NOOOOO',
          activate: true,
        },
      ],
      requestOneUnexistingKeyWithActivate: [
        {
          key: 'testUnexistingKey',
          defaultValue: 'NOOOOO',
          activate: true,
        },
      ],
    },
    detailsModifications: {
      oneModifInMoreThanOneCampaign: {
        psp: {
          value: ['dalenys', 'yolo'],
          type: ['FLAG', 'JSON'],
          campaignId: ['blntcamqmdvg04g371f0', 'bmjdprsjan0g01uq2ceg'],
          variationId: ['blntcamqmdvg04g371hg', 'bmjdprsjan0g01uq1ctg'],
          variationGroupId: ['blntcamqmdvg04g371h0', 'bmjdprsjan0g01uq2ceg'],
          isRequested: true,
          isActivateNeeded: true,
        },
        algorithmVersion: {
          value: ['new', 'yolo2'],
          type: ['JSON', 'JSON'],
          campaignId: ['bmjdprsjan0g01uq2crg', 'bmjdprsjan0g01uq2ceg'],
          variationId: ['bmjdprsjan0g01uq2ctg', 'bmjdprsjan0g01uq1ctg'],
          variationGroupId: ['bmjdprsjan0g01uq2csg', 'bmjdprsjan0g01uq2ceg'],
          isRequested: true,
          isActivateNeeded: true,
        },
        hello: {
          value: ['world'],
          type: ['JSON'],
          campaignId: ['bmjdprsjan0g01uq2ceg'],
          variationId: ['bmjdprsjan0g01uq1ctg'],
          variationGroupId: ['bmjdprsjan0g01uq2ceg'],
          isRequested: false,
          isActivateNeeded: false,
        },
      },
      manyModifInManyCampaigns: {
        psp: {
          value: ['dalenys', 'artefact', 'yolo'],
          type: ['FLAG', 'JSON', 'JSON'],
          campaignId: [
            'blntcamqmdvg04g371f0',
            'bmjdprsjan0g01uq2crg',
            'bmjdprsjan0g01uq2ceg',
          ],
          variationId: [
            'blntcamqmdvg04g371hg',
            'bmjdprsjan0g01uq2ctg',
            'bmjdprsjan0g01uq1ctg',
          ],
          variationGroupId: [
            'blntcamqmdvg04g371h0',
            'bmjdprsjan0g01uq2csg',
            'bmjdprsjan0g01uq2ceg',
          ],
          isRequested: true,
          isActivateNeeded: true,
        },
        algorithmVersion: {
          value: ['new', 'new', 'yolo2'],
          type: ['FLAG', 'JSON', 'JSON'],
          campaignId: [
            'blntcamqmdvg04g371f0',
            'bmjdprsjan0g01uq2crg',
            'bmjdprsjan0g01uq2ceg',
          ],
          variationId: [
            'blntcamqmdvg04g371hg',
            'bmjdprsjan0g01uq2ctg',
            'bmjdprsjan0g01uq1ctg',
          ],
          variationGroupId: [
            'blntcamqmdvg04g371h0',
            'bmjdprsjan0g01uq2csg',
            'bmjdprsjan0g01uq2ceg',
          ],
          isRequested: true,
          isActivateNeeded: true,
        },
        hello: {
          value: ['world'],
          type: ['JSON'],
          campaignId: ['bmjdprsjan0g01uq2ceg'],
          variationId: ['bmjdprsjan0g01uq1ctg'],
          variationGroupId: ['bmjdprsjan0g01uq2ceg'],
          isRequested: false,
          isActivateNeeded: false,
        },
      },
    },
  },
  activateModifications: {
    args: {
      basic: [{ key: 'toto' }, { key: 'tata' }],
    },
    fetchedModifications: {
      basic: {
        visitorId: 'test-perf',
        campaigns: [
          {
            id: '5e26ccd8dcbd133baaa425b8',
            variationGroupId: '5e26ccd8cc00f72d5f3cb177',
            variation: {
              id: '5e26ccd8445a622037b1bc3b',
              modifications: {
                type: 'FLAG',
                value: { toto: 1 },
              },
            },
          },
          {
            id: '5e26ccd821f4634cf53d4cc0',
            variationGroupId: '5e26ccd8d4106bb1ae2b6455',
            variation: {
              id: '5e26ccd828feadeb6d9b8414',
              modifications: {
                type: 'FLAG',
                value: { tata: 'xxx' },
              },
            },
          },
          {
            id: '5e26ccd803533a89c3acda5c',
            variationGroupId: '5e26ccd8fcde4be7ffe5476f',
            variation: {
              id: '5e26ccd89609296ae8430037',
              modifications: {
                type: 'FLAG',
                value: { tutu: 2 },
              },
            },
          },
          {
            id: '5e26ccd81aa7ff2bd5121ea2',
            variationGroupId: '5e26ccd8219d3fe3f99fadfc',
            variation: {
              id: '5e26ccd876c0a4da63eb3961',
              modifications: {
                type: 'FLAG',
                value: { tete: 55 },
              },
            },
          },
        ],
      },
      oneKeyConflict: {
        visitorId: 'test-perf',
        campaigns: [
          {
            id: '5e26ccd821f4634cf53d4cc0',
            variationGroupId: '5e26ccd8d4106bb1ae2b6455',
            variation: {
              id: '5e26ccd828feadeb6d9b8414',
              modifications: {
                type: 'FLAG',
                value: {
                  toto: 55,
                  tutu: 'yy',
                },
              },
            },
          },
          {
            id: '5e26ccd8dcbd133baaa425b8',
            variationGroupId: '5e26ccd8cc00f72d5f3cb177',
            variation: {
              id: '5e26ccd8445a622037b1bc3b',
              modifications: {
                type: 'FLAG',
                value: {
                  toto: 2,
                },
              },
            },
          },
          {
            id: '5e26ccd803533a89c3acda5c',
            variationGroupId: '5e26ccd8fcde4be7ffe5476f',
            variation: {
              id: '5e26ccd89609296ae8430037',
              modifications: {
                type: 'FLAG',
                value: {
                  toto: 1,
                  tata: 2,
                  titi: 3,
                },
              },
            },
          },
        ],
      },
      multipleKeyConflict: {
        visitorId: 'test-perf',
        campaigns: [
          {
            id: '5e26ccd8dcbd133baaa425b8',
            variationGroupId: '5e26ccd8cc00f72d5f3cb177',
            variation: {
              id: '5e26ccd8445a622037b1bc3b',
              modifications: {
                type: 'FLAG',
                value: {
                  toto: 2,
                },
              },
            },
          },
          {
            id: '5e26ccd821f4634cf53d4cc0',
            variationGroupId: '5e26ccd8d4106bb1ae2b6455',
            variation: {
              id: '5e26ccd828feadeb6d9b8414',
              modifications: {
                type: 'FLAG',
                value: {
                  titi: 'xxx',
                  tutu: 'yy',
                },
              },
            },
          },
          {
            id: '5e26ccd803533a89c3acda5c',
            variationGroupId: '5e26ccd8fcde4be7ffe5476f',
            variation: {
              id: '5e26ccd89609296ae8430037',
              modifications: {
                type: 'FLAG',
                value: {
                  toto: 1,
                  tata: 2,
                  titi: 3,
                },
              },
            },
          },
        ],
      },
    },
  },
};
