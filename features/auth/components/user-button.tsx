"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "../api/use-current-user";
import { Loader, LogOutIcon } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";

function UserButton() {
	const { signOut } = useAuthActions();
	const data = useCurrentUser();

	if (data?.isLoading) {
		return <Loader className="animate-spin size-4 text-muted-foreground" />;
	}

	if (!data?.user) {
		return null;
	}

	const fallBack = data?.user.name?.charAt(0).toUpperCase();

	return (
		<>
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger className="outline-none relative">
					<Avatar className="size-10 hover:opacity-75 transition">
						<AvatarImage
							src={data?.user?.image}
							alt={data?.user.name}
							
						/>
						<AvatarFallback className="bg-sky-500 text-white">{fallBack}</AvatarFallback>
					</Avatar>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="center" side="right" className="w-60">
					<DropdownMenuItem
						className="font-semibold"
						onClick={() => signOut()}
					>
						<LogOutIcon className="size-4 mr-2" />
						Log out
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}

export default UserButton;
