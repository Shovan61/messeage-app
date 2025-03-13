import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export const useGetWorkspaces = () => {
	const workspaces = useQuery(api.workspaces.getWorkSpaces);
	const isLOading = workspaces === undefined;

	return { workspaces, isLOading };
};
