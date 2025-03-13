import UserButton from "@/features/auth/components/user-button";
import React from "react";
import WorkspaceSwitcher from "./workspace-switcher";
import SidebarButton from "./sidebar-button";
import { BellIcon, HomeIcon, MessageSquareIcon, MoreHorizontalIcon } from "lucide-react";
import { usePathname } from "next/navigation";

function SideBar() {
	const pathName = usePathname();

	return (
		<aside className="w-[70px] !h-full bg-[#481349] flex flex-col gap-y-4 items-center pt-[9px] pb-[4px]">
			<WorkspaceSwitcher />
			<SidebarButton
				icon={HomeIcon}
				label="Home"
				isActive={pathName.includes("/workspace")}
			/>
			<SidebarButton
				icon={MessageSquareIcon}
				label="DNs"
				isActive={pathName.includes("/dms")}
			/>
			<SidebarButton
				icon={BellIcon}
				label="Activity"
				isActive={pathName.includes("/activity")}
			/>
			<SidebarButton
				icon={MoreHorizontalIcon}
				label="More"
				isActive={pathName.includes("/more")}
			/>
			<div className="flex flex-col items-center justify-center gap-y-1 mt-auto">
				<UserButton />
			</div>
		</aside>
	);
}

export default SideBar;
