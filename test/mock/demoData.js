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
    apiKey: ['jbgzeougezjlvniqjipzrejgoiezjoij'],
    api: {
        v1: 'https://decision-api.flagship.io/v1/',
        v2: 'https://decision.flagship.io/v2/'
    },
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
            // NOT_EQUALS OPERATOR
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
        },
        contextBucketingOperatorTestFail: {
            // ENDS_WITH OPERATOR
            endsWithString: 'helloWorld',
            endsWithStringArray: 'helloWorld',
            endsWithNumber: 1111,
            endsWithNumberArray: 9999,
            endsWithBool: true,
            endsWithBoolArray: true,
            // EQUALS OPERATOR
            equalsString: 'fail',
            equalsStringArray: 'fail',
            equalsNumber: 9,
            equalsNumberArray: 9,
            equalsBool: true,
            equalsBoolArray: true,
            // GREATER_THAN OPERATOR
            greaterThanString: 'aaaa',
            greaterThanStringArray: 'aaaa',
            greaterThanNumber: 123,
            greaterThanNumberArray: 1,
            greaterThanBool: true,
            greaterThanBoolArray: true,
            // GREATER_THAN_OR_EQUALS OPERATOR
            greaterThanOrEqualsString: 'fail',
            greaterThanOrEqualsStringArray: 'fail',
            greaterThanOrEqualsNumber: 0,
            greaterThanOrEqualsNumberArray: 0,
            greaterThanOrEqualsBool: true,
            greaterThanOrEqualsBoolArray: true,
            // LOWER_THAN OPERATOR
            lowerThanString: 'zzzz',
            lowerThanStringArray: 'zzzz',
            lowerThanNumber: 123,
            lowerThanNumberArray: 3,
            lowerThanBool: true,
            lowerThanBoolArray: true,
            // LOWER_THAN_OR_EQUALS OPERATOR
            lowerThanOrEqualsString: 'tist',
            lowerThanOrEqualsStringArray: 'test4',
            lowerThanOrEqualsNumber: 999,
            lowerThanOrEqualsNumberArray: 9,
            lowerThanOrEqualsBool: true,
            lowerThanOrEqualsBoolArray: true,
            // NOT_CONTAINS OPERATOR
            notContainsString: 'test',
            notContainsStringArray: 'test1',
            notContainsNumber: 123,
            notContainsNumberArray: 1,
            notContainsBool: true,
            notContainsBoolArray: true,
            // NOT_EQUALS OPERATOR
            notEqualsString: 'test',
            notEqualsStringArray: 'test1',
            notEqualsNumber: 123,
            notEqualsNumberArray: 1,
            notEqualsBool: false,
            notEqualsBoolArray: false,
            // STARTS_WITH OPERATOR
            startsWithString: 'fail',
            startsWithStringArray: 'fail',
            startsWithNumber: 4444,
            startsWithNumberArray: 4444,
            startsWithBool: true,
            startsWithBoolArray: true,
            // CONTAINS OPERATOR
            containsString: 'aaaa',
            containsStringArray: 'test4',
            containsNumber: 999,
            containsNumberArray: 1,
            containsBool: true,
            containsBoolArray: true
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
