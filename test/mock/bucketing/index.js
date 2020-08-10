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
import murmurLowTraffic from './murmur/badTraffic';
import murmurBadTraffic from './murmur/badTraffic2';
import murmurExtremLowTraffic from './murmur/extremLowTraffic';
import multipleCampaigns from './samples/multipleCampaigns';
import badOperator from './samples/badOperator';
import oneCampaignWithBadTraffic from './samples/badTraffic';
import oneCampaignWith100PercentAllocation from './samples/oneCampaignWith100PercentAllocation';

export default {
    functions: {
        murmur: {
            defaultArgs: murmurDefaultArgs,
            lowTraffic: murmurLowTraffic,
            extremLowTraffic: murmurExtremLowTraffic,
            badTraffic: murmurBadTraffic
        }
    },
    headers: {
        lastModified: ['Wed, 18 Mar 2020 23:29:16 GMT']
    },
    oneCampaignWithBadTraffic,
    oneCampaignWith100PercentAllocation,
    multipleCampaigns,
    oneCampaignOneVgMultipleTgg,
    badTypeBetweenTargetingAndVisitorContextKey,
    classical,
    badOperator,
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
