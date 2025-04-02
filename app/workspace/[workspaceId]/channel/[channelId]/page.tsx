"use client";

import { useChannelId } from "@/components/hooks/use-channel-id";
import { useGetChannelByChannelId } from "@/features/channels/api/use-get-channel-by-channel-id";
import { Loader, TriangleAlert } from "lucide-react";
import Header from "./channel-header";
import ChatInput from "./chat-input";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import MessageList from "@/components/custom-ui-components/messages-list";

function ChannelPage() {
	const channelId = useChannelId();
	const { channelData, isChannelLoading } = useGetChannelByChannelId({ channelId });
	const { results, status, loadMore } = useGetMessages({ channelId });

	if (isChannelLoading || status === "LoadingFirstPage") {
		return (
			<div className="h-full flex flex-1 items-center justify-center">
				<Loader className="size-6 text-muted-foreground animate-spin" />
			</div>
		);
	}

	if (!channelData) {
		return (
			<div className="h-full flex flex-1 flex-col gap-y-2 items-center justify-center">
				<TriangleAlert className="size-6 text-muted-foreground" />
				<span className="text-sm text-muted-foreground">
					Channel no found
				</span>
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full">
			<Header channelName={channelData.name} />
			<MessageList
				channelName={channelData.name}
				channelCreationTime={channelData._creationTime.toString()}
				data={results}
				loadMore={loadMore}
				isLoadingMore={status === "LoadingMore"}
				canLoadMore={status === "CanLoadMore"}
				variant="channel"
			/>
			<ChatInput placeholder={`Message # ${channelData.name}`} />
		</div>
	);
}

export default ChannelPage;
