export default {
    lastModifiedDate: 'Wed, 18 Mar 2020 23:29:16 GMT',
    campaigns: [
        {
            id: 'bqtvkps9h7j02m34fj2g',
            type: 'ab',
            variationGroups: [
                {
                    id: 'bqtvkps9h7j02m34fj3g',
                    targeting: {
                        targetingGroups: [
                            {
                                targetings: [
                                    {
                                        operator: 'EQUALS',
                                        key: 'fs_all_users',
                                        value: ''
                                    }
                                ]
                            }
                        ]
                    },
                    variations: [
                        {
                            id: 'bqtvkps9h7j02m34fj40',
                            modifications: {
                                type: 'JSON',
                                value: {
                                    Buttoncolor: null
                                }
                            },
                            reference: true
                        },
                        {
                            id: 'bqtvkps9h7j02m34fj4g',
                            modifications: {
                                type: 'JSON',
                                value: {
                                    Buttoncolor: 'Blue'
                                }
                            },
                            allocation: 100
                        }
                    ]
                }
            ]
        }
    ]
};
