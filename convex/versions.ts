import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get all versions for a client
export const listByClient = query({
  args: { client_id: v.id("clients") },
  handler: async (ctx, args) => {
    const versions = await ctx.db
      .query("versions")
      .withIndex("by_client", (q) => q.eq("client_id", args.client_id))
      .order("desc")
      .collect();
    
    return versions.map((version) => ({
      _id: version._id,
      version_number: version.version_number,
      version_name: version.version_name,
      description: version.description,
      created_at: version.created_at,
      created_by: version.created_by,
    }));
  },
});

// Get a specific version with full data
export const get = query({
  args: { id: v.id("versions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create a new version (snapshot current client data)
export const create = mutation({
  args: {
    client_id: v.id("clients"),
    version_number: v.string(),
    version_name: v.optional(v.string()),
    description: v.optional(v.string()),
    created_by: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get current client data
    const client = await ctx.db.get(args.client_id);
    if (!client) {
      throw new Error("Client not found");
    }

    // Create version snapshot
    const versionId = await ctx.db.insert("versions", {
      client_id: args.client_id,
      version_number: args.version_number,
      version_name: args.version_name,
      description: args.description,
      created_at: Date.now(),
      created_by: args.created_by,
      data: client.data,
    });

    // Update client's current version
    await ctx.db.patch(args.client_id, {
      current_version: args.version_number,
      updated_at: Date.now(),
    });

    return versionId;
  },
});

// Restore a version (copy version data to current client)
export const restore = mutation({
  args: {
    version_id: v.id("versions"),
  },
  handler: async (ctx, args) => {
    const version = await ctx.db.get(args.version_id);
    if (!version) {
      throw new Error("Version not found");
    }

    // Update client with version data
    await ctx.db.patch(version.client_id, {
      data: version.data,
      updated_at: Date.now(),
    });

    return version.client_id;
  },
});

// Delete a version
export const remove = mutation({
  args: { id: v.id("versions") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});
