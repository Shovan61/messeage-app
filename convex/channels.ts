import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getChannel = query({
	args: { workspaceId: v.id("workspaces") },
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx);

		if (!userId) {
			return [];
		}

		const member = await ctx.db
			.query("members")
			.withIndex("by_workspace_id_user_id", (q) =>
				q.eq("workspaceId", args.workspaceId).eq("userId", userId)
			)
			.unique();

		if (!member) {
			return [];
		}

		const channels = await ctx.db
			.query("channels")
			.withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.workspaceId))
			.collect();

		return channels;
	},
});

export const getChannelByChannelId = query({
	args: { channelId: v.id("channels") },
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx);

		if (!userId) {
			return null;
		}

		const channel = await ctx.db.get(args.channelId);

		if (!channel) {
			return null;
		}

		const member = await ctx.db
			.query("members")
			.withIndex("by_workspace_id_user_id", (q) =>
				q.eq("workspaceId", channel?.workspaceId).eq("userId", userId)
			)
			.unique();

		if (!member) {
			return null;
		}

		return channel;
	},
});

export const createChannel = mutation({
	args: { workspaceId: v.id("workspaces"), name: v.string() },
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx);

		if (!userId) {
			throw new Error("Unauthorized");
		}

		const member = await ctx.db
			.query("members")
			.withIndex("by_workspace_id_user_id", (q) =>
				q.eq("workspaceId", args.workspaceId).eq("userId", userId)
			)
			.unique();

		if (!member || member.role !== "admin") {
			throw new Error("Unauthorized");
		}

		const channelId = await ctx.db.insert("channels", {
			workspaceId: args.workspaceId,
			name: args.name,
		});

		return channelId;
	},
});

export const updateChannel = mutation({
	args: { channelID: v.id("channels"), name: v.string() },
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx);

		if (!userId) {
			throw new Error("Unauthorized");
		}

		const channel = await ctx.db.get(args.channelID);

		if (!channel) {
			throw new Error("Channel not found!");
		}

		const member = await ctx.db
			.query("members")
			.withIndex("by_workspace_id_user_id", (q) =>
				q.eq("workspaceId", channel.workspaceId).eq("userId", userId)
			)
			.unique();

		if (!member || member.role !== "admin") {
			throw new Error("Can not perform!");
		}

		await ctx.db.patch(channel._id, {
			name: args.name,
		});

		return channel._id;
	},
});

export const deleteChannel = mutation({
	args: { channelId: v.id("channels") },
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx);

		if (!userId) {
			throw new Error("Unauthorized");
		}

		const channel = await ctx.db.get(args.channelId);

		if (!channel) {
			throw new Error("Channel not found!");
		}

		const member = await ctx.db
			.query("members")
			.withIndex("by_workspace_id_user_id", (q) =>
				q.eq("workspaceId", channel.workspaceId).eq("userId", userId)
			)
			.unique();

		if (!member || member.role !== "admin") {
			throw new Error("Can not perform!");
		}
		// todo : Remove associated messages

		await ctx.db.delete(args.channelId);

		return args.channelId;
	},
});
