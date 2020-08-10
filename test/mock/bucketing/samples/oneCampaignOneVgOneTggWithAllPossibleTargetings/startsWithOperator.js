export default {
    lastModifiedDate: 'Wed, 18 Mar 2020 23:29:16 GMT',
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
                                    /*

                    STARTS WITH - OPERATOR

                  */

                                    // STARTS_WITH - STRING
                                    {
                                        operator: 'STARTS_WITH',
                                        key: 'startsWithString',
                                        value: 'test'
                                    },
                                    {
                                        // STARTS_WITH - STRING[]
                                        operator: 'STARTS_WITH',
                                        key: 'startsWithStringArray',
                                        value: ['test1', 'test2', 'test3']
                                    },
                                    {
                                        // STARTS_WITH - NUMBER
                                        operator: 'STARTS_WITH',
                                        key: 'startsWithNumber',
                                        value: 123
                                    },
                                    {
                                        // STARTS_WITH - NUMBER[]
                                        operator: 'STARTS_WITH',
                                        key: 'startsWithNumberArray',
                                        value: [1, 2, 3]
                                    },
                                    {
                                        // STARTS_WITH - BOOL
                                        operator: 'STARTS_WITH',
                                        key: 'startsWithBool',
                                        value: false
                                    },
                                    {
                                        // STARTS_WITH - BOOL[]
                                        operator: 'STARTS_WITH',
                                        key: 'startsWithBoolArray',
                                        value: [false, false, false]
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
