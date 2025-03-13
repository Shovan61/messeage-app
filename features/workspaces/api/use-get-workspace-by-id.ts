import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

interface UseGetWorkspaceProps {
	workspaceId: Id<"workspaces">;
}

export const useGetWorkspaceByID = ({ workspaceId }: UseGetWorkspaceProps) => {
	const data = useQuery(api.workspaces.getWorkSpaceById, { workspaceId });
	const isLoading = data === undefined;
	return { data, isLoading };
};
