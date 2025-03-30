import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { usePaginatedQuery } from "convex/react";

const BATCH_SIZE = 20;

interface UseGetMessagesProps {
	channelId?: Id<"channels">;
	parentMessageId?: Id<"messages">;
	conversationId?: Id<"conversations">;
}

export type GetMessageReturnType = (typeof api.messages.get._returnType)["page"];

export const useGetMessages = ({
	channelId,
	parentMessageId,
	conversationId,
}: UseGetMessagesProps) => {
	const { results, status, loadMore } = usePaginatedQuery(
		api.messages.get,
		{ channelId, parentMessageId, conversationId },
		{ initialNumItems: BATCH_SIZE }
	);

	return { results, status, loadMore: () => loadMore(BATCH_SIZE) };
};
