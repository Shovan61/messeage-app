import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";

interface UseWorkspaceInfoProps {
	workspaceId: Id<"workspaces">;
}

export const useGetWorkspaceInfo = ({ workspaceId }: UseWorkspaceInfoProps) => {
	const data = useQuery(api.workspaces.getWorkspaceInfo, { workspaceId: workspaceId });
	const isLoading = data === undefined;
	return { workspaceInforamtion: data, isWorkspaceInfoLoading: isLoading };
};
