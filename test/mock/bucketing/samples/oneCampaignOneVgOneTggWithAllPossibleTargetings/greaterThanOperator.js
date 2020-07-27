export default {
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

                    GREATER THAN - OPERATOR

                  */

                  // GREATER_THAN - STRING
                  {
                    operator: 'GREATER_THAN',
                    key: 'greaterThanString',
                    value: 'test',
                  },
                  {
                    // GREATER_THAN - STRING[]
                    operator: 'GREATER_THAN',
                    key: 'greaterThanStringArray',
                    value: ['test1', 'test2', 'test3'],
                  },
                  {
                    // GREATER_THAN - NUMBER
                    operator: 'GREATER_THAN',
                    key: 'greaterThanNumber',
                    value: 123,
                  },
                  {
                    // GREATER_THAN - NUMBER[]
                    operator: 'GREATER_THAN',
                    key: 'greaterThanNumberArray',
                    value: [1, 2, 3],
                  },
                  {
                    // GREATER_THAN - BOOL
                    operator: 'GREATER_THAN',
                    key: 'greaterThanBool',
                    value: false,
                  },
                  {
                    // GREATER_THAN - BOOL[]
                    operator: 'GREATER_THAN',
                    key: 'greaterThanBoolArray',
                    value: [false, false, false],
                  },
                ],
              },
            ],
          },
          variations: [
            {
              id: 'bptggipaqi903f3haq20',
              modifications: {
                type: 'JSON',
                value: {
                  testCache: null,
                },
              },
              allocation: 50,
              reference: true,
            },
            {
              id: 'bptggipaqi903f3haq2g',
              modifications: {
                type: 'JSON',
                value: {
                  testCache: 'value',
                },
              },
              allocation: 50,
            },
          ],
        },
      ],
    },
  ],
  panic: false,
};
