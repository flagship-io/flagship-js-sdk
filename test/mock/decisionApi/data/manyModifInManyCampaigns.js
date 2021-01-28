export default {
    visitorId: 'test-perf',
    campaigns: [
        {
            id: 'blntcamqmdvg04g371f0',
            variationGroupId: 'blntcamqmdvg04g371h0',
            variation: {
                id: 'blntcamqmdvg04g371hg',
                modifications: {
                    type: 'FLAG',
                    value: {
                        psp: 'dalenys',
                        algorithmVersion: 'new'
                    }
                }
            }
        },
        {
            id: 'bmjdprsjan0g01uq2crg',
            variationGroupId: 'bmjdprsjan0g01uq2csg',
            variation: {
                id: 'bmjdprsjan0g01uq2ctg',
                modifications: {
                    type: 'JSON',
                    value: {
                        psp: 'artefact',
                        algorithmVersion: 'new'
                    }
                }
            }
        },
        {
            id: 'bmjdprsjan0g01uq2ceg',
            variationGroupId: 'bmjdprsjan0g01uq2ceg',
            variation: {
                id: 'bmjdprsjan0g01uq1ctg',
                reference: true,
                modifications: {
                    type: 'JSON',
                    value: {
                        algorithmVersion: 'yolo2',
                        psp: 'yolo',
                        hello: 'world'
                    }
                }
            }
        }
    ]
};
