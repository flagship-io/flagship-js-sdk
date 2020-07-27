import decisionApi from './decisionApi';
import flagshipVisitor from './flagshipVisitor';
import event from './hit/event';
import item from './hit/item';
import page from './hit/page';
import screen from './hit/screen';
import transaction from './hit/transaction';
import bucketing from './bucketing';

const demoData = {
    bucketing,
    envId: ['bn1ab7m56qolupi5sa0g'],
    visitor: {
        id: ['test-perf', 'toto'],
        cleanContext: {
            pos: 'es'
        },
        contextWithUselessAttributes: {
            pos: 'es',
            uselessAttribute: false
        },
        contextWithObjectAttributes: {
            pos: 'es',
            badAttribute: { awesome: 'object' }
        },
        contextWithBadArrayAttributes: {
            pos: 'es',
            badAttribute: [false, { awesome: 'object' }]
        },
        contextWithGoodArrayAttributes: {
            pos: 'es',
            badAttribute: [false, 'awesome', 123]
        },
        contextBucketingOperatorTestSuccess: {
            // ENDS_WITH OPERATOR
            endsWithString: 'helloWorldteSt',
            endsWithStringArray: 'helloWorldteSt1',
            endsWithNumber: 1111123,
            endsWithNumberArray: 99999991,
            endsWithBool: false,
            endsWithBoolArray: false,
            // EQUALS OPERATOR
            equalsString: 'test',
            equalsStringArray: 'test1',
            equalsNumber: 123,
            equalsNumberArray: 1,
            equalsBool: false,
            equalsBoolArray: false,
            // GREATER_THAN OPERATOR
            greaterThanString: 'zzzz',
            greaterThanStringArray: 'zzz',
            greaterThanNumber: 999,
            greaterThanNumberArray: 9,
            greaterThanBool: false,
            greaterThanBoolArray: false,
            // GREATER_THAN_OR_EQUALS OPERATOR
            greaterThanOrEqualsString: 'test',
            greaterThanOrEqualsStringArray: 'test1',
            greaterThanOrEqualsNumber: 123,
            greaterThanOrEqualsNumberArray: 1,
            greaterThanOrEqualsBool: false,
            greaterThanOrEqualsBoolArray: false,
            // LOWER_THAN OPERATOR
            lowerThanString: 'aaaaa',
            lowerThanStringArray: 'aaaaa',
            lowerThanNumber: 0,
            lowerThanNumberArray: 0,
            lowerThanBool: false,
            lowerThanBoolArray: false,
            // LOWER_THAN_OR_EQUALS OPERATOR
            lowerThanOrEqualsString: 'test',
            lowerThanOrEqualsStringArray: 'test1',
            lowerThanOrEqualsNumber: 123,
            lowerThanOrEqualsNumberArray: 1,
            lowerThanOrEqualsBool: false,
            lowerThanOrEqualsBoolArray: false,
            // NOT_CONTAINS OPERATOR
            notContainsString: 'teeestttt',
            notContainsStringArray: 'teeeestttt1',
            notContainsNumber: 124343433,
            notContainsNumberArray: 124343433,
            notContainsBool: false,
            notContainsBoolArray: false,
            // NOT_CONTAINS OPERATOR
            notEqualsString: 'testttt',
            notEqualsStringArray: 'testttt1',
            notEqualsNumber: 124343433,
            notEqualsNumberArray: 124343433,
            notEqualsBool: true,
            notEqualsBoolArray: true,
            // STARTS_WITH OPERATOR
            startsWithString: 'testaaaaaaaaa',
            startsWithStringArray: 'test1aaaaaaaaaaa',
            startsWithNumber: 123444444444444444,
            startsWithNumberArray: 1444444444,
            startsWithBool: false,
            startsWithBoolArray: false,
            // CONTAINS OPERATOR
            containsString: 'aaaaatestaaaaa',
            containsStringArray: 'aaaaaaaaaatest1aaaaaa',
            containsNumber: 2,
            containsNumberArray: 1,
            containsBool: false,
            containsBoolArray: false
        }
    },
    decisionApi,
    flagshipVisitor,
    hit: {
        event,
        item,
        page,
        screen,
        transaction
    }
};
export default demoData;
