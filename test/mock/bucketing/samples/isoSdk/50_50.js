export default {
    campaigns: [
        {
            id: 'bs8r119sbs4016mehhhh',
            type: 'ab',
            variationGroups: [
                {
                    id: 'bs8r119sbs4016meiiii',
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
                            id: 'bs8r119sbs4016mejjjj',
                            modifications: {
                                type: 'JSON',
                                value: {
                                    variation50: null
                                }
                            },
                            reference: true
                        },
                        {
                            id: 'bs8r119sbs4016mekkkk',
                            modifications: {
                                type: 'JSON',
                                value: {
                                    variation50: 1
                                }
                            },
                            allocation: 50
                        },
                        {
                            id: 'bs8r119sbs4016mellll',
                            modifications: {
                                type: 'JSON',
                                value: {
                                    variation50: 2
                                }
                            },
                            allocation: 50
                        }
                    ]
                }
            ]
        }
    ]
};
