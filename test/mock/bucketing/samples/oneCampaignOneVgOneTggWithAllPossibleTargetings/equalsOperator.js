export default {
    lastModifiedDate: 'Wed, 18 Mar 2020 23:29:16 GMT',
    campaigns: [
        {
            id: 'bptggipaqigggf3haq0g',
            type: 'ab',
            variationGroups: [
                {
                    id: 'bptggipaqi903f3haq1g',
                    targeting: {
                        targetingGroups: [
                            {
                                targetings: [
                                    /*

                    EQUALS - OPERATOR

                  */

                                    // EQUALS - STRING
                                    {
                                        operator: 'EQUALS',
                                        key: 'equalsString',
                                        value: 'test'
                                    },
                                    {
                                        // EQUALS - STRING[]
                                        operator: 'EQUALS',
                                        key: 'equalsStringArray',
                                        value: ['test1', 'test2', 'test3']
                                    },
                                    {
                                        // EQUALS - NUMBER
                                        operator: 'EQUALS',
                                        key: 'equalsNumber',
                                        value: 123
                                    },
                                    {
                                        // EQUALS - NUMBER[]
                                        operator: 'EQUALS',
                                        key: 'equalsNumberArray',
                                        value: [1, 2, 3]
                                    },
                                    {
                                        // EQUALS - BOOL
                                        operator: 'EQUALS',
                                        key: 'equalsBool',
                                        value: false
                                    },
                                    {
                                        // EQUALS - BOOL[]
                                        operator: 'EQUALS',
                                        key: 'equalsBoolArray',
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
