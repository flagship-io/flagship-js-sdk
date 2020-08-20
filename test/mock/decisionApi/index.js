import oneModifInMoreThanOneCampaign from './data/oneModifInMoreThanOneCampaign';
import manyModifInManyCampaigns from './data/manyModifInManyCampaigns';
import noModif from './data/noModif';
import weirdAnswer from './data/weirdAnswer';
import twoCampaignsWithSameId from './data/twoCampaignsWithSameId';
import oneCampaignWithFurtherModifs from './data/oneCampaignWithFurtherModifs';
import oneCampaignOneModif from './data/oneCampaignOneModif';
import oneCampaignOneModifWithAnUpdate from './data/oneCampaignOneModifWithAnUpdate';
import complexJson from './data/complexJson';

export default {
    normalResponse: {
        complexJson,
        oneCampaignOneModif,
        oneCampaignOneModifWithAnUpdate,
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
