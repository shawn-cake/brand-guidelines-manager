"use node";

import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";

// PDF parsing using unpdf (serverless-compatible)
async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  // Dynamic import - unpdf is designed for serverless environments
  const { extractText } = await import("unpdf");

  // Convert Buffer to Uint8Array for unpdf
  const uint8Array = new Uint8Array(buffer);

  // Extract text from all pages, merged together
  const { text } = await extractText(uint8Array, { mergePages: true });
  return text;
}

// DOCX parsing using mammoth
async function extractTextFromDocx(buffer: Buffer): Promise<string> {
  // Dynamic import to avoid issues with Convex bundling
  const mammoth = await import("mammoth");
  
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

// Internal action to parse PDF files
export const parsePdf = internalAction({
  args: {
    importId: v.id("document_imports"),
    fileUrl: v.string(),
  },
  handler: async (ctx, args): Promise<{ success: boolean; text?: string; error?: string }> => {
    try {
      // Fetch the file
      const response = await fetch(args.fileUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }

      // Get buffer from response
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Extract text from PDF
      const extractedText = await extractTextFromPdf(buffer);

      if (!extractedText || extractedText.trim().length === 0) {
        throw new Error("No text content found in PDF");
      }

      // Update the document import with extracted text
      await ctx.runMutation(internal.documentImports.internalUpdateExtractedText, {
        id: args.importId,
        extractedText: extractedText.trim(),
      });

      return { success: true, text: extractedText.trim() };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error during PDF parsing";
      
      // Update the document import with error status
      await ctx.runMutation(internal.documentImports.internalSetFailed, {
        id: args.importId,
        errorMessage,
      });

      return { success: false, error: errorMessage };
    }
  },
});

// Internal action to parse DOCX files
export const parseDocx = internalAction({
  args: {
    importId: v.id("document_imports"),
    fileUrl: v.string(),
  },
  handler: async (ctx, args): Promise<{ success: boolean; text?: string; error?: string }> => {
    try {
      // Fetch the file
      const response = await fetch(args.fileUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }

      // Get buffer from response
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Extract text from DOCX
      const extractedText = await extractTextFromDocx(buffer);

      if (!extractedText || extractedText.trim().length === 0) {
        throw new Error("No text content found in DOCX");
      }

      // Update the document import with extracted text
      await ctx.runMutation(internal.documentImports.internalUpdateExtractedText, {
        id: args.importId,
        extractedText: extractedText.trim(),
      });

      return { success: true, text: extractedText.trim() };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error during DOCX parsing";
      
      // Update the document import with error status
      await ctx.runMutation(internal.documentImports.internalSetFailed, {
        id: args.importId,
        errorMessage,
      });

      return { success: false, error: errorMessage };
    }
  },
});

