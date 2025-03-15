import React from "react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Id } from "@/convex/_generated/dataModel";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useWorkspaceId } from "@/components/hooks/use-workspaceid";

interface UserItemProps {
	id: Id<"members">;
	label?: string;
	image?: string;
	variant?: VariantProps<typeof userItemVariantProps>["variant"];
}

const userItemVariantProps = cva(
	"flex items-center gap-1.5 justify-start font-normal h-7 px-4 text-sm overflow-hidden",
	{
		variants: {
			variant: {
				default: "text-[#f9edffcc]",
				active: "text-[#481349] bg-white/90 hover:bg-white/90",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	}
);

function UserItem({ id, label = "Member", image, variant }: UserItemProps) {
	const workspaceId = useWorkspaceId();
	const avatarFallback = label.charAt(0).toUpperCase();

	return (
		<Button
			variant={"transparent"}
			className={cn(userItemVariantProps({ variant: variant }))}
			size={"sm"}
			asChild
		>
			<Link href={`/workspace/${workspaceId}/member/${id}`}>
				<Avatar className="size-5 rounded-md mr-1">
					<AvatarImage className="rounded-md" src={image} />
					<AvatarFallback className="rounded-md">
						{avatarFallback}
					</AvatarFallback>
				</Avatar>
				<span className="text-sm truncate">{label}</span>
			</Link>
		</Button>
	);
}

export default UserItem;
