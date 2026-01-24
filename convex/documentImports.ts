import { v } from "convex/values";
import { query, mutation, action, internalMutation, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";

// Generate a URL for uploading a file to Convex storage
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Create a new document import record
export const create = mutation({
  args: {
    clientId: v.id("clients"),
    filename: v.string(),
    fileId: v.optional(v.string()),
    fileType: v.union(v.literal("pdf"), v.literal("docx"), v.literal("txt"), v.literal("md"), v.literal("json"), v.literal("html")),
    sourceUrl: v.optional(v.string()),
    targetSections: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const importId = await ctx.db.insert("document_imports", {
      client_id: args.clientId,
      filename: args.filename,
      file_id: args.fileId,
      file_type: args.fileType,
      source_url: args.sourceUrl,
      target_sections: args.targetSections,
      status: "pending",
      created_at: now,
    });

    return importId;
  },
});

// Get all document imports for a client
export const listByClient = query({
  args: { clientId: v.id("clients") },
  handler: async (ctx, args) => {
    const imports = await ctx.db
      .query("document_imports")
      .withIndex("by_client", (q) => q.eq("client_id", args.clientId))
      .order("desc")
      .collect();

    return imports;
  },
});

// Get a single document import by ID
export const get = query({
  args: { id: v.id("document_imports") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Update document import status
export const updateStatus = mutation({
  args: {
    id: v.id("document_imports"),
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("ready_for_review"),
      v.literal("applied"),
      v.literal("failed")
    ),
    errorMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const updates: Record<string, unknown> = {
      status: args.status,
    };

    if (args.errorMessage !== undefined) {
      updates.error_message = args.errorMessage;
    }

    if (args.status === "applied") {
      updates.applied_at = Date.now();
    }

    await ctx.db.patch(args.id, updates);
    return args.id;
  },
});

// Update extracted text from document
export const updateExtractedText = mutation({
  args: {
    id: v.id("document_imports"),
    extractedText: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      extracted_text: args.extractedText,
      status: "processing",
    });
    return args.id;
  },
});

// Update extracted fields from Claude
export const updateExtractedFields = mutation({
  args: {
    id: v.id("document_imports"),
    extractedFields: v.any(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      extracted_fields: args.extractedFields,
      status: "ready_for_review",
    });
    return args.id;
  },
});

// Apply accepted fields to client data
export const applyFields = mutation({
  args: {
    importId: v.id("document_imports"),
    clientId: v.id("clients"),
    acceptedFields: v.array(v.object({
      path: v.string(),
      value: v.any(),
    })),
  },
  handler: async (ctx, args) => {
    // Get current client data
    const client = await ctx.db.get(args.clientId);
    if (!client) {
      throw new Error("Client not found");
    }

    // Deep clone current data (handle undefined/null data)
    const currentData = client.data || {};
    const newData = JSON.parse(JSON.stringify(currentData));

    // Apply each accepted field
    for (const field of args.acceptedFields) {
      try {
        setNestedValue(newData, field.path, field.value);
      } catch (e) {
        console.error(`Failed to set field ${field.path}:`, e);
        // Continue with other fields
      }
    }

    // Update client with merged data
    await ctx.db.patch(args.clientId, {
      data: newData,
      updated_at: Date.now(),
    });

    // Update document import status to applied
    await ctx.db.patch(args.importId, {
      status: "applied",
      applied_at: Date.now(),
    });

    return args.importId;
  },
});

// Known required fields for specific object types in the schema
// If an object has these fields but they're null/missing after cleaning, filter it out
const REQUIRED_FIELDS_BY_TYPE: Record<string, string[]> = {
  // Color swatches require name and hex
  colorSwatch: ['name', 'hex'],
  // Gradients require name and type
  gradient: ['name', 'type'],
};

// Detect object type based on its fields
function detectObjectType(obj: Record<string, unknown>): string | null {
  // Color swatch detection: has name and hex (or should have hex)
  if ('hex' in obj || ('name' in obj && ('rgb' in obj || 'cmyk' in obj || 'pantone' in obj))) {
    return 'colorSwatch';
  }
  // Gradient detection: has type that's linear/radial
  if ('type' in obj && (obj.type === 'linear' || obj.type === 'radial')) {
    return 'gradient';
  }
  return null;
}

// Check if an object has all required fields with non-null values
function hasRequiredFields(obj: Record<string, unknown>, requiredFields: string[]): boolean {
  for (const field of requiredFields) {
    if (!(field in obj) || obj[field] === null || obj[field] === undefined) {
      return false;
    }
  }
  return true;
}

// Helper function to recursively clean null values from objects and arrays
function cleanNullValues(value: unknown): unknown {
  if (value === null || value === undefined) {
    return undefined; // Will be filtered out
  }

  if (Array.isArray(value)) {
    // For arrays, clean each item and filter out items that become empty/invalid
    return value
      .map(item => cleanNullValues(item))
      .filter(item => {
        // Keep the item if it's not undefined and not an empty object
        if (item === undefined) return false;
        if (typeof item === 'object' && item !== null) {
          const obj = item as Record<string, unknown>;
          if (Object.keys(obj).length === 0) return false;

          // Check if this object type has required fields
          const objectType = detectObjectType(obj);
          if (objectType && REQUIRED_FIELDS_BY_TYPE[objectType]) {
            // Filter out objects missing required fields
            if (!hasRequiredFields(obj, REQUIRED_FIELDS_BY_TYPE[objectType])) {
              return false;
            }
          }
        }
        return true;
      });
  }

  if (typeof value === 'object' && value !== null) {
    const cleaned: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      const cleanedVal = cleanNullValues(val);
      // Only include non-null/undefined values
      if (cleanedVal !== undefined) {
        cleaned[key] = cleanedVal;
      }
    }
    return cleaned;
  }

  return value;
}

// Helper function to set nested value by path (e.g., "foundations.brand_identity.mission_statement")
function setNestedValue(obj: Record<string, unknown>, path: string, value: unknown): void {
  // Clean null values from the value before setting
  const cleanedValue = cleanNullValues(value);

  // Skip if the cleaned value is undefined or an empty array/object
  if (cleanedValue === undefined) return;
  if (Array.isArray(cleanedValue) && cleanedValue.length === 0) return;
  if (typeof cleanedValue === 'object' && cleanedValue !== null && Object.keys(cleanedValue).length === 0) return;

  const keys = path.split('.');
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (current[key] === undefined || current[key] === null) {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }

  current[keys[keys.length - 1]] = cleanedValue;
}

// Delete a document import
export const remove = mutation({
  args: { id: v.id("document_imports") },
  handler: async (ctx, args) => {
    const doc = await ctx.db.get(args.id);
    if (doc?.file_id) {
      // Delete the file from storage
      try {
        await ctx.storage.delete(doc.file_id as any);
      } catch (e) {
        // File may already be deleted, continue
        console.error("Failed to delete file from storage:", e);
      }
    }
    await ctx.db.delete(args.id);
    return args.id;
  },
});

// Get file URL for a document import
export const getFileUrl = query({
  args: { id: v.id("document_imports") },
  handler: async (ctx, args) => {
    const doc = await ctx.db.get(args.id);
    if (!doc?.file_id) return null;

    return await ctx.storage.getUrl(doc.file_id as any);
  },
});

// Internal mutation to update extracted text (called from action)
export const internalUpdateExtractedText = internalMutation({
  args: {
    id: v.id("document_imports"),
    extractedText: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      extracted_text: args.extractedText,
      status: "processing",
    });
    return args.id;
  },
});

// Internal mutation to mark extraction as failed (called from action)
export const internalSetFailed = internalMutation({
  args: {
    id: v.id("document_imports"),
    errorMessage: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: "failed",
      error_message: args.errorMessage,
    });
    return args.id;
  },
});

// Internal mutation to update extracted fields (called from Claude extraction action)
export const internalUpdateExtractedFields = internalMutation({
  args: {
    id: v.id("document_imports"),
    extractedFields: v.any(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      extracted_fields: args.extractedFields,
      status: "ready_for_review",
    });
    return args.id;
  },
});

// Action to extract text from an uploaded document
// Actions can perform side effects like fetching files from URLs
export const extractText = action({
  args: {
    importId: v.id("document_imports"),
  },
  handler: async (ctx, args): Promise<{ success: boolean; text?: string; error?: string }> => {
    try {
      // Get the document import record
      const doc = await ctx.runQuery(internal.documentImports.internalGet, {
        id: args.importId
      });

      if (!doc) {
        throw new Error("Document import not found");
      }

      // If text was already extracted (e.g., from URL import), return it
      if (doc.extracted_text && doc.extracted_text.length > 0) {
        return { success: true, text: doc.extracted_text };
      }

      if (!doc.file_id) {
        throw new Error("No file associated with this import");
      }

      // Get the file URL from storage
      const fileUrl = await ctx.storage.getUrl(doc.file_id as Id<"_storage">);

      if (!fileUrl) {
        throw new Error("Could not get file URL from storage");
      }

      // Fetch the file content
      const response = await fetch(fileUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }

      let extractedText: string;

      // Extract text based on file type
      switch (doc.file_type) {
        case "txt":
        case "md":
          // For TXT and MD files, just read as text
          extractedText = await response.text();
          break;
        case "json":
          // For JSON files, read and format for better readability
          const jsonContent = await response.text();
          try {
            // Parse and re-stringify with formatting for Claude to understand
            const parsed = JSON.parse(jsonContent);
            extractedText = JSON.stringify(parsed, null, 2);
          } catch {
            // If JSON parsing fails, just use raw text
            extractedText = jsonContent;
          }
          break;
        case "html":
          // HTML should already have text extracted during URL import
          throw new Error("HTML content should be extracted during import");
        case "pdf": {
          // Use Node.js action for PDF parsing
          const pdfResult = await ctx.runAction(internal.documentParsing.parsePdf, {
            importId: args.importId,
            fileUrl,
          });
          if (!pdfResult.success) {
            return { success: false, error: pdfResult.error };
          }
          return { success: true, text: pdfResult.text };
        }
        case "docx": {
          // Use Node.js action for DOCX parsing
          const docxResult = await ctx.runAction(internal.documentParsing.parseDocx, {
            importId: args.importId,
            fileUrl,
          });
          if (!docxResult.success) {
            return { success: false, error: docxResult.error };
          }
          return { success: true, text: docxResult.text };
        }
        default:
          throw new Error(`Unsupported file type: ${doc.file_type}`);
      }

      // Trim and validate extracted text
      extractedText = extractedText.trim();

      if (!extractedText) {
        throw new Error("No text content found in file");
      }

      // Update the document import with extracted text
      await ctx.runMutation(internal.documentImports.internalUpdateExtractedText, {
        id: args.importId,
        extractedText,
      });

      return { success: true, text: extractedText };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error during text extraction";

      // Update the document import with error status
      await ctx.runMutation(internal.documentImports.internalSetFailed, {
        id: args.importId,
        errorMessage,
      });

      return { success: false, error: errorMessage };
    }
  },
});

// Internal query to get document import (for use in actions)
export const internalGet = internalQuery({
  args: { id: v.id("document_imports") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Helper function to extract text content from HTML
function extractTextFromHtml(html: string): string {
  // Remove script and style elements
  let text = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

  // Remove HTML tags but preserve some structure
  text = text.replace(/<br\s*\/?>/gi, '\n');
  text = text.replace(/<\/p>/gi, '\n\n');
  text = text.replace(/<\/div>/gi, '\n');
  text = text.replace(/<\/h[1-6]>/gi, '\n\n');
  text = text.replace(/<\/li>/gi, '\n');
  text = text.replace(/<li[^>]*>/gi, '• ');

  // Remove all remaining HTML tags
  text = text.replace(/<[^>]+>/g, '');

  // Decode HTML entities
  text = text.replace(/&nbsp;/g, ' ');
  text = text.replace(/&amp;/g, '&');
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&#39;/g, "'");
  text = text.replace(/&rsquo;/g, "'");
  text = text.replace(/&lsquo;/g, "'");
  text = text.replace(/&rdquo;/g, '"');
  text = text.replace(/&ldquo;/g, '"');
  text = text.replace(/&mdash;/g, '—');
  text = text.replace(/&ndash;/g, '–');
  text = text.replace(/&#\d+;/g, '');

  // Clean up whitespace
  text = text.replace(/\t/g, ' ');
  text = text.replace(/ +/g, ' ');
  text = text.replace(/\n +/g, '\n');
  text = text.replace(/ +\n/g, '\n');
  text = text.replace(/\n{3,}/g, '\n\n');

  return text.trim();
}

// Detect file type from URL and content-type header
function detectFileTypeFromUrl(url: string, contentType: string | null): "pdf" | "docx" | "txt" | "md" | "json" | "html" {
  const urlLower = url.toLowerCase();

  // Check URL extension first
  if (urlLower.endsWith('.pdf')) return 'pdf';
  if (urlLower.endsWith('.docx')) return 'docx';
  if (urlLower.endsWith('.txt')) return 'txt';
  if (urlLower.endsWith('.md') || urlLower.endsWith('.markdown')) return 'md';
  if (urlLower.endsWith('.json')) return 'json';

  // Check content-type header
  if (contentType) {
    if (contentType.includes('application/pdf')) return 'pdf';
    if (contentType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) return 'docx';
    if (contentType.includes('text/plain')) return 'txt';
    if (contentType.includes('text/markdown')) return 'md';
    if (contentType.includes('application/json')) return 'json';
  }

  // Default to HTML for web pages
  return 'html';
}

// Action to import content from a URL
export const importFromUrl = action({
  args: {
    clientId: v.id("clients"),
    url: v.string(),
  },
  handler: async (ctx, args): Promise<{ success: boolean; importId?: Id<"document_imports">; error?: string }> => {
    try {
      // Validate URL
      let parsedUrl: URL;
      try {
        parsedUrl = new URL(args.url);
      } catch {
        throw new Error("Invalid URL format");
      }

      // Only allow http and https protocols
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        throw new Error("Only HTTP and HTTPS URLs are supported");
      }

      // Fetch the URL content
      const response = await fetch(args.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; BrandGuidelinesBot/1.0)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      const fileType = detectFileTypeFromUrl(args.url, contentType);

      // Generate a filename from the URL
      let filename = parsedUrl.hostname + parsedUrl.pathname;
      filename = filename.replace(/\//g, '-').replace(/^-|-$/g, '') || parsedUrl.hostname;
      if (!filename.includes('.')) {
        filename += fileType === 'html' ? '.html' : `.${fileType}`;
      }

      let extractedText: string;
      let fileId: string | undefined;

      if (fileType === 'html') {
        // For HTML, extract text directly
        const htmlContent = await response.text();
        extractedText = extractTextFromHtml(htmlContent);

        if (!extractedText || extractedText.length < 10) {
          throw new Error("Could not extract meaningful text content from URL");
        }
      } else if (fileType === 'txt' || fileType === 'md') {
        // For plain text files, read directly
        extractedText = await response.text();
      } else if (fileType === 'json') {
        // For JSON, format it nicely
        const jsonContent = await response.text();
        try {
          const parsed = JSON.parse(jsonContent);
          extractedText = JSON.stringify(parsed, null, 2);
        } catch {
          extractedText = jsonContent;
        }
      } else {
        // For PDF/DOCX, we need to store the file and process it
        const blob = await response.blob();
        const uploadUrl = await ctx.storage.generateUploadUrl();

        const uploadResponse = await fetch(uploadUrl, {
          method: 'POST',
          headers: { 'Content-Type': blob.type },
          body: blob,
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to store file content");
        }

        const { storageId } = await uploadResponse.json();
        fileId = storageId;
        extractedText = ""; // Will be extracted by the extractText action
      }

      // Create the document import record
      const importId = await ctx.runMutation(internal.documentImports.internalCreateFromUrl, {
        clientId: args.clientId,
        filename,
        fileId,
        fileType,
        sourceUrl: args.url,
        extractedText: extractedText || undefined,
      });

      // If we already have extracted text (HTML/TXT/MD/JSON), proceed to field extraction
      if (extractedText && extractedText.length > 0) {
        // Update status to processing
        await ctx.runMutation(internal.documentImports.internalUpdateExtractedText, {
          id: importId,
          extractedText,
        });
      }

      return { success: true, importId };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error during URL import";
      return { success: false, error: errorMessage };
    }
  },
});

// Internal mutation to create document import from URL
export const internalCreateFromUrl = internalMutation({
  args: {
    clientId: v.id("clients"),
    filename: v.string(),
    fileId: v.optional(v.string()),
    fileType: v.union(v.literal("pdf"), v.literal("docx"), v.literal("txt"), v.literal("md"), v.literal("json"), v.literal("html")),
    sourceUrl: v.string(),
    extractedText: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const importId = await ctx.db.insert("document_imports", {
      client_id: args.clientId,
      filename: args.filename,
      file_id: args.fileId,
      file_type: args.fileType,
      source_url: args.sourceUrl,
      extracted_text: args.extractedText,
      status: args.extractedText ? "processing" : "pending",
      created_at: now,
    });

    return importId;
  },
});
