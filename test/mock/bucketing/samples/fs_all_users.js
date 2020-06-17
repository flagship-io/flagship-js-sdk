/*

  USE CASE:
   # test any type of 'value'

*/

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
                  {
                    operator: 'EQUALS',
                    key: 'fs_all_users',
                    value: '',
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
    {
      id: 'bq4sf09oet0006cfihd0',
      type: 'ab',
      variationGroups: [
        {
          id: 'bq4sf09oet0006cfihe0',
          targeting: {
            targetingGroups: [
              {
                targetings: [
                  {
                    operator: 'EQUALS',
                    key: 'fs_all_users',
                    value: '',
                  },
                ],
              },
            ],
          },
          variations: [
            {
              id: 'bq4sf09oet0006cfiheg',
              modifications: {
                type: 'JSON',
                value: {
                  'btn-color': 'red',
                  'btn-text': 'Buy now !',
                  'txt-color': '#fff',
                },
              },
              allocation: 50,
              reference: true,
            },
            {
              id: 'bq4sf09oet0006cfihf0',
              modifications: {
                type: 'JSON',
                value: {
                  'btn-color': 'green',
                  'btn-text': 'Buy now with discount !',
                  'txt-color': '#A3A3A3',
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
