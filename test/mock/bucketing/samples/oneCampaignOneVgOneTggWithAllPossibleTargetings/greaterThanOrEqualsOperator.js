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

                    GREATER THAN OR EQUALS - OPERATOR

                  */

                                    // GREATER_THAN_OR_EQUALS - STRING
                                    {
                                        operator: 'GREATER_THAN_OR_EQUALS',
                                        key: 'greaterThanOrEqualsString',
                                        value: 'test'
                                    },
                                    {
                                        // GREATER_THAN_OR_EQUALS - STRING[]
                                        operator: 'GREATER_THAN_OR_EQUALS',
                                        key: 'greaterThanOrEqualsStringArray',
                                        value: ['test1', 'test2', 'test3']
                                    },
                                    {
                                        // GREATER_THAN_OR_EQUALS - NUMBER
                                        operator: 'GREATER_THAN_OR_EQUALS',
                                        key: 'greaterThanOrEqualsNumber',
                                        value: 123
                                    },
                                    {
                                        // GREATER_THAN_OR_EQUALS - NUMBER[]
                                        operator: 'GREATER_THAN_OR_EQUALS',
                                        key: 'greaterThanOrEqualsNumberArray',
                                        value: [1, 2, 3]
                                    },
                                    {
                                        // GREATER_THAN_OR_EQUALS - BOOL
                                        operator: 'GREATER_THAN_OR_EQUALS',
                                        key: 'greaterThanOrEqualsBool',
                                        value: false
                                    },
                                    {
                                        // GREATER_THAN_OR_EQUALS - BOOL[]
                                        operator: 'GREATER_THAN_OR_EQUALS',
                                        key: 'greaterThanOrEqualsBoolArray',
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
