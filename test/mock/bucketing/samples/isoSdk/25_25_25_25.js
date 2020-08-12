export default {
    campaigns: [
        {
            id: 'bs8qvmo4nlr01fl9aaaa',
            type: 'ab',
            variationGroups: [
                {
                    id: 'bs8qvmo4nlr01fl9bbbb',
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
                            id: 'bs8qvmo4nlr01fl9cccc',
                            modifications: {
                                type: 'JSON',
                                value: {
                                    variation: null
                                }
                            },
                            reference: true
                        },
                        {
                            id: 'bs8qvmo4nlr01fl9dddd',
                            modifications: {
                                type: 'JSON',
                                value: {
                                    variation: 1
                                }
                            },
                            allocation: 25
                        },
                        {
                            id: 'bs8r09g4nlr01c77eeee',
                            modifications: {
                                type: 'JSON',
                                value: {
                                    variation: 2
                                }
                            },
                            allocation: 25
                        },
                        {
                            id: 'bs8r09g4nlr01cdkffff',
                            modifications: {
                                type: 'JSON',
                                value: {
                                    variation: 3
                                }
                            },
                            allocation: 25
                        },
                        {
                            id: 'bs8r09hsbs4011lbgggg',
                            modifications: {
                                type: 'JSON',
                                value: {
                                    variation: 4
                                }
                            },
                            allocation: 25
                        }
                    ]
                }
            ]
        }
    ]
};
