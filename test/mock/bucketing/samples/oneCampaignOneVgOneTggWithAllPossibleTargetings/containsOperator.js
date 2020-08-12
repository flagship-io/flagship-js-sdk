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

                    CONTAINS - OPERATOR

                  */

                                    // CONTAINS - STRING
                                    {
                                        operator: 'CONTAINS',
                                        key: 'containsString',
                                        value: 'test'
                                    },
                                    {
                                        // CONTAINS - STRING[]
                                        operator: 'CONTAINS',
                                        key: 'containsStringArray',
                                        value: ['test1', 'test2', 'test3']
                                    },
                                    {
                                        // CONTAINS - NUMBER
                                        operator: 'CONTAINS',
                                        key: 'containsNumber',
                                        value: 123
                                    },
                                    {
                                        // CONTAINS - NUMBER[]
                                        operator: 'CONTAINS',
                                        key: 'containsNumberArray',
                                        value: [1, 2, 3]
                                    },
                                    {
                                        // CONTAINS - BOOL
                                        operator: 'CONTAINS',
                                        key: 'containsBool',
                                        value: false
                                    },
                                    {
                                        // CONTAINS - BOOL[]
                                        operator: 'CONTAINS',
                                        key: 'containsBoolArray',
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
