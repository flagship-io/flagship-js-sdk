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

                    NOT EQUALS - OPERATOR

                  */

                                    // NOT_EQUALS - STRING
                                    {
                                        operator: 'NOT_EQUALS',
                                        key: 'notEqualsString',
                                        value: 'test'
                                    },
                                    {
                                        // NOT_EQUALS - STRING[]
                                        operator: 'NOT_EQUALS',
                                        key: 'notEqualsStringArray',
                                        value: ['test1', 'test2', 'test3']
                                    },
                                    {
                                        // NOT_EQUALS - NUMBER
                                        operator: 'NOT_EQUALS',
                                        key: 'notEqualsNumber',
                                        value: 123
                                    },
                                    {
                                        // NOT_EQUALS - NUMBER[]
                                        operator: 'NOT_EQUALS',
                                        key: 'notEqualsNumberArray',
                                        value: [1, 2, 3]
                                    },
                                    {
                                        // NOT_EQUALS - BOOL
                                        operator: 'NOT_EQUALS',
                                        key: 'notEqualsBool',
                                        value: false
                                    },
                                    {
                                        // NOT_EQUALS - BOOL[]
                                        operator: 'NOT_EQUALS',
                                        key: 'notEqualsBoolArray',
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
