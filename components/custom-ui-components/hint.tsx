"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface HintProps {
	children: React.ReactNode;
	label: string;
	side?: "top" | "right" | "bottom" | "left";
	align?: "start" | "center" | "end";
}

export function Hint({ children, label, side, align }: HintProps) {
	return (
		<TooltipProvider>
			<Tooltip delayDuration={50}>
				<TooltipTrigger asChild>{children}</TooltipTrigger>
				<TooltipContent side={side} align={align}>
					<p className="font-medium text-xs">{label}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
