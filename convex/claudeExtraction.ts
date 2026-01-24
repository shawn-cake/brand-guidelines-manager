"use node";

import { v } from "convex/values";
import { action, internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import Anthropic from "@anthropic-ai/sdk";

// Schema description for Claude to understand the brand guidelines structure
const BRAND_GUIDELINES_SCHEMA = `
Extract brand guidelines information from the document into this JSON structure.
Only include fields that have clear information in the document. Use null for missing fields.

{
  "foundations": {
    "general_business_information": {
      "business_name": "string or null",
      "tagline": "string or null",
      "website_url": "string or null",
      "contact_page_url": "string or null",
      "phone_numbers": ["array of strings"] or null,
      "physical_addresses": [{"street": "string", "city": "string", "state": "string", "zip": "string"}] or null,
      "hours_of_operation": "string or null",
      "social_media_handles": {
        "instagram": "string or null",
        "facebook": "string or null",
        "linkedin": "string or null",
        "tiktok": "string or null",
        "youtube": "string or null",
        "twitter": "string or null"
      } or null,
      "other_media": [{"type": "string", "name": "string", "url": "string"}] or null
    },
    "brand_identity": {
      "mission_statement": "string or null",
      "vision_statement": "string or null",
      "core_values": ["array of value strings"] or null,
      "brand_story": "string or null",
      "unique_value_proposition": "string or null",
      "differentiators": ["array of strings"] or null
    },
    "services_and_providers": {
      "services": [{"name": "string", "page_url": "string or null"}] or null,
      "key_services_to_promote": [{"service_name": "string", "key_messaging_points": ["array of strings"]}] or null,
      "providers": [{"name": "string", "credentials": "string or null", "bio": "string or null", "services_offered": ["array of strings"]}] or null
    }
  },
  "personality_and_tone": {
    "brand_personality_traits": ["array of trait strings"] or null,
    "brand_archetype": {
      "primary": "string or null",
      "secondary": "string or null"
    } or null,
    "voice_characteristics": ["array of characteristic strings"] or null,
    "tone_variations_by_context": {
      "website_copy": "string or null",
      "social_media": "string or null",
      "advertising": "string or null",
      "email_marketing": "string or null",
      "client_to_patient_communication": "string or null",
      "agency_to_client_communications": "string or null"
    } or null,
    "language_guidelines": {
      "preferred_terminology": [{"use": "string", "instead_of": "string"}] or null,
      "words_to_avoid": ["array of strings"] or null,
      "industry_specific_language": ["array of strings"] or null
    } or null,
    "inclusive_language_standards": ["array of strings"] or null
  },
  "target_audiences": {
    "primary_audience": {
      "demographics": {
        "age_range": "string or null",
        "gender": "string or null",
        "income": "string or null",
        "location": "string or null",
        "other": ["array of other demographic details"] or null
      } or null,
      "psychographics": ["array of psychographic traits/behaviors"] or null,
      "pain_points": ["array of pain points/concerns"] or null,
      "goals_and_motivations": ["array of goals/motivations"] or null
    } or null,
    "secondary_audiences": [
      {
        "name": "string - name/label for this audience segment",
        "demographics": {
          "age_range": "string or null",
          "gender": "string or null",
          "income": "string or null",
          "location": "string or null",
          "other": ["array of strings"] or null
        } or null,
        "psychographics": ["array of strings"] or null,
        "pain_points": ["array of strings"] or null,
        "goals_and_motivations": ["array of strings"] or null
      }
    ] or null,
    "customer_personas": [
      {
        "name": "string - persona name (e.g., 'Executive Emily')",
        "age": "string - age or age range",
        "occupation": "string - job title or profession",
        "background": "string - brief background description",
        "goals": ["array of persona goals"] or null,
        "pain_points": ["array of persona pain points/hesitations"] or null,
        "how_we_reach_them": "string - how to reach/market to this persona"
      }
    ] or null,
    "patient_client_journey": {
      "awareness": {
        "touchpoints": ["array of touchpoints/channels"] or null,
        "thoughts_feelings": "string - what they think/feel at this stage"
      } or null,
      "consideration": {
        "touchpoints": ["array of touchpoints"] or null,
        "thoughts_feelings": "string"
      } or null,
      "decision": {
        "touchpoints": ["array of touchpoints"] or null,
        "thoughts_feelings": "string"
      } or null,
      "experience": {
        "touchpoints": ["array of touchpoints"] or null,
        "thoughts_feelings": "string"
      } or null,
      "loyalty": {
        "touchpoints": ["array of touchpoints"] or null,
        "thoughts_feelings": "string"
      } or null
    } or null
  },
  "visual_identity": {
    "logo": {
      "minimum_size_requirements": {
        "print": "string or null",
        "digital": "string or null"
      } or null,
      "clear_space_requirements": "string or null",
      "unacceptable_usage": ["array of logo usage rules to avoid"] or null
    } or null,
    "color": {
      "palette": {
        "primary": [{"name": "string", "hex": "#XXXXXX", "rgb": "string or null", "cmyk": "string or null", "pantone": "string or null"}] or null,
        "secondary": [{"name": "string", "hex": "#XXXXXX", "rgb": "string or null", "cmyk": "string or null", "pantone": "string or null"}] or null,
        "tertiary": [{"name": "string", "hex": "#XXXXXX"}] or null,
        "gray": [{"name": "string", "hex": "#XXXXXX"}] or null
      } or null,
      "gradients": [{"name": "string", "type": "linear or radial", "colors": ["array of hex colors"], "css": "string or null"}] or null,
      "color_schemes": ["array of scheme descriptions"] or null,
      "accessibility": {
        "body_text_contrast_ratio": "string or null",
        "large_text_contrast_ratio": "string or null",
        "notes": "string or null"
      } or null
    } or null,
    "typography": {
      "primary_typeface": {
        "name": "string or null",
        "weights": ["array of weight names like 'Regular', 'Bold'"] or null,
        "usage": "string or null",
        "source_url": "string or null"
      } or null,
      "secondary_typeface": {
        "name": "string or null",
        "weights": ["array of weight names"] or null,
        "usage": "string or null",
        "source_url": "string or null"
      } or null,
      "web_safe_fallbacks": {
        "serif": "string or null",
        "sans_serif": "string or null"
      } or null,
      "hierarchy": {
        "h1": "string or null",
        "h2": "string or null",
        "h3": "string or null",
        "h4": "string or null",
        "body": "string or null",
        "caption": "string or null"
      } or null,
      "accessibility": {
        "minimum_body_size": "string or null",
        "line_height": "string or null",
        "notes": "string or null"
      } or null
    } or null,
    "photography_and_imagery": {
      "style_guidelines": ["array of photography style guidelines"] or null,
      "subject_matter": ["array of preferred subject matter"] or null,
      "image_treatment_and_filters": ["array of filter/treatment guidelines"] or null,
      "stock_photography_guidelines": ["array of stock photo rules"] or null,
      "alt_text_guidelines": ["array of alt text best practices"] or null
    } or null,
    "graphic_elements": {
      "icons": {"style": "string or null", "usage": "string or null"} or null,
      "patterns": {"description": "string or null", "usage": "string or null"} or null,
      "textures": {"description": "string or null", "usage": "string or null"} or null,
      "illustrations": {"style": "string or null", "usage": "string or null"} or null
    } or null,
    "digital_applications": {
      "website_elements": {
        "page_layout_and_grid": "string or null",
        "styles_and_effects": {
          "corner_radius": "string or null",
          "drop_shadows": "string or null",
          "other": ["array of other style notes"] or null
        } or null
      } or null,
      "email_signature": {"format": "string or null"} or null
    } or null
  }
}

Important:
- Extract ONLY information explicitly stated in the document
- For colors, extract hex codes if provided (format: #XXXXXX)
- For arrays, include all relevant items found
- For target audiences, extract demographics, psychographics, pain points, goals, and personas
- For customer journey, extract touchpoints and emotional states at each stage
- Return valid JSON only, no markdown or explanations
`;

// Type for extracted fields with confidence
interface ExtractedField {
  value: unknown;
  confidence: "high" | "medium" | "low";
  source_text?: string;
}

interface ExtractionResult {
  fields: Record<string, unknown>;
  field_confidence: Record<string, ExtractedField>;
  extraction_notes: string[];
}

// Action to extract brand guidelines fields using Claude
export const extractFields = action({
  args: {
    importId: v.id("document_imports"),
  },
  handler: async (ctx, args): Promise<{ success: boolean; error?: string }> => {
    try {
      // Get the document import record with extracted text
      const doc = await ctx.runQuery(internal.documentImports.internalGet, {
        id: args.importId,
      });

      if (!doc) {
        throw new Error("Document import not found");
      }

      if (!doc.extracted_text) {
        throw new Error("No extracted text available for processing");
      }

      // Get API key from environment
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) {
        throw new Error("ANTHROPIC_API_KEY environment variable not set");
      }

      // Initialize Anthropic client
      const anthropic = new Anthropic({ apiKey });

      // Call Claude API
      const message = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        messages: [
          {
            role: "user",
            content: `${BRAND_GUIDELINES_SCHEMA}

Here is the document text to extract from:

---
${doc.extracted_text}
---

Return ONLY the JSON object with extracted fields. No explanations or markdown.`,
          },
        ],
      });

      // Extract the text response
      const responseContent = message.content[0];
      if (responseContent.type !== "text") {
        throw new Error("Unexpected response type from Claude");
      }

      // Parse the JSON response
      let extractedFields: Record<string, unknown>;
      try {
        // Clean up the response - remove any markdown code blocks if present
        let jsonText = responseContent.text.trim();
        if (jsonText.startsWith("```json")) {
          jsonText = jsonText.slice(7);
        }
        if (jsonText.startsWith("```")) {
          jsonText = jsonText.slice(3);
        }
        if (jsonText.endsWith("```")) {
          jsonText = jsonText.slice(0, -3);
        }
        jsonText = jsonText.trim();

        extractedFields = JSON.parse(jsonText);
      } catch (parseError) {
        throw new Error(
          `Failed to parse Claude response as JSON: ${parseError instanceof Error ? parseError.message : "Unknown error"}`
        );
      }

      // Update the document import with extracted fields
      await ctx.runMutation(internal.documentImports.internalUpdateExtractedFields, {
        id: args.importId,
        extractedFields,
      });

      return { success: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error during field extraction";

      // Update the document import with error status
      await ctx.runMutation(internal.documentImports.internalSetFailed, {
        id: args.importId,
        errorMessage,
      });

      return { success: false, error: errorMessage };
    }
  },
});

