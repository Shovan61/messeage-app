"use client";

import React, { useState, useEffect } from "react";
import { SignInFlow } from "../types";
import SignInCard from "./sign-in-card";
import SignUpCard from "./sign-up-card";

function AuthScreen() {
	const [state, setState] = useState<SignInFlow>("signIn");

	return (
		<div className="h-full flex items-center justify-center bg-[#5C3B58]">
			<div className="w-full md:h-auto md:w-[420px]">
				{state === "signIn" ? (
					<SignInCard setState={setState} />
				) : (
					<SignUpCard setState={setState} />
				)}
			</div>
		</div>
	);
}

export default AuthScreen;
