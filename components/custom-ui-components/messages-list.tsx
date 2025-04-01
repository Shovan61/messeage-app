import { GetMessageReturnType } from "@/features/messages/api/use-get-messages";
import React from "react";

interface MessageListProps {
	channelName?: string;
	memberImage?: string;
	memberName?: string;
	channelCreationTime?: string;
	variant?: "channel" | "thread" | "converstaion";
	data: GetMessageReturnType | undefined;
	loadMore: () => void;
	isLoadingMore: boolean;
	canLoadMore: boolean;
}

function MessageList({
	channelCreationTime,
	channelName,
	memberImage,
	memberName,
	variant,
	canLoadMore,
	loadMore,
	isLoadingMore,
	data,
}: MessageListProps) {
	const groupMessages = data?.reduce(
		(groups, message) => {},
		{} as Record<string, typeof data>
	);
	return (
		<div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto message-scroll">
			{data?.map((message) => (
				<div key={message?._id}>{JSON.stringify(message)}</div>
			))}
		</div>
	);
}

export default MessageList;
