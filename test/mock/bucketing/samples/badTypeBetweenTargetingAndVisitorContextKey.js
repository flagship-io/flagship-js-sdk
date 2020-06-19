export default {
    campaigns: [
        {
            id: 'bptggipaqi903f3haq0g',
            type: 'ab',
            variationGroups: [
                {
                    id: 'bptggipaqi903f3haq1g',
                    targeting: {
                        targetingGroups: [
                            {
                                targetings: [
                                    {
                                        // LOWER_THAN - BAD TYPE
                                        operator: 'LOWER_THAN',
                                        key: 'lowerThanBadType',
                                        value: "I'm supposed to be a number"
                                    },
                                    {
                                        // LOWER_THAN - BAD TYPE
                                        operator: 'LOWER_THAN',
                                        key: 'lowerThanBadTypeJson',
                                        value: { toto: 123 }
                                    },
                                    {
                                        // LOWER_THAN - BAD TYPE
                                        operator: 'LOWER_THAN',
                                        key: 'lowerThanBadTypeArray', // 98
                                        value: [1, 2, "I'm supposed to be a number"]
                                    }
                                ]
                            }
                        ]
                    },
                    variations: [
                        {
                            id: 'bptggipaqi903f3haq20',
                            modifications: {
                                type: 'JSON',
                                value: {
                                    testCache: null
                                }
                            },
                            allocation: 50,
                            reference: true
                        },
                        {
                            id: 'bptggipaqi903f3haq2g',
                            modifications: {
                                type: 'JSON',
                                value: {
                                    testCache: 'value'
                                }
                            },
                            allocation: 50
                        }
                    ]
                }
            ]
        }
    ],
    panic: false
};
