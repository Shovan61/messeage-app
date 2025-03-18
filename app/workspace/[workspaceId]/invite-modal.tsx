import React from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useWorkspaceId } from "@/components/hooks/use-workspaceid";
import { CopyIcon } from "lucide-react";

interface InviteModalProps {
	open: boolean;
	setOpen: (value: boolean) => void;
	name: string;
	joinCode: string;
}

function InviteModal({ open, setOpen, name, joinCode }: InviteModalProps) {
	const workspaceId = useWorkspaceId();

	const handleClose = () => {
		setOpen(false);
	};

	const handleCopy = () => {
		const inviteLink = `${window.location.origin}/join/${workspaceId}`;

		window.navigator.clipboard
			.writeText(inviteLink)
			.then(() => toast.success("Invite link copied to clipboard"));
	};

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Invite People</DialogTitle>
					<DialogDescription>
						Use the code to invite people to your workspace
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
			</DialogContent>
		</Dialog>
	);
}

export default InviteModal;
