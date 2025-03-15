import { useWorkspaceId } from "@/components/hooks/use-workspaceid";
import { Button } from "@/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { IconType } from "react-icons/lib";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const sidebarItemVariantProps = cva(
	"flex items-center gap-1.5 justify-start font-normal h-7 px-[18px] text-sm overflow-hidden",
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

interface SidebarItemProps {
	label: string;
	id: string;
	icon: LucideIcon | IconType;
	variant?: VariantProps<typeof sidebarItemVariantProps>["variant"];
}

function SidebarItem({ label, id, icon: Icon, variant }: SidebarItemProps) {
	const workspaceId = useWorkspaceId();

	return (
		<Button asChild variant="transparent" size={"sm"} className={cn(sidebarItemVariantProps({variant}))}>
			<Link href={`/workspace/${workspaceId}/channel/${id}`}>
				<Icon className="size-3.5 mr-1 shrink-0"/>
				<span className="text-xs truncate">{label}</span>
			</Link>
		</Button>
	);
}

export default SidebarItem;
