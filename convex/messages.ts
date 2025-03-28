import { v } from "convex/values";
import { mutation, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

const getMember = async (userId: Id<"users">, workspaceId: Id<"workspaces">, ctx: QueryCtx) => {
	const member = ctx.db
		.query("members")
		.withIndex("by_workspace_id_user_id", (q) =>
			q.eq("workspaceId", workspaceId).eq("userId", userId)
		)
		.unique();

	return member;
};

export const create = mutation({
	args: {
		body: v.string(),
		image: v.optional(v.id("_storage")),
		workspaceId: v.id("workspaces"),
		channelId: v.optional(v.id("channels")),
		parentMessageId: v.optional(v.id("messages")),
		conversationId: v.optional(v.id("conversations")),
	},
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx);

		if (!userId) {
			throw new Error("Unauthorized!");
		}

		const member = await getMember(userId, args.workspaceId, ctx);

		if (!member) {
			throw new Error("Unauthorized!");
		}

		// handle conversation id

		const messageId = await ctx.db.insert("messages", {
			body: args.body,
			image: args.image,
			memberId: member._id,
			updatedAt: Date.now(),
			workspaceId: args.workspaceId,
			channelId: args.channelId,
			parentMessageId: args.parentMessageId,
		});

		return messageId;
	},
});
