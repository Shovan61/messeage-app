"use client";

import { useChannelId } from "@/components/hooks/use-channel-id";
import { useGetChannelByChannelId } from "@/features/channels/api/use-get-channel-by-channel-id";
import { Loader, TriangleAlert } from "lucide-react";

function ChannelPage() {
	const channelId = useChannelId();
	const { channelData, isChannelLoading } = useGetChannelByChannelId({ channelId });

	if (isChannelLoading) {
		return (
			<div className="h-full flex flex-1 items-center justify-center">
				<Loader className="size-6 text-muted-foreground animate-spin" />
			</div>
		);
	}
	if (!channelData) {
		return (
			<div className="h-full flex flex-1 items-center justify-center">
				<TriangleAlert className="size-6 text-muted-foreground" />
			</div>
		);
	}
	return <div>Channel page</div>;
}

export default ChannelPage;
