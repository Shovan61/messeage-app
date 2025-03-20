import React from "react";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useWorkspaceId } from "@/components/hooks/use-workspaceid";
import { CopyIcon, RefreshCcw } from "lucide-react";
import { useNewJoinCOde } from "@/features/workspaces/api/use-new-join-code";
import { useConfirmModal } from "@/components/hooks/use-confirm";

interface InviteModalProps {
	open: boolean;
	setOpen: (value: boolean) => void;
	name: string;
	joinCode: string;
}

function InviteModal({ open, setOpen, name, joinCode }: InviteModalProps) {
	const workspaceId = useWorkspaceId();
	const { isNewJoinCodePending, newJoinCodeAPi } = useNewJoinCOde();
	const { confirm, ConfirmationDialog } = useConfirmModal();

	const handleClose = () => {
		setOpen(false);
	};

	const handleCopy = () => {
		const inviteLink = `${window.location.origin}/join/${workspaceId}`;

		window.navigator.clipboard
			.writeText(inviteLink)
			.then(() => toast.success("Invite link copied to clipboard"));
	};

	const handleNewCodeGeneration = async () => {
		const isConfirm = await confirm({
			description:
				"This will deactivate the current invite code and generate a new code",
		});

		if (!isConfirm) {
			return false;
		} else {
			try {
				newJoinCodeAPi(
					{
						workspaceId,
					},
					{
						onSuccess() {
							toast.success(
								"New Code generated successfully!"
							);
						},
						onError(error) {
							console.log(error);
							toast.error("Something went wrong!");
						},
					}
				);
			} catch (error) {
				console.log(error);
			}
		}
	};

	return (
		<>
			<ConfirmationDialog />
			<Dialog open={open} onOpenChange={handleClose}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Invite People to {name}</DialogTitle>
						<DialogDescription>
							Use the code to invite people to your
							workspace
						</DialogDescription>
					</DialogHeader>

					<div className="flex flex-col gap-y-4 items-center justify-center py-10">
						<p className="text-4xl text-muted-foreground font-bold uppercase tracking-widest">
							{joinCode}
						</p>

						<Button
							size={"sm"}
							variant={"ghost"}
							className="text-muted-foreground"
							onClick={handleCopy}
						>
							Copy Link
							<CopyIcon className="size-4 ml-2" />
						</Button>
					</div>

					<div className="flex items-center justify-between w-full">
						<Button
							onClick={handleNewCodeGeneration}
							variant={"outline"}
							disabled={isNewJoinCodePending}
						>
							New Code
							<RefreshCcw className="size-4" />
						</Button>
						<DialogClose asChild>
							<Button
								disabled={isNewJoinCodePending}
								onClick={handleClose}
							>
								Close
							</Button>
						</DialogClose>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}

export default InviteModal;
