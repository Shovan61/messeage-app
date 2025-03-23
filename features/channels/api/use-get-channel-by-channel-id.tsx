import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";

interface UseGetChannelByChannelIdProps {
	channelId: Id<"channels">;
}

export const useGetChannelByChannelId = ({ channelId }: UseGetChannelByChannelIdProps) => {
	const channelData = useQuery(api.channels.getChannelByChannelId, { channelId });
	const isChannelLoading = channelData === undefined;
	return { channelData, isChannelLoading };
};
