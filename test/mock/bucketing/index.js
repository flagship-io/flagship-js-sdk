import oneCampaignOneVgMultipleTgg from './samples/oneCampaignOneVgMultipleTgg';
import badTypeBetweenTargetingAndVisitorContextKey from './samples/badTypeBetweenTargetingAndVisitorContextKey';
import classical from './samples/classical';
import fs_all_users from './samples/fs_all_users';
import fs_users from './samples/fs_users';
import panic from './samples/panic';
import containsOperator from './samples/oneCampaignOneVgOneTggWithAllPossibleTargetings/containsOperator';
import endsWithOperator from './samples/oneCampaignOneVgOneTggWithAllPossibleTargetings/endsWithOperator';
import equalsOperator from './samples/oneCampaignOneVgOneTggWithAllPossibleTargetings/equalsOperator';
import greaterThanOperator from './samples/oneCampaignOneVgOneTggWithAllPossibleTargetings/greaterThanOperator';
import greaterThanOrEqualsOperator from './samples/oneCampaignOneVgOneTggWithAllPossibleTargetings/greaterThanOrEqualsOperator';
import lowerThanOperator from './samples/oneCampaignOneVgOneTggWithAllPossibleTargetings/lowerThanOperator';
import lowerThanOrEqualsOperator from './samples/oneCampaignOneVgOneTggWithAllPossibleTargetings/lowerThanOrEqualsOperator';
import notContainsOperator from './samples/oneCampaignOneVgOneTggWithAllPossibleTargetings/notContainsOperator';
import notEqualsOperator from './samples/oneCampaignOneVgOneTggWithAllPossibleTargetings/notEqualsOperator';
import startsWithOperator from './samples/oneCampaignOneVgOneTggWithAllPossibleTargetings/startsWithOperator';
import murmurDefaultArgs from './murmur/arguments';
import murmurBadTraffic from './murmur/badTraffic';

export default {
    functions: {
        murmur: {
            defaultArgs: murmurDefaultArgs,
            badTraffic: murmurBadTraffic
        }
    },
    oneCampaignOneVgMultipleTgg,
    badTypeBetweenTargetingAndVisitorContextKey,
    classical,
    fs_all_users,
    fs_users,
    panic,
    containsOperator,
    endsWithOperator,
    equalsOperator,
    greaterThanOperator,
    greaterThanOrEqualsOperator,
    lowerThanOperator,
    lowerThanOrEqualsOperator,
    notContainsOperator,
    notEqualsOperator,
    startsWithOperator
};
