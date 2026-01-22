import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get all clients (for sidebar list)
export const list = query({
  args: {},
  handler: async (ctx) => {
    const clients = await ctx.db.query("clients").collect();
    return clients.map((client) => ({
      _id: client._id,
      client_name: client.client_name,
      industry: client.industry,
      current_version: client.current_version,
      updated_at: client.updated_at,
    }));
  },
});

// Get all clients sorted by name (A-Z)
export const listByName = query({
  args: {},
  handler: async (ctx) => {
    const clients = await ctx.db
      .query("clients")
      .withIndex("by_name")
      .collect();
    return clients.map((client) => ({
      _id: client._id,
      client_name: client.client_name,
      industry: client.industry,
      current_version: client.current_version,
      updated_at: client.updated_at,
    }));
  },
});

// Get all clients sorted by date edited (most recent first)
export const listByDate = query({
  args: {},
  handler: async (ctx) => {
    const clients = await ctx.db
      .query("clients")
      .withIndex("by_updated")
      .order("desc")
      .collect();
    return clients.map((client) => ({
      _id: client._id,
      client_name: client.client_name,
      industry: client.industry,
      current_version: client.current_version,
      updated_at: client.updated_at,
    }));
  },
});

// Get a single client by ID (full data for editing)
export const get = query({
  args: { id: v.id("clients") },
  handler: async (ctx, args) => {
    const client = await ctx.db.get(args.id);
    return client;
  },
});

// Create a new client with empty template
export const create = mutation({
  args: {
    client_name: v.string(),
    industry: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Empty template structure matching the schema
    const emptyData = {
      foundations: {
        general_business_information: {
          business_name: args.client_name,
          tagline: "",
          website_url: "",
          contact_page_url: "",
          phone_numbers: [],
          physical_addresses: [],
          hours_of_operation: "",
          social_media_handles: {
            instagram: "",
            facebook: "",
            linkedin: "",
            tiktok: "",
            youtube: "",
            twitter: "",
          },
          other_media: [],
        },
        brand_identity: {
          mission_statement: "",
          vision_statement: "",
          core_values: [],
          brand_story: "",
          unique_value_proposition: "",
          differentiators: [],
        },
        services_and_providers: {
          services: [],
          key_services_to_promote: [],
          providers: [],
        },
      },
      personality_and_tone: {
        brand_personality_traits: [],
        brand_archetype: {
          primary: "",
          secondary: "",
        },
        voice_characteristics: [],
        tone_variations_by_context: {
          website_copy: "",
          social_media: "",
          advertising: "",
          email_marketing: "",
          client_to_patient_communication: "",
          agency_to_client_communications: "",
        },
        language_guidelines: {
          preferred_terminology: [],
          words_to_avoid: [],
          industry_specific_language: [],
        },
        inclusive_language_standards: [],
      },
      target_audiences: {
        primary_audience: {
          demographics: {
            age_range: "",
            gender: "",
            income: "",
            location: "",
            other: [],
          },
          psychographics: [],
          pain_points: [],
          goals_and_motivations: [],
        },
        secondary_audiences: [],
        customer_personas: [],
        patient_client_journey: {
          awareness: { touchpoints: [], thoughts_feelings: "" },
          consideration: { touchpoints: [], thoughts_feelings: "" },
          decision: { touchpoints: [], thoughts_feelings: "" },
          experience: { touchpoints: [], thoughts_feelings: "" },
          loyalty: { touchpoints: [], thoughts_feelings: "" },
        },
      },
      visual_identity: {
        logo: {
          logo_lockups: [],
          logo_parts: {
            logomark: { description: "", asset: undefined },
            wordmark: { description: "", asset: undefined },
          },
          minimum_size_requirements: { print: "", digital: "" },
          clear_space_requirements: "",
          unacceptable_usage: [],
        },
        color: {
          palette: {
            primary: [],
            secondary: [],
            tertiary: [],
            gray: [],
          },
          gradients: [],
          color_schemes: [],
          accessibility: {
            body_text_contrast_ratio: "",
            large_text_contrast_ratio: "",
            notes: "",
          },
        },
        typography: {
          primary_typeface: { name: "", weights: [], usage: "", source_url: "" },
          secondary_typeface: { name: "", weights: [], usage: "", source_url: "" },
          web_safe_fallbacks: { serif: "", sans_serif: "" },
          hierarchy: { h1: "", h2: "", h3: "", h4: "", body: "", caption: "" },
          accessibility: { minimum_body_size: "", line_height: "", notes: "" },
        },
        photography_and_imagery: {
          style_guidelines: [],
          subject_matter: [],
          image_treatment_and_filters: [],
          stock_photography_guidelines: [],
          alt_text_guidelines: [],
          sample_images: [],
        },
        graphic_elements: {
          icons: { style: "", usage: "", samples: [] },
          patterns: { description: "", usage: "", samples: [] },
          textures: { description: "", usage: "", samples: [] },
          illustrations: { style: "", usage: "", samples: [] },
        },
        digital_applications: {
          website_elements: {
            page_layout_and_grid: "",
            styles_and_effects: { corner_radius: "", drop_shadows: "", other: [] },
          },
          social_media_templates: {
            instagram_post: { specs: "", template: undefined },
            instagram_story: { specs: "", template: undefined },
            facebook_cover: { specs: "", template: undefined },
            linkedin_banner: { specs: "", template: undefined },
            other: [],
          },
          email_signature: { format: "", template: undefined },
          digital_advertising_specs: { google_display: [], meta: [], other: [] },
        },
        print_applications: {
          business_cards: { size: "", orientation: "", notes: "", template: undefined },
          letterhead: { size: "", layout: "", notes: "", template: undefined },
          envelopes: { type: "", notes: "", template: undefined },
          brochures_and_collateral: { formats: [], notes: "", samples: [] },
          print_advertising: { common_sizes: [], notes: "", samples: [] },
        },
      },
    };

    const clientId = await ctx.db.insert("clients", {
      client_name: args.client_name,
      industry: args.industry,
      current_version: "1.0",
      created_at: now,
      updated_at: now,
      data: emptyData,
    });

    return clientId;
  },
});

// Update client data (for auto-save)
export const update = mutation({
  args: {
    id: v.id("clients"),
    data: v.any(), // Accept partial updates
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Client not found");
    }

    await ctx.db.patch(args.id, {
      data: args.data,
      updated_at: Date.now(),
    });

    return args.id;
  },
});

// Update client metadata (name, industry)
export const updateMetadata = mutation({
  args: {
    id: v.id("clients"),
    client_name: v.optional(v.string()),
    industry: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const updates: Record<string, unknown> = {
      updated_at: Date.now(),
    };

    if (args.client_name !== undefined) {
      updates.client_name = args.client_name;
    }
    if (args.industry !== undefined) {
      updates.industry = args.industry;
    }

    await ctx.db.patch(args.id, updates);
    return args.id;
  },
});

// Delete a client
export const remove = mutation({
  args: { id: v.id("clients") },
  handler: async (ctx, args) => {
    // Also delete associated versions
    const versions = await ctx.db
      .query("versions")
      .withIndex("by_client", (q) => q.eq("client_id", args.id))
      .collect();
    
    for (const version of versions) {
      await ctx.db.delete(version._id);
    }

    // Delete associated document imports
    const imports = await ctx.db
      .query("document_imports")
      .withIndex("by_client", (q) => q.eq("client_id", args.id))
      .collect();
    
    for (const doc of imports) {
      await ctx.db.delete(doc._id);
    }

    // Delete the client
    await ctx.db.delete(args.id);
    return args.id;
  },
});
