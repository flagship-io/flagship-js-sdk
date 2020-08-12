export default {
    visitorId: 'test-perf',
    campaigns: [
        {
            id: 'blntcamqmdvg04g371f0',
            variationGroupId: 'blntcamqmdvg04g371h0',
            variation: {
                id: 'blntcamqmdvg04g371hg',
                modifications: {
                    type: 'JSON',
                    value: {
                        array: [1, 2, 3],
                        complex: {
                            carray: [
                                {
                                    cobject: 0
                                }
                            ]
                        },
                        object: {
                            value: 123456
                        }
                    }
                }
            }
        }
    ]
};
