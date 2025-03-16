import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

const generateUniqueCode = () => {
	const characters = "0123456789abcdefghijklmnopqrstuvwxyz";
	return Array.from({ length: 6 }, () => {
		return characters[Math.floor(Math.random() * characters.length)];
	}).join("");
};

export const getWorkSpaces = query({
	args: {},
	handler: async (ctx) => {
		const userId = await getAuthUserId(ctx);

		if (!userId) {
			return [];
		}

		const members = await ctx.db
			.query("members")
			.withIndex("by_user_id", (q) => q.eq("userId", userId))
			.collect();

		const workspaceIds = members?.map((curMember) => curMember?.workspaceId);

		const workspaces = [];

		for (const workspaceId of workspaceIds) {
			const workspace = await ctx.db.get(workspaceId);
			workspaces.push(workspace);
		}

		return workspaces;
	},
});

export const createWorkspace = mutation({
	args: {
		name: v.string(),
	},
	handler: async (ctx, arg) => {
		const userId = await getAuthUserId(ctx);

		if (!userId) {
			throw new Error("User not found!");
		}

		const joinCode = generateUniqueCode();

		const workspaceId = await ctx.db.insert("workspaces", {
			name: arg.name,
			joinCode,
			userId,
		});

		await ctx.db.insert("members", {
			workspaceId: workspaceId,
			userId: userId,
			role: "admin",
		});

		await ctx.db.insert("channels", {
			name: "general",
			workspaceId: workspaceId,
		});

		return workspaceId;
	},
});

export const getWorkSpaceById = query({
	args: { workspaceId: v.id("workspaces") },
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx);

		if (!userId) {
			return undefined;
		}

		const member = await ctx.db
			.query("members")
			.withIndex("by_workspace_id_user_id", (q) =>
				q.eq("workspaceId", args.workspaceId).eq("userId", userId)
			)
			.unique();

		if (!member) {
			return null;
		}

		const id = member?.workspaceId;

		const workspace = await ctx.db.get(id);
		return workspace;
	},
});

export const updateWorkspace = mutation({
	args: { workspaceId: v.id("workspaces"), name: v.string() },
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx);

		if (!userId) {
			throw new Error("Unauthorized!");
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

		await ctx.db.patch(args.workspaceId, {
			name: args.name,
		});

		return args.workspaceId;
	},
});

export const removeWorkspace = mutation({
	args: { workspaceId: v.id("workspaces") },
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx);

		if (!userId) {
			throw new Error("Unauthorized!");
		}

		const member = await ctx.db
			.query("members")
			.withIndex("by_workspace_id_user_id", (q) =>
				q.eq("workspaceId", args.workspaceId).eq("userId", userId)
			)
			.unique();

		if (!member || member.role !== "admin") {
			throw new Error("Unauthorized!");
		}

		const [members] = await Promise.all([
			ctx.db
				.query("members")
				.withIndex("by_workspace_id", (q) =>
					q.eq("workspaceId", args.workspaceId)
				)
				.collect(),
		]);

		for (const member of members) {
			await ctx.db.delete(member._id);
		}

		await ctx.db.delete(args.workspaceId);

		return args.workspaceId;
	},
});
