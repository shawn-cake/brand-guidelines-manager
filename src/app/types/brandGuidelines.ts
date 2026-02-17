/**
 * TypeScript interfaces for Brand Guidelines data.
 * These match the Convex schema validators in convex/schema.ts
 */

// ============================================================================
// Asset Types
// ============================================================================

export interface Asset {
  type?: 'upload' | 'url';
  file_id?: string;
  url?: string;
  filename?: string;
  alt_text?: string;
  uploaded_at?: number;
}

// ============================================================================
// Foundations Types
// ============================================================================

export interface PhysicalAddress {
  label?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
}

export interface SocialMediaHandles {
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  tiktok?: string;
  youtube?: string;
  twitter?: string;
}

export interface OtherMedia {
  type?: string;
  name?: string;
  url?: string;
}

export interface GeneralBusinessInformation {
  business_name?: string;
  tagline?: string;
  website_url?: string;
  contact_page_url?: string;
  phone_numbers?: string[];
  physical_addresses?: PhysicalAddress[];
  hours_of_operation?: string;
  social_media_handles?: SocialMediaHandles;
  other_media?: OtherMedia[];
}

export interface BrandIdentity {
  mission_statement?: string;
  vision_statement?: string;
  core_values?: string[];
  brand_story?: string;
  unique_value_proposition?: string;
  differentiators?: string[];
}

export interface Service {
  name?: string;
  page_url?: string;
}

export interface KeyServiceToPromote {
  service_name?: string;
  key_messaging_points?: string[];
}

export interface Provider {
  name?: string;
  credentials?: string;
  bio?: string;
  services_offered?: string[];
  headshot?: Asset;
}

export interface ServicesAndProviders {
  services?: Service[];
  key_services_to_promote?: KeyServiceToPromote[];
  providers?: Provider[];
}

export interface Foundations {
  general_business_information: GeneralBusinessInformation;
  brand_identity: BrandIdentity;
  services_and_providers: ServicesAndProviders;
}

// ============================================================================
// Personality & Tone Types
// ============================================================================

export interface BrandArchetype {
  primary?: string;
  secondary?: string;
}

export interface ToneVariationsByContext {
  website_copy?: string;
  social_media?: string;
  advertising?: string;
  email_marketing?: string;
  client_to_patient_communication?: string;
  agency_to_client_communications?: string;
}

export interface PreferredTerminology {
  use?: string;
  instead_of?: string;
}

export interface LanguageGuidelines {
  preferred_terminology?: PreferredTerminology[];
  words_to_avoid?: string[];
  industry_specific_language?: string[];
}

export interface PersonalityAndTone {
  brand_personality_traits?: string[];
  brand_archetype?: BrandArchetype;
  voice_characteristics?: string[];
  tone_variations_by_context?: ToneVariationsByContext;
  language_guidelines?: LanguageGuidelines;
  inclusive_language_standards?: string[];
}

// ============================================================================
// Target Audiences Types
// ============================================================================

export interface Demographics {
  age_range?: string;
  gender?: string;
  income?: string;
  location?: string;
  other?: string[];
}

export interface PrimaryAudience {
  demographics?: Demographics;
  psychographics?: string[];
  pain_points?: string[];
  goals_and_motivations?: string[];
}

export interface SecondaryAudience {
  name?: string;
  demographics?: Demographics;
  psychographics?: string[];
  pain_points?: string[];
  goals_and_motivations?: string[];
}

export interface CustomerPersona {
  name?: string;
  age?: string;
  occupation?: string;
  background?: string;
  goals?: string[];
  pain_points?: string[];
  how_we_reach_them?: string;
  image?: Asset;
}

export interface JourneyStage {
  touchpoints?: string[];
  thoughts_feelings?: string;
}

export interface PatientClientJourney {
  awareness?: JourneyStage;
  consideration?: JourneyStage;
  decision?: JourneyStage;
  experience?: JourneyStage;
  loyalty?: JourneyStage;
}

export interface TargetAudiences {
  primary_audience?: PrimaryAudience;
  secondary_audiences?: SecondaryAudience[];
  customer_personas?: CustomerPersona[];
  patient_client_journey?: PatientClientJourney;
}

// ============================================================================
// Visual Identity Types
// ============================================================================

export interface ColorSwatch {
  name?: string;
  hex?: string;
  rgb?: string;
  cmyk?: string;
  pantone?: string;
}

export interface LogoLockup {
  name?: string;
  type?: 'primary' | 'alternate';
  description?: string;
  asset?: Asset;
}

export interface LogoPart {
  description?: string;
  asset?: Asset;
}

export interface LogoParts {
  logomark?: LogoPart;
  wordmark?: LogoPart;
}

export interface MinimumSizeRequirements {
  print?: string;
  digital?: string;
}

export interface Logo {
  logo_lockups?: LogoLockup[];
  logo_parts?: LogoParts;
  minimum_size_requirements?: MinimumSizeRequirements;
  clear_space_requirements?: string;
  unacceptable_usage?: string[];
}

export interface Gradient {
  name?: string;
  type?: 'linear' | 'radial';
  colors?: string[];
  css?: string;
}

export interface ColorAccessibility {
  body_text_contrast_ratio?: string;
  large_text_contrast_ratio?: string;
  notes?: string;
}

export interface ColorPalette {
  primary?: ColorSwatch[];
  secondary?: ColorSwatch[];
  tertiary?: ColorSwatch[];
  gray?: ColorSwatch[];
}

export interface Color {
  palette?: ColorPalette;
  gradients?: Gradient[];
  color_schemes?: string[];
  accessibility?: ColorAccessibility;
}

export interface Typeface {
  name?: string;
  weights?: string[];
  usage?: string;
  source_url?: string;
}

export interface WebSafeFallbacks {
  serif?: string;
  sans_serif?: string;
}

export interface TypographyHierarchy {
  h1?: string;
  h2?: string;
  h3?: string;
  h4?: string;
  body?: string;
  caption?: string;
}

export interface TypographyAccessibility {
  minimum_body_size?: string;
  line_height?: string;
  notes?: string;
}

export interface Typography {
  primary_typeface?: Typeface;
  secondary_typeface?: Typeface;
  web_safe_fallbacks?: WebSafeFallbacks;
  hierarchy?: TypographyHierarchy;
  accessibility?: TypographyAccessibility;
}

export interface PhotographyAndImagery {
  style_guidelines?: string[];
  subject_matter?: string[];
  image_treatment_and_filters?: string[];
  stock_photography_guidelines?: string[];
  alt_text_guidelines?: string[];
  sample_images?: Asset[];
}

export interface IconStyle {
  style?: string;
  usage?: string;
  samples?: Asset[];
}

export interface PatternOrTexture {
  description?: string;
  usage?: string;
  samples?: Asset[];
}

export interface IllustrationStyle {
  style?: string;
  usage?: string;
  samples?: Asset[];
}

export interface GraphicElements {
  icons?: IconStyle;
  patterns?: PatternOrTexture;
  textures?: PatternOrTexture;
  illustrations?: IllustrationStyle;
}

export interface StylesAndEffects {
  corner_radius?: string;
  drop_shadows?: string;
  other?: string[];
}

export interface WebsiteElements {
  page_layout_and_grid?: string;
  styles_and_effects?: StylesAndEffects;
}

export interface SocialMediaTemplate {
  specs?: string;
  template?: Asset;
}

export interface SocialMediaTemplates {
  instagram_post?: SocialMediaTemplate;
  instagram_story?: SocialMediaTemplate;
  facebook_cover?: SocialMediaTemplate;
  linkedin_banner?: SocialMediaTemplate;
  other?: Array<{
    name?: string;
    specs?: string;
    template?: Asset;
  }>;
}

export interface EmailSignature {
  format?: string;
  template?: Asset;
}

export interface DigitalAdvertisingSpecs {
  google_display?: string[];
  meta?: string[];
  other?: string[];
}

export interface DigitalApplications {
  website_elements?: WebsiteElements;
  social_media_templates?: SocialMediaTemplates;
  email_signature?: EmailSignature;
  digital_advertising_specs?: DigitalAdvertisingSpecs;
}

export interface BusinessCards {
  size?: string;
  orientation?: string;
  notes?: string;
  template?: Asset;
}

export interface Letterhead {
  size?: string;
  layout?: string;
  notes?: string;
  template?: Asset;
}

export interface Envelopes {
  type?: string;
  notes?: string;
  template?: Asset;
}

export interface BrochuresAndCollateral {
  formats?: string[];
  notes?: string;
  samples?: Asset[];
}

export interface PrintAdvertising {
  common_sizes?: string[];
  notes?: string;
  samples?: Asset[];
}

export interface PrintApplications {
  business_cards?: BusinessCards;
  letterhead?: Letterhead;
  envelopes?: Envelopes;
  brochures_and_collateral?: BrochuresAndCollateral;
  print_advertising?: PrintAdvertising;
}

export interface VisualIdentity {
  logo?: Logo;
  color?: Color;
  typography?: Typography;
  photography_and_imagery?: PhotographyAndImagery;
  graphic_elements?: GraphicElements;
  digital_applications?: DigitalApplications;
  print_applications?: PrintApplications;
}

// ============================================================================
// Complete Client Data Type
// ============================================================================

export interface ClientData {
  foundations: Foundations;
  personality_and_tone: PersonalityAndTone;
  target_audiences: TargetAudiences;
  visual_identity: VisualIdentity;
}

// ============================================================================
// Document (includes Convex metadata)
// ============================================================================

export interface Client {
  _id: string;
  _creationTime: number;
  client_name: string;
  industry?: string;
  current_version?: string;
  created_at: number;
  updated_at: number;
  created_by?: string;
  updated_by?: string;
  data: ClientData;
}

export interface Version {
  _id: string;
  _creationTime: number;
  client_id: string;
  version_number: string;
  version_name?: string;
  description?: string;
  created_at: number;
  created_by?: string;
  data: ClientData;
}
