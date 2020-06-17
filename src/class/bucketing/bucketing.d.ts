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
  variations: BucketingVariation[];
};

export type BucketingVariation = {
  id: string;
  modifications: {
    type: string;
    value: { [key: string]: null | string };
  };
  allocation: number;
  reference: boolean;
};

export type BucketingTargetingGroups = {
  targetings: BucketingTargetings[];
};

export type BucketingTargetings = {
  operator: BucketingOperator;
  key: string | 'fs_all_users' | 'fs_users';
  value: BucketingTypes;
};

export type BucketingOperator =
  | 'EQUALS'
  | 'NOT_EQUALS'
  | 'LOWER_THAN'
  | 'LOWER_THAN_OR_EQUALS'
  | 'GREATER_THAN'
  | 'GREATER_THAN_OR_EQUALS'
  | 'STARTS_WITH'
  | 'ENDS_WITH'
  | 'CONTAINS'
  | 'NOT_CONTAINS';

export type BucketingTypes =
  | string
  | string[]
  | number
  | number[]
  | boolean
  | boolean[];
