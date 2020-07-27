export default {
    visitorId: 'test-perf',
    campaigns: [
        {
            id: 'blntcamqmdvg04g371f0',
            variationGroupId: 'blntcamqmdvg04g777h0', // simulating that the visitor match another scenario
            variation: {
                id: 'blntcamqmdvg04g777hg',
                modifications: {
                    type: 'FLAG',
                    value: {
                        modif1: 'valueFromOtherVgId'
                    }
                }
            }
        }
    ]
};
