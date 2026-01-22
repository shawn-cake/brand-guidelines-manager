import { Client, BrandGuideline, Version } from '@/app/types';

export const mockClients: Client[] = [
  {
    id: '1',
    name: 'Glow Medspa',
    lastEdited: '2 days ago',
    currentVersion: 'v1.2',
  },
  {
    id: '2',
    name: 'Aesthetic MD',
    lastEdited: '5 days ago',
    currentVersion: 'v2.1',
  },
  {
    id: '3',
    name: 'Smith & Associates Law',
    lastEdited: '1 week ago',
    currentVersion: 'v1.0',
  },
  {
    id: '4',
    name: 'Asheville on Bikes',
    lastEdited: '2 weeks ago',
    currentVersion: 'v3.0',
  },
  {
    id: '5',
    name: 'Radiant Skin Clinic',
    lastEdited: '3 weeks ago',
    currentVersion: 'v1.5',
  },
  {
    id: '6',
    name: 'Family Dental Group',
    lastEdited: '1 month ago',
    currentVersion: 'v2.0',
  },
];

export const mockGuideline: BrandGuideline = {
  clientId: '1',
  version: 'v1.2',
  foundations: {
    businessName: 'Glow Medspa',
    tagline: 'Where science meets beauty',
    websiteUrl: 'https://glowmedspa.com',
    contactPageUrl: 'https://glowmedspa.com/contact',
    phoneNumbers: ['(555) 123-4567'],
    hoursOfOperation: 'Monday - Friday: 9:00 AM - 6:00 PM\nSaturday: 10:00 AM - 4:00 PM\nSunday: Closed',
    brandStory: 'Founded in 2015, Glow Medspa has been at the forefront of aesthetic medicine...',
    mission: 'To empower individuals through evidence-based aesthetic treatments...',
    vision: 'To be the most trusted name in medical aesthetics...',
    services: ['Botox & Fillers', 'Laser Treatments', 'Chemical Peels', 'Microneedling'],
  },
  personality: {
    traits: ['Professional', 'Approachable', 'Innovative', 'Trustworthy'],
    voiceCharacteristics: ['Warm', 'Confident', 'Educational', 'Empowering'],
    wordsToUse: ['Transform', 'Radiant', 'Evidence-based', 'Personalized', 'Natural'],
    wordsToAvoid: ['Cheap', 'Quick fix', 'Miracle', 'Anti-aging'],
  },
  audiences: {
    primary: ['Women 35-55', 'Health-conscious professionals', 'Beauty enthusiasts'],
    secondary: ['Men interested in aesthetics', 'Wedding parties', 'Special event attendees'],
  },
  visualIdentity: {
    logos: [
      {
        id: '1',
        name: 'Primary Logo',
        type: 'Primary',
        url: '/logos/primary.svg',
      },
      {
        id: '2',
        name: 'White Version',
        type: 'Alternate',
        url: '/logos/white.svg',
      },
      {
        id: '3',
        name: 'Icon',
        type: 'Icon',
        url: '/logos/icon.svg',
      },
    ],
    colors: [
      { id: '1', name: 'Ocean Blue', hex: '#4074A8', type: 'Primary' },
      { id: '2', name: 'Golden Hour', hex: '#F2A918', type: 'Primary' },
      { id: '3', name: 'Pure White', hex: '#FFFFFF', type: 'Secondary' },
      { id: '4', name: 'Charcoal', hex: '#1F2937', type: 'Secondary' },
      { id: '5', name: 'Soft Cream', hex: '#F9FAFB', type: 'Accent' },
    ],
    typography: [
      {
        id: '1',
        name: 'Inter',
        family: 'Inter',
        usage: 'Primary font for all body text and headings',
        weights: ['400', '500', '600'],
      },
    ],
  },
};

export const mockVersions: Version[] = [
  {
    version: 'v1.2',
    description: 'Added new provider Dr. Thompson',
    createdAt: 'Jan 15, 2026',
  },
  {
    version: 'v1.1',
    description: 'Updated color palette per client feedback',
    createdAt: 'Dec 20, 2025',
  },
  {
    version: 'v1.0',
    description: 'Initial brand guidelines',
    createdAt: 'Nov 10, 2025',
  },
];