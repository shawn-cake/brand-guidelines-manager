import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Reusable validator for asset fields (logo images, templates, etc.)
const assetValidator = v.object({
  type: v.optional(v.union(v.literal("upload"), v.literal("url"))),
  file_id: v.optional(v.string()),
  url: v.optional(v.string()),
  filename: v.optional(v.string()),
  alt_text: v.optional(v.string()),
  uploaded_at: v.optional(v.number()),
});

// Reusable validator for optional asset fields
const optionalAssetValidator = v.optional(assetValidator);

// Physical address validator
const addressValidator = v.object({
  label: v.optional(v.string()),
  street: v.optional(v.string()),
  city: v.optional(v.string()),
  state: v.optional(v.string()),
  zip: v.optional(v.string()),
});

// Color swatch validator
const colorSwatchValidator = v.object({
  name: v.optional(v.string()),
  hex: v.optional(v.string()),
  rgb: v.optional(v.string()),
  cmyk: v.optional(v.string()),
  pantone: v.optional(v.string()),
});

// Demographics validator
const demographicsValidator = v.object({
  age_range: v.optional(v.string()),
  gender: v.optional(v.string()),
  income: v.optional(v.string()),
  location: v.optional(v.string()),
  other: v.optional(v.array(v.string())),
});

// Journey stage validator
const journeyStageValidator = v.object({
  touchpoints: v.optional(v.array(v.string())),
  thoughts_feelings: v.optional(v.string()),
});

// The full ClientData structure stored as a nested object
const clientDataValidator = v.object({
  foundations: v.object({
    general_business_information: v.object({
      business_name: v.optional(v.string()),
      tagline: v.optional(v.string()),
      website_url: v.optional(v.string()),
      contact_page_url: v.optional(v.string()),
      phone_numbers: v.optional(v.array(v.string())),
      physical_addresses: v.optional(v.array(addressValidator)),
      hours_of_operation: v.optional(v.string()),
      social_media_handles: v.optional(v.object({
        instagram: v.optional(v.string()),
        facebook: v.optional(v.string()),
        linkedin: v.optional(v.string()),
        tiktok: v.optional(v.string()),
        youtube: v.optional(v.string()),
        twitter: v.optional(v.string()),
      })),
      other_media: v.optional(v.array(v.object({
        type: v.optional(v.string()),
        name: v.optional(v.string()),
        url: v.optional(v.string()),
      }))),
    }),
    brand_identity: v.object({
      mission_statement: v.optional(v.string()),
      vision_statement: v.optional(v.string()),
      core_values: v.optional(v.array(v.string())),
      brand_story: v.optional(v.string()),
      unique_value_proposition: v.optional(v.string()),
      differentiators: v.optional(v.array(v.string())),
    }),
    services_and_providers: v.object({
      services: v.optional(v.array(v.object({
        name: v.optional(v.string()),
        page_url: v.optional(v.string()),
      }))),
      key_services_to_promote: v.optional(v.array(v.object({
        service_name: v.optional(v.string()),
        key_messaging_points: v.optional(v.array(v.string())),
      }))),
      providers: v.optional(v.array(v.object({
        name: v.optional(v.string()),
        credentials: v.optional(v.string()),
        bio: v.optional(v.string()),
        services_offered: v.optional(v.array(v.string())),
        headshot: optionalAssetValidator,
      }))),
    }),
  }),

  personality_and_tone: v.object({
    brand_personality_traits: v.optional(v.array(v.string())),
    brand_archetype: v.optional(v.object({
      primary: v.optional(v.string()),
      secondary: v.optional(v.string()),
    })),
    voice_characteristics: v.optional(v.array(v.string())),
    tone_variations_by_context: v.optional(v.object({
      website_copy: v.optional(v.string()),
      social_media: v.optional(v.string()),
      advertising: v.optional(v.string()),
      email_marketing: v.optional(v.string()),
      client_to_patient_communication: v.optional(v.string()),
      agency_to_client_communications: v.optional(v.string()),
    })),
    language_guidelines: v.optional(v.object({
      preferred_terminology: v.optional(v.array(v.object({
        use: v.optional(v.string()),
        instead_of: v.optional(v.string()),
      }))),
      words_to_avoid: v.optional(v.array(v.string())),
      industry_specific_language: v.optional(v.array(v.string())),
    })),
    inclusive_language_standards: v.optional(v.array(v.string())),
  }),

  target_audiences: v.object({
    primary_audience: v.optional(v.object({
      demographics: v.optional(demographicsValidator),
      psychographics: v.optional(v.array(v.string())),
      pain_points: v.optional(v.array(v.string())),
      goals_and_motivations: v.optional(v.array(v.string())),
    })),
    secondary_audiences: v.optional(v.array(v.object({
      name: v.optional(v.string()),
      demographics: v.optional(demographicsValidator),
      psychographics: v.optional(v.array(v.string())),
      pain_points: v.optional(v.array(v.string())),
      goals_and_motivations: v.optional(v.array(v.string())),
    }))),
    customer_personas: v.optional(v.array(v.object({
      name: v.optional(v.string()),
      age: v.optional(v.string()),
      occupation: v.optional(v.string()),
      background: v.optional(v.string()),
      goals: v.optional(v.array(v.string())),
      pain_points: v.optional(v.array(v.string())),
      how_we_reach_them: v.optional(v.string()),
      image: optionalAssetValidator,
    }))),
    patient_client_journey: v.optional(v.object({
      awareness: v.optional(journeyStageValidator),
      consideration: v.optional(journeyStageValidator),
      decision: v.optional(journeyStageValidator),
      experience: v.optional(journeyStageValidator),
      loyalty: v.optional(journeyStageValidator),
    })),
  }),

  visual_identity: v.object({
    logo: v.optional(v.object({
      logo_lockups: v.optional(v.array(v.object({
        name: v.optional(v.string()),
        type: v.optional(v.union(v.literal("primary"), v.literal("alternate"))),
        description: v.optional(v.string()),
        asset: optionalAssetValidator,
      }))),
      logo_parts: v.optional(v.object({
        logomark: v.optional(v.object({
          description: v.optional(v.string()),
          asset: optionalAssetValidator,
        })),
        wordmark: v.optional(v.object({
          description: v.optional(v.string()),
          asset: optionalAssetValidator,
        })),
      })),
      minimum_size_requirements: v.optional(v.object({
        print: v.optional(v.string()),
        digital: v.optional(v.string()),
      })),
      clear_space_requirements: v.optional(v.string()),
      unacceptable_usage: v.optional(v.array(v.string())),
    })),
    color: v.optional(v.object({
      palette: v.optional(v.object({
        primary: v.optional(v.array(colorSwatchValidator)),
        secondary: v.optional(v.array(colorSwatchValidator)),
        tertiary: v.optional(v.array(colorSwatchValidator)),
        gray: v.optional(v.array(colorSwatchValidator)),
      })),
      gradients: v.optional(v.array(v.object({
        name: v.optional(v.string()),
        type: v.optional(v.union(v.literal("linear"), v.literal("radial"))),
        colors: v.optional(v.array(v.string())),
        css: v.optional(v.string()),
      }))),
      color_schemes: v.optional(v.array(v.string())),
      accessibility: v.optional(v.object({
        body_text_contrast_ratio: v.optional(v.string()),
        large_text_contrast_ratio: v.optional(v.string()),
        notes: v.optional(v.string()),
      })),
    })),
    typography: v.optional(v.object({
      primary_typeface: v.optional(v.object({
        name: v.optional(v.string()),
        weights: v.optional(v.array(v.string())),
        usage: v.optional(v.string()),
        source_url: v.optional(v.string()),
      })),
      secondary_typeface: v.optional(v.object({
        name: v.optional(v.string()),
        weights: v.optional(v.array(v.string())),
        usage: v.optional(v.string()),
        source_url: v.optional(v.string()),
      })),
      web_safe_fallbacks: v.optional(v.object({
        serif: v.optional(v.string()),
        sans_serif: v.optional(v.string()),
      })),
      hierarchy: v.optional(v.object({
        h1: v.optional(v.string()),
        h2: v.optional(v.string()),
        h3: v.optional(v.string()),
        h4: v.optional(v.string()),
        body: v.optional(v.string()),
        caption: v.optional(v.string()),
      })),
      accessibility: v.optional(v.object({
        minimum_body_size: v.optional(v.string()),
        line_height: v.optional(v.string()),
        notes: v.optional(v.string()),
      })),
    })),
    photography_and_imagery: v.optional(v.object({
      style_guidelines: v.optional(v.array(v.string())),
      subject_matter: v.optional(v.array(v.string())),
      image_treatment_and_filters: v.optional(v.array(v.string())),
      stock_photography_guidelines: v.optional(v.array(v.string())),
      alt_text_guidelines: v.optional(v.array(v.string())),
      sample_images: v.optional(v.array(assetValidator)),
    })),
    graphic_elements: v.optional(v.object({
      icons: v.optional(v.object({
        style: v.optional(v.string()),
        usage: v.optional(v.string()),
        samples: v.optional(v.array(assetValidator)),
      })),
      patterns: v.optional(v.object({
        description: v.optional(v.string()),
        usage: v.optional(v.string()),
        samples: v.optional(v.array(assetValidator)),
      })),
      textures: v.optional(v.object({
        description: v.optional(v.string()),
        usage: v.optional(v.string()),
        samples: v.optional(v.array(assetValidator)),
      })),
      illustrations: v.optional(v.object({
        style: v.optional(v.string()),
        usage: v.optional(v.string()),
        samples: v.optional(v.array(assetValidator)),
      })),
    })),
    digital_applications: v.optional(v.object({
      website_elements: v.optional(v.object({
        page_layout_and_grid: v.optional(v.string()),
        styles_and_effects: v.optional(v.object({
          corner_radius: v.optional(v.string()),
          drop_shadows: v.optional(v.string()),
          other: v.optional(v.array(v.string())),
        })),
      })),
      social_media_templates: v.optional(v.object({
        instagram_post: v.optional(v.object({
          specs: v.optional(v.string()),
          template: optionalAssetValidator,
        })),
        instagram_story: v.optional(v.object({
          specs: v.optional(v.string()),
          template: optionalAssetValidator,
        })),
        facebook_cover: v.optional(v.object({
          specs: v.optional(v.string()),
          template: optionalAssetValidator,
        })),
        linkedin_banner: v.optional(v.object({
          specs: v.optional(v.string()),
          template: optionalAssetValidator,
        })),
        other: v.optional(v.array(v.object({
          name: v.optional(v.string()),
          specs: v.optional(v.string()),
          template: optionalAssetValidator,
        }))),
      })),
      email_signature: v.optional(v.object({
        format: v.optional(v.string()),
        template: optionalAssetValidator,
      })),
      digital_advertising_specs: v.optional(v.object({
        google_display: v.optional(v.array(v.string())),
        meta: v.optional(v.array(v.string())),
        other: v.optional(v.array(v.string())),
      })),
    })),
    print_applications: v.optional(v.object({
      business_cards: v.optional(v.object({
        size: v.optional(v.string()),
        orientation: v.optional(v.string()),
        notes: v.optional(v.string()),
        template: optionalAssetValidator,
      })),
      letterhead: v.optional(v.object({
        size: v.optional(v.string()),
        layout: v.optional(v.string()),
        notes: v.optional(v.string()),
        template: optionalAssetValidator,
      })),
      envelopes: v.optional(v.object({
        type: v.optional(v.string()),
        notes: v.optional(v.string()),
        template: optionalAssetValidator,
      })),
      brochures_and_collateral: v.optional(v.object({
        formats: v.optional(v.array(v.string())),
        notes: v.optional(v.string()),
        samples: v.optional(v.array(assetValidator)),
      })),
      print_advertising: v.optional(v.object({
        common_sizes: v.optional(v.array(v.string())),
        notes: v.optional(v.string()),
        samples: v.optional(v.array(assetValidator)),
      })),
    })),
  }),
});

export default defineSchema({
  // Main clients table - stores the working draft for each client
  clients: defineTable({
    // Metadata
    client_name: v.string(),
    industry: v.optional(v.string()),
    current_version: v.optional(v.string()),
    created_at: v.number(),
    updated_at: v.number(),
    created_by: v.optional(v.string()),
    updated_by: v.optional(v.string()),
    // The actual brand guidelines data
    data: clientDataValidator,
  })
    .index("by_name", ["client_name"])
    .index("by_updated", ["updated_at"]),

  // Versions table - immutable snapshots of client data
  versions: defineTable({
    client_id: v.id("clients"),
    version_number: v.string(),
    version_name: v.optional(v.string()),
    description: v.optional(v.string()),
    created_at: v.number(),
    created_by: v.optional(v.string()),
    // Full snapshot of client data at time of version
    data: clientDataValidator,
  })
    .index("by_client", ["client_id"])
    .index("by_client_and_version", ["client_id", "version_number"]),

  // Document imports table - for tracking imported documents and extracted data
  document_imports: defineTable({
    client_id: v.id("clients"),
    filename: v.string(),
    file_id: v.optional(v.string()),
    file_type: v.union(v.literal("pdf"), v.literal("docx"), v.literal("txt"), v.literal("md"), v.literal("json"), v.literal("html")),
    source_url: v.optional(v.string()), // URL if imported from web
    extracted_text: v.optional(v.string()),
    target_sections: v.optional(v.array(v.string())),
    extracted_fields: v.optional(v.any()), // Flexible structure for extracted data
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("ready_for_review"),
      v.literal("applied"),
      v.literal("failed")
    ),
    error_message: v.optional(v.string()),
    created_at: v.number(),
    created_by: v.optional(v.string()),
    applied_at: v.optional(v.number()),
    applied_by: v.optional(v.string()),
  })
    .index("by_client", ["client_id"])
    .index("by_status", ["status"]),
});
