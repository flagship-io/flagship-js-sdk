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
import isoSdk_50_50 from './samples/isoSdk/50_50';
import isoSdk_25_25_25_25 from './samples/isoSdk/25_25_25_25';

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
                    variationGroup: 'jzyplpoe6z3qx0fep',
                    visitorId: '8um'
                },
                '9': {
                    variationGroup: 'mayaa9tovat04vvc',
                    visitorId: 'jufp'
                },
                '17': {
                    variationGroup: 'vsc1rf8xs3bvu0rzs8b',
                    visitorId: '8'
                },
                '19': {
                    variationGroup: 'mjfhr65cz6ctku4',
                    visitorId: 'ylizk'
                },
                '24': {
                    variationGroup: 't786w88snxyg6bc',
                    visitorId: 'wlcfe'
                },
                '25': {
                    variationGroup: 'wiqyggevjlzquyp',
                    visitorId: 'gof9c'
                },
                '31': {
                    variationGroup: 'caktv2pfer82v3',
                    visitorId: 'qq4k19'
                },
                '39': {
                    variationGroup: '4knngzgojeuj851',
                    visitorId: 'c77ee'
                },
                '49': {
                    variationGroup: 'ksahzg4mupmdix',
                    visitorId: '6xzbz5'
                },
                '59': {
                    variationGroup: '8ggalmzqlggx1',
                    visitorId: 'vgatasd'
                },
                '68': {
                    variationGroup: 'l7jaucjpddjdwdbfgg7',
                    visitorId: '8'
                },
                '69': {
                    variationGroup: '9e8h0i1l3l9hfmb',
                    visitorId: 'bmdz9'
                },
                '79': {
                    variationGroup: 'ceua2wiqtqsmkue',
                    visitorId: '7q34t'
                },
                '89': {
                    variationGroup: '392vsut4cnt3lptc58p',
                    visitorId: '9'
                },
                '99': {
                    variationGroup: 'vfrgk91ebwf',
                    visitorId: 'ktkzyb7z2'
                }
            }
        }
    },
    isoSdk_50_50,
    isoSdk_25_25_25_25,
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
