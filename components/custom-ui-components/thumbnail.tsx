import React from "react";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { XIcon } from "lucide-react";

interface ThumbnailProps {
	url: string | null | undefined;
}

function Thumbnail({ url }: ThumbnailProps) {
	if (!url) return null;

	return (
		<Dialog>
			<DialogTrigger>
				<div className="relative overflow-hidden max-w-[360px] border rounded-lg my-2 cursor-zoom-in">
					{/* eslint-disable-next-line @next/next/no-img-element	 */}
					<img
						src={url}
						alt="Message Image"
						className="rounded-md object-cover size-full"
					/>
				</div>
			</DialogTrigger>
			<DialogContent className="max-w-[800px] border-none bg-transparent p-0 shadow-none">
				{/* eslint-disable-next-line @next/next/no-img-element	 */}
				<img
					src={url}
					alt="Message Image"
					className="rounded-md object-cover size-full"
				/>
			</DialogContent>
		</Dialog>
	);
}

export default Thumbnail;
