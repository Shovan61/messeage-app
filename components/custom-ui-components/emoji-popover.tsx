import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import React, { useState } from "react";

interface EmojiPopoverProps {
	children: React.ReactNode;
	hint?: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onEmojiSelect: (emoji: any) => void;
}

function EmojiPopover({ children, hint, onEmojiSelect }: EmojiPopoverProps) {
	const [popoverOpen, setpopoverOpen] = useState(false);
	const [tooltipOpen, settooltipOpen] = useState(false);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const onSelect = (emoji: any) => {
		onEmojiSelect(emoji);
		setpopoverOpen(false);

		setTimeout(() => {
			settooltipOpen(false);
		}, 500);
	};

	return (
		<TooltipProvider>
			<Popover open={popoverOpen} onOpenChange={setpopoverOpen}>
				<Tooltip
					open={tooltipOpen}
					onOpenChange={settooltipOpen}
					delayDuration={50}
				>
					<PopoverTrigger>
						<TooltipTrigger>{children}</TooltipTrigger>
						<TooltipContent className="bg-black text-white border border-white/5">
							<p className="font-medium text-xs">
								{hint}
							</p>
						</TooltipContent>
					</PopoverTrigger>
				</Tooltip>
				<PopoverContent className="p-0 w-full border-none shadow-none">
					<Picker
						data={data}
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						onEmojiSelect={(x: any) => {
							onSelect(x);
						}}
					></Picker>
				</PopoverContent>
			</Popover>
		</TooltipProvider>
	);
}

export default EmojiPopover;
