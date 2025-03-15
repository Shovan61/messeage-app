import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";

interface UseGetMembersProps {
	workspaceId: Id<"workspaces">;
}

export const useGetMembers = ({ workspaceId }: UseGetMembersProps) => {
	const membersArrayData = useQuery(api.member.getCurrentMember, { workspaceId });
	const memberArrayDataLoading = membersArrayData === undefined;
	return { memberArrayDataLoading, membersArrayData };
};
