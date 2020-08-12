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

                    LOWER THAN - OPERATOR

                  */

                                    // LOWER_THAN - STRING
                                    {
                                        operator: 'LOWER_THAN',
                                        key: 'lowerThanString',
                                        value: 'test'
                                    },
                                    {
                                        // LOWER_THAN - STRING[]
                                        operator: 'LOWER_THAN',
                                        key: 'lowerThanStringArray',
                                        value: ['test1', 'test2', 'test3']
                                    },
                                    {
                                        // LOWER_THAN - NUMBER
                                        operator: 'LOWER_THAN',
                                        key: 'lowerThanNumber',
                                        value: 123
                                    },
                                    {
                                        // LOWER_THAN - NUMBER[]
                                        operator: 'LOWER_THAN',
                                        key: 'lowerThanNumberArray',
                                        value: [1, 2, 3]
                                    },
                                    {
                                        // LOWER_THAN - BOOL
                                        operator: 'LOWER_THAN',
                                        key: 'lowerThanBool',
                                        value: false
                                    },
                                    {
                                        // LOWER_THAN - BOOL[]
                                        operator: 'LOWER_THAN',
                                        key: 'lowerThanBoolArray',
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
