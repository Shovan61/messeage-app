import React from "react";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { XIcon } from "lucide-react";

interface ThumbnailProps {
	url: string | null | undefined;
}

function Thumbnail({ url }: ThumbnailProps) {
	if (!url) return null;

	return (
		<div className="relative overflow-hidden max-w-[360px] border rounded-lg my-2 cursor-zoom-in">
			{/* eslint-disable-next-line @next/next/no-img-element	 */}
			<img
				src={url}
				alt="Message Image"
				className="rounded-md object-cover size-full"
			/>
		</div>
	);
}

export default Thumbnail;
