"use client";

import React, { useEffect, useMemo } from "react";
import Image from "next/image";

import VerificationInput from "react-verification-input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useWorkspaceId } from "@/components/hooks/use-workspaceid";
import { useGetWorkspaceInfo } from "@/features/workspaces/api/use-get-workspace-info";
import { Loader } from "lucide-react";
import { useJoinMember } from "@/features/workspaces/api/use-join-member";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

function JoinPage() {
	const workspaceId = useWorkspaceId();
	const router = useRouter();

	const { isWorkspaceInfoLoading, workspaceInforamtion } = useGetWorkspaceInfo({
		workspaceId,
	});
	const { mutate, isPending } = useJoinMember();

	const isMember = useMemo(
		() => workspaceInforamtion?.isMember,
		[workspaceInforamtion?.isMember]
	);

useEffect(() => {
 if(isMember){
	router.push(`/workspace/${workspaceId}`)
 }
}, [router, workspaceId, isMember])


	const handleComplete = async (values: string) => {
		try {
			mutate(
				{ workspaceId, joinCode: values },
				{
					onSuccess(data) {
						console.log(data);
						router.replace(`/workspace/${workspaceId}`);
						toast.success("Successfully joined");
					},
					onError(err) {
						console.log(err);
						toast.error("Can not join code not match");
					},
				}
			);
		} catch (error) {
			console.log(error);
			toast.error("Sonemting went wrong");
		}
	};

	if (isWorkspaceInfoLoading) {
		return (
			<div className="h-full flex items-center justify-center">
				<Loader className="size-6 animate-spin text-muted-foreground" />
			</div>
		);
	}

	return (
		<div className="h-full flex flex-col gap-y-8 items-center justify-center bg-white p-8">
			<Image src={"/logo.png"} height={60} width={60} alt="logo" />
			<div className="flex flex-col gap-y-4 items-center justify-center max-w-md">
				<div className="flex flex-col gap-y-2 items-center justify-center">
					<h1 className="font-bold text-muted-foreground text-xl">
						Join Workspace
					</h1>
					<p className="text-sm italic text-muted-foreground">
						Enter the workspace code to join
					</p>
				</div>
				<VerificationInput
					autoFocus
					length={6}
					classNames={{
						container: cn(
							"flex gap-x-2 ",
							isPending && "opacity-50 cursor-not-allowed"
						),
						character: "uppercase h-auto rounded-md border border-gray-300 text-lg flex items-center justify-center text-gray-500 font-medium",
						characterInactive: "bg-muted",
						characterSelected: "bg-white text-black",
						characterFilled: "bg-white text-black",
					}}
					onComplete={handleComplete}
				/>
			</div>
			<div className="flex gap-x-4">
				<Button asChild variant={"outline"} size={"lg"}>
					<Link href={"/"}>Back to home</Link>
				</Button>
			</div>
		</div>
	);
}

export default JoinPage;
