import utilsHelper from './utils';

describe('Utils helper', () => {
    it('should work', () => {
        expect(utilsHelper.deepCompare({ a: 1 }, { b: 1 })).toEqual(false);
        expect(utilsHelper.deepCompare({ a: 1 }, { a: 1 })).toEqual(true);

        expect(utilsHelper.deepCompare({ a: { b: 1 } }, { a: { b: 2 } })).toEqual(false);
        expect(utilsHelper.deepCompare({ a: { b: 1 } }, { a: { b: 1 } })).toEqual(true);

        expect(utilsHelper.deepCompare({ a: { b: 1 } }, { a: 1, b: 2 })).toEqual(false);
    });
});
