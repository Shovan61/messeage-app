"use client";

import CreateChannelModal from "@/features/channels/components/create-channel-modal";
import CreateWorkspaceModal from "@/features/workspaces/components/create-workspace-modal";
import React, { useState, useEffect } from "react";

function Modals() {
	const [mounted, setmounted] = useState(false);

	useEffect(() => {
		setmounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	return (
		<>
			<CreateWorkspaceModal />
			<CreateChannelModal />
			
		</>
	);
}

export default Modals;
