export interface Client {
  id: string;
  name: string;
  lastEdited: string;
  currentVersion: string;
}

export interface BrandGuideline {
  clientId: string;
  version: string;
  foundations: {
    businessName: string;
    tagline: string;
    websiteUrl: string;
    contactPageUrl: string;
    phoneNumbers: string[];
    hoursOfOperation: string;
    brandStory: string;
    mission: string;
    vision: string;
    services: string[];
  };
  personality: {
    traits: string[];
    voiceCharacteristics: string[];
    wordsToUse: string[];
    wordsToAvoid: string[];
  };
  audiences: {
    primary: string[];
    secondary: string[];
  };
  visualIdentity: {
    logos: Logo[];
    colors: ColorSwatch[];
    typography: Typography[];
  };
}

export interface Logo {
  id: string;
  name: string;
  type: 'Primary' | 'Alternate' | 'Icon';
  url: string;
}

export interface ColorSwatch {
  id: string;
  name: string;
  hex: string;
  type: 'Primary' | 'Secondary' | 'Accent';
}

export interface Typography {
  id: string;
  name: string;
  family: string;
  usage: string;
  weights: string[];
}

export interface Version {
  version: string;
  description: string;
  createdAt: string;
}