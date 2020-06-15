
export type BucketingApiResponse = {
    campaigns: BucketingCampaign[];
    panic: boolean;
  };

export type BucketingCampaign = {
    id: string;
    type: string;
    variationGroups: BucketingVariationGroups[];
  };

export type BucketingVariationGroups = {
    id: string;
    targeting: {
      targetingGroups: BucketingTargetingGroups[];
    };
    variations: BucketingVariations[];
  };

export type BucketingVariations = {
    id: string;
    modifications: {
      type: string;
      value: {[key: string]: null | string };
      allocation: number;
      reference?: boolean;
    };
  };

export type BucketingTargetingGroups = {
    targetings: BucketingTargetings[];
  };

export type BucketingTargetings = {
    operator: string;
    key: string;
    value: string;
  };
