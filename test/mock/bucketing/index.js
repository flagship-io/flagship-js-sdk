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
import murmurThreeVariations from './murmur/threeVariations';
import murmurFourVariations from './murmur/fourVariations';
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
            badTraffic: murmurBadTraffic,
            threeVariations: murmurThreeVariations,
            fourVariations: murmurFourVariations,
            allocation: {
                '0': {
                    visitorId: 'jzyplpoe6z3qx0fep',
                    variationGroup: '8um'
                },
                '9': {
                    visitorId: 'mayaa9tovat04vvc',
                    variationGroup: 'jufp'
                },
                '17': {
                    visitorId: 'vsc1rf8xs3bvu0rzs8b',
                    variationGroup: '8'
                },
                '19': {
                    visitorId: 'mjfhr65cz6ctku4',
                    variationGroup: 'ylizk'
                },
                '24': {
                    visitorId: 't786w88snxyg6bc',
                    variationGroup: 'wlcfe'
                },
                '25': {
                    visitorId: 'wiqyggevjlzquyp',
                    variationGroup: 'gof9c'
                },
                '31': {
                    visitorId: 'caktv2pfer82v3',
                    variationGroup: 'qq4k19'
                },
                '39': {
                    visitorId: '4knngzgojeuj851',
                    variationGroup: 'c77ee'
                },
                '49': {
                    visitorId: 'ksahzg4mupmdix',
                    variationGroup: '6xzbz5'
                },
                '59': {
                    visitorId: '8ggalmzqlggx1',
                    variationGroup: 'vgatasd'
                },
                '68': {
                    visitorId: 'l7jaucjpddjdwdbfgg7',
                    variationGroup: '8'
                },
                '69': {
                    visitorId: '9e8h0i1l3l9hfmb',
                    variationGroup: 'bmdz9'
                },
                '79': {
                    visitorId: 'ceua2wiqtqsmkue',
                    variationGroup: '7q34t'
                },
                '89': {
                    visitorId: '392vsut4cnt3lptc58p',
                    variationGroup: '9'
                },
                '99': {
                    visitorId: 'vfrgk91ebwf',
                    variationGroup: 'ktkzyb7z2'
                }
            }
        }
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
