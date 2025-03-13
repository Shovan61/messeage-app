"use client";

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
		</>
	);
}

export default Modals;
