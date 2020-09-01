/*

  USE CASE:
   # full truthy
   # full falsy
   # mixed

*/

export default {
    lastModifiedDate: 'Wed, 18 Mar 2020 23:29:16 GMT',
    campaigns: [
        {
            id: 'bptiiipaqi903f3haq0g',
            type: 'ab',
            variationGroups: [
                {
                    id: 'bptggipaqi903f3haq1g',
                    targeting: {
                        targetingGroups: [
                            {
                                targetings: [
                                    {
                                        operator: 'EQUALS',
                                        key: 'foo1',
                                        value: 'yes1'
                                    }
                                ]
                            },
                            {
                                targetings: [
                                    {
                                        operator: 'EQUALS',
                                        key: 'foo2',
                                        value: 'yes2'
                                    }
                                ]
                            },
                            {
                                targetings: [
                                    {
                                        operator: 'EQUALS',
                                        key: 'foo3',
                                        value: 'yes3'
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
