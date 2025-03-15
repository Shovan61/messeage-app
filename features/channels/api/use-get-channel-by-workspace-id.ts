import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";

interface UseGetChannelProps {
	workspaceId: Id<"workspaces">;
}

export const useGetChannelByWorkspaceId = ({ workspaceId }: UseGetChannelProps) => {
	const channelData = useQuery(api.channels.getChannel, { workspaceId });

	const isChannelLOading = channelData === undefined;

	return { channelData, isChannelLOading };
};
