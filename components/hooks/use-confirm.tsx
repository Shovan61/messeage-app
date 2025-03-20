import React, { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

type Options = {
	title?: string;
	description?: string;
	confirmText?: string;
	cancelText?: string;
};

export function useConfirmModal() {
	const [open, setOpen] = useState<boolean>(false);
	const [options, setOptions] = useState<Options | null>(null);
	const [resolvePromise, setResolvePromise] = useState<(value: boolean) => void>();

	const confirm = (options: Options = {}): Promise<boolean> => {
		setOptions({
			title: options.title || "Are you sure?",
			description: options.description || "This action cannot be undone.",
			confirmText: options.confirmText || "Confirm",
			cancelText: options.cancelText || "Cancel",
		});

		setOpen(true);

		return new Promise<boolean>((resolve) => {
			setResolvePromise(() => resolve);
		});
	};

	const handleClose = (result: boolean) => {
		setOpen(false);
		resolvePromise?.(result);
		setResolvePromise(undefined); // Clear the resolve function
	};

	const ConfirmationDialog = () => (
		<Dialog open={open} onOpenChange={(open) => !open && handleClose(false)}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{options?.title}</DialogTitle>
				</DialogHeader>
				<p className="text-sm text-muted-foreground">
					{options?.description}
				</p>
				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => handleClose(false)}
					>
						{options?.cancelText}
					</Button>
					<Button
						variant="default"
						onClick={() => handleClose(true)}
					>
						{options?.confirmText}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);

	return { confirm, ConfirmationDialog };
}