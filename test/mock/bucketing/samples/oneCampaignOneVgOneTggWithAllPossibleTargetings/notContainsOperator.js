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

                    NOT CONTAINS - OPERATOR

                  */

                                    // NOT_CONTAINS - STRING
                                    {
                                        operator: 'NOT_CONTAINS',
                                        key: 'notContainsString',
                                        value: 'test'
                                    },
                                    {
                                        // NOT_CONTAINS - STRING[]
                                        operator: 'NOT_CONTAINS',
                                        key: 'notContainsStringArray',
                                        value: ['test1', 'test2', 'test3']
                                    },
                                    {
                                        // NOT_CONTAINS - NUMBER
                                        operator: 'NOT_CONTAINS',
                                        key: 'notContainsNumber',
                                        value: 123
                                    },
                                    {
                                        // NOT_CONTAINS - NUMBER[]
                                        operator: 'NOT_CONTAINS',
                                        key: 'notContainsNumberArray',
                                        value: [1, 2, 3]
                                    },
                                    {
                                        // NOT_CONTAINS - BOOL
                                        operator: 'NOT_CONTAINS',
                                        key: 'notContainsBool',
                                        value: false
                                    },
                                    {
                                        // NOT_CONTAINS - BOOL[]
                                        operator: 'NOT_CONTAINS',
                                        key: 'notContainsBoolArray',
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
