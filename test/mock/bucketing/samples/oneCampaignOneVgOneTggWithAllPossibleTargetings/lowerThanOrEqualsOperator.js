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

                    LOWER THAN OR EQUALS - OPERATOR

                  */

                                    // LOWER_THAN_OR_EQUALS - STRING
                                    {
                                        operator: 'LOWER_THAN_OR_EQUALS',
                                        key: 'lowerThanOrEqualsString',
                                        value: 'test'
                                    },
                                    {
                                        // LOWER_THAN_OR_EQUALS - STRING[]
                                        operator: 'LOWER_THAN_OR_EQUALS',
                                        key: 'lowerThanOrEqualsStringArray',
                                        value: ['test1', 'test2', 'test3']
                                    },
                                    {
                                        // LOWER_THAN_OR_EQUALS - NUMBER
                                        operator: 'LOWER_THAN_OR_EQUALS',
                                        key: 'lowerThanOrEqualsNumber',
                                        value: 123
                                    },
                                    {
                                        // LOWER_THAN_OR_EQUALS - NUMBER[]
                                        operator: 'LOWER_THAN_OR_EQUALS',
                                        key: 'lowerThanOrEqualsNumberArray',
                                        value: [1, 2, 3]
                                    },
                                    {
                                        // LOWER_THAN_OR_EQUALS - BOOL
                                        operator: 'LOWER_THAN_OR_EQUALS',
                                        key: 'lowerThanOrEqualsBool',
                                        value: false
                                    },
                                    {
                                        // LOWER_THAN_OR_EQUALS - BOOL[]
                                        operator: 'LOWER_THAN_OR_EQUALS',
                                        key: 'lowerThanOrEqualsBoolArray',
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
