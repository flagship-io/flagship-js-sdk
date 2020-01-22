export type FlagshipVisitorContext = {
    [key: string]: boolean | number | string | Array<boolean | number | string>;
}

export type FsModifsRequestedList = Array<{
    key: string;
    defaultValue: string | boolean | number;
    activate?: boolean;
}>;

export type DecisionApiResponse = {
    data: DecisionApiResponseData;
    status: number;
}

export type DecisionApiResponseData = {
    visitorId: string;
    campaigns: DecisionApiCampaign[ ];
}

export type GetModificationsOutput = {
    [key: string]: any;
}

export type checkCampaignsActivatedMultipleTimesOutput = {
    activateCampaign: { [key: string]: { directActivate: Array<string>; indirectActivate: Array<string> } };
    activateKey: { [key: string]: number};
}

export type DecisionApiResponseDataSimpleComputed = {
  [key: string]: any;
};

export type DecisionApiCampaign = {
  id: string;
  variationGroupId: string;
  variation: {
    id: string;
    modifications: {
      type: string;
      value: {
        [key: string]: any;
      };
    };
  };
};

export type DecisionApiResponseDataFullComputed = {
    [key: string]: {
        value: Array<string>;
        type: Array<string>;
        campaignId: Array<string>;
        variationId: Array<string>;
        variationGroupId: Array<string>;
        isRequested: boolean;
        isActivateNeeded: boolean;
    };
}

export type HitShape = { type: 'Screen'; data: ScreenHit }
| { type: 'Transaction'; data: TransactionHit }
| { type: 'Item'; data: ItemHit }
| { type: 'Event'; data: EventHit };

export type TransactionHit = CommonHit & {
    transactionId: string;
    affiliation: string;
    totalRevenue?: number;
    shippingCost?: number;
    shippingMethod?: string;
    taxes?: number;
    currency?: string;
    paymentMethod?: string;
    itemCount?: number;
    couponCode?: string;
    documentLocation?: string;
    pageTitle?: string;
}

export type ItemHit = CommonHit & {
    transactionId: string;
    name: string;
    price?: number;
    code?: string;
    category?: string;
    quantity?: number;
    documentLocation?: string;
    pageTitle?: string;
}

export type EventHit = CommonHit & {
    category: 'Action Tracking' | 'User Engagement';
    action: string;
    label?: string;
    value?: number;
    documentLocation?: string;
    pageTitle?: string;
}

export type ScreenHit = CommonHit & {
    documentLocation: string;
    pageTitle: string;
}

export type CommonHit = {
    protocolVersion?: string;
    userIp?: string;
    documentReferrer?: string;
    viewportSize?: string;
    screenResolution?: string;
    documentEncoding?: string;
    screenColorDepth?: string;
    userLanguage?: string;
    javaEnabled?: string;
    flashVersion?: string;
    queueTime?: string;
    currentSessionTimeStamp?: string;
    sessionNumber?: string;
}
