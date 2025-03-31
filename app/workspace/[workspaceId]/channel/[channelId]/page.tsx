"use client";

import { useChannelId } from "@/components/hooks/use-channel-id";
import { useGetChannelByChannelId } from "@/features/channels/api/use-get-channel-by-channel-id";
import { Loader, TriangleAlert } from "lucide-react";
import Header from "./channel-header";
import ChatInput from "./chat-input";
import { useGetMessages } from "@/features/messages/api/use-get-messages";

function ChannelPage() {
	const channelId = useChannelId();
	const { channelData, isChannelLoading } = useGetChannelByChannelId({ channelId });
	const { results } = useGetMessages({ channelId });

	console.log(results, "-====================");

	if (isChannelLoading) {
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
			<div className="flex-1">{JSON.stringify(results)}</div>
			<ChatInput placeholder={`Message # ${channelData.name}`} />
		</div>
	);
}

export default ChannelPage;
