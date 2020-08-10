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

                    ENDS WITH - OPERATOR

                  */

                                    // ENDS_WITH - STRING
                                    {
                                        operator: 'ENDS_WITH',
                                        key: 'endsWithString',
                                        value: 'test'
                                    },
                                    {
                                        // ENDS_WITH - STRING[]
                                        operator: 'ENDS_WITH',
                                        key: 'endsWithStringArray',
                                        value: ['test1', 'test2', 'test3']
                                    },
                                    {
                                        // ENDS_WITH - NUMBER
                                        operator: 'ENDS_WITH',
                                        key: 'endsWithNumber',
                                        value: 123
                                    },
                                    {
                                        // ENDS_WITH - NUMBER[]
                                        operator: 'ENDS_WITH',
                                        key: 'endsWithNumberArray',
                                        value: [1, 2, 3]
                                    },
                                    {
                                        // ENDS_WITH - BOOL
                                        operator: 'ENDS_WITH',
                                        key: 'endsWithBool',
                                        value: false
                                    },
                                    {
                                        // ENDS_WITH - BOOL[]
                                        operator: 'ENDS_WITH',
                                        key: 'endsWithBoolArray',
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
