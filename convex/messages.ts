import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id, Doc } from "./_generated/dataModel";
import { paginationOptsValidator } from "convex/server";

const getMember = async (userId: Id<"users">, workspaceId: Id<"workspaces">, ctx: QueryCtx) => {
	const member = ctx.db
		.query("members")
		.withIndex("by_workspace_id_user_id", (q) =>
			q.eq("workspaceId", workspaceId).eq("userId", userId)
		)
		.unique();

	return member;
};

const populateThreads = async (ctx: QueryCtx, messageId: Id<"messages">) => {
	const messages = await ctx.db
		.query("messages")
		.withIndex("by_parent_message_id", (q) => q.eq("parentMessageId", messageId))
		.collect();

	if (messages.length === 0) {
		return {
			count: 0,
			image: undefined,
			timestamp: 0,
		};
	}

	const lastMessage = messages[messages.length - 1];

	const lastMessageMember = await populateMember(ctx, lastMessage.memberId);

	if (!lastMessageMember) {
		return {
			count: 0,
			image: undefined,
			timestamp: 0,
		};
	}

	const lastMessageUser = await populateUser(ctx, lastMessageMember.userId);

	return {
		count: messages.length,
		image: lastMessageUser?.image,
		timestamp: lastMessage?._creationTime,
	};
};

const populateReactions = async (ctx: QueryCtx, messageId: Id<"messages">) => {
	const reactions = await ctx.db
		.query("reactions")
		.withIndex("by_message_id", (q) => q.eq("messageId", messageId))
		.collect();

	return reactions;
};

const populateMember = (ctx: QueryCtx, memberId: Id<"members">) => {
	return ctx.db.get(memberId);
};

const populateUser = (ctx: QueryCtx, userId: Id<"users">) => {
	const users = ctx.db.get(userId);
	return users;
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

		let _conversationId = args.conversationId;

		// if we are replying inside of a thread of a one on one conversation, for that in url: other member id.
		// the conversation id internal
		// for that conversation id will not come from front end
		// it is a reply there will be parentmessageid
		if (!args.conversationId && !args.channelId && args.parentMessageId) {
			// it is a reply to a one on one conversation
			// only possible if we are replying to an 1:1 conversation
			const parentMessage = await ctx.db.get(args.parentMessageId);

			if (!parentMessage) {
				throw new Error("Parent massage not found!");
			}

			_conversationId = parentMessage.conversationId;
		}

		//  we are checking for two conversation id if it is a reply of 1:1 conversation or not

		const messageId = await ctx.db.insert("messages", {
			body: args.body,
			image: args.image,
			memberId: member._id,
			workspaceId: args.workspaceId,
			channelId: args.channelId,
			parentMessageId: args.parentMessageId,
			conversationId: _conversationId,
		});

		return messageId;
	},
});

export const get = query({
	args: {
		channelId: v.optional(v.id("channels")),
		conversationId: v.optional(v.id("conversations")),
		parentMessageId: v.optional(v.id("messages")),
		paginationOpts: paginationOptsValidator,
	},
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx);

		if (!userId) {
			throw new Error("Unauthorized!");
		}

		let _conversationId = args.conversationId;

		// for 1:1 conversations
		if (!args.channelId && !args.conversationId && args.parentMessageId) {
			// we are sure it is a 1:1 conversation
			const parentMessage = await ctx.db.get(args.parentMessageId);

			if (!parentMessage) {
				throw new Error("Parent massage not found!");
			}

			_conversationId = parentMessage.conversationId;
		}

		const results = await ctx.db
			.query("messages")
			.withIndex("by_channel_id_by_parent_message_id_by_conversation_id", (q) =>
				q
					.eq("channelId", args?.channelId)
					.eq("parentMessageId", args?.parentMessageId)
					.eq("conversationId", _conversationId)
			)
			.order("desc")
			.paginate(args.paginationOpts);

		return {
			...results,
			page: await Promise.all(
				results.page
					.map(async (message) => {
						const member = await populateMember(
							ctx,
							message.memberId
						);
						const user = member
							? await populateUser(ctx, member.userId)
							: null;

						if (!user || !member) return null;

						const reactions = await populateReactions(
							ctx,
							message._id
						);
						const threads = await populateThreads(
							ctx,
							message._id
						);

						const image = message.image
							? await ctx.storage.getUrl(message.image)
							: undefined;

						const reactionsWithCount = reactions.map(
							(reaction) => {
								return {
									...reaction,
									count: reactions.filter(
										(cur) =>
											cur.value ===
											reaction.value
									).length,
								};
							}
						);

						const dedupedReactions = reactionsWithCount.reduce(
							(acc, reaction) => {
								const existingReaction = acc.find(
									// eslint-disable-next-line @typescript-eslint/no-explicit-any
									(r: any) =>
										r.value ===
										reaction.value
								);

								if (existingReaction) {
									existingReaction.memberIds =
										Array.from(
											new Set([
												...existingReaction.memberIds,
												reaction.memberId,
											])
										);
								} else {
									acc.push({
										...reaction,
										memberIds: [
											reaction.memberId,
										],
									});
								}

								return acc;
							},
							[] as (Doc<"reactions"> & {
								count: number;
								memberIds: Id<"members">[];
							})[]
						);

						const reactionswithoutMemberId =
							dedupedReactions.map(
								(memberId, ...rest) => rest
							);

						return {
							...message,
							image,
							member,
							user,
							reactions: reactionswithoutMemberId,
							threadCount: threads.count,
							threadImage: threads.image,
							threadTimestamp: threads.timestamp,
						};
					})
					.filter((message) => message !== null)
			),
		};
	},
});
