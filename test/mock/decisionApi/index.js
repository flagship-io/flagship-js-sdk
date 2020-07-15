import oneModifInMoreThanOneCampaign from './data/oneModifInMoreThanOneCampaign';
import manyModifInManyCampaigns from './data/manyModifInManyCampaigns';
import noModif from './data/noModif';
import weirdAnswer from './data/weirdAnswer';
import twoCampaignsWithSameId from './data/twoCampaignsWithSameId';
import oneCampaignWithFurtherModifs from './data/oneCampaignWithFurtherModifs';

export default {
    normalResponse: {
        oneModifInMoreThanOneCampaign,
        oneCampaignWithFurtherModifs,
        manyModifInManyCampaigns,
        noModif
    },
    badResponse: {
        twoCampaignsWithSameId,
        weirdAnswer
    }
};
