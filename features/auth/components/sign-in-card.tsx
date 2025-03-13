import React, { useState } from "react";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Loader2, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { SignInFlow } from "../types";

import { useAuthActions } from "@convex-dev/auth/react";

interface SignInCardProps {
	setState: (state: SignInFlow) => void;
}

const SignInCard: React.FC<SignInCardProps> = ({ setState }) => {
	const { signIn } = useAuthActions();

	const [data, setdata] = useState({
		email: "",
		password: "",
	});
	const [loading, setloading] = useState(false);

	const [errorMessage, seterrorMessage] = useState("");

	const handleProviderSignIn = (value: "github" | "google") => {
		setloading(true);
		signIn(value).finally(() => {
			setloading(false);
		});
	};

	const onInputChange = (name: string, value: string) => {
		setdata((prev) => {
			return { ...prev, [name]: value };
		});
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setloading(true);
		seterrorMessage("")
		
		const body = {
			email: data.email,
			password: data.password,
			flow: "signIn",
		};

		signIn("password", body)
			.catch((e) => {
				setloading(false);
				seterrorMessage("Invalid email or password");
			})
			.finally(() => {
				setloading(false);
			});
	};

	return (
		<Card className="w-full h-full p-8">
			<CardHeader className="px-0 pt-0">
				<CardTitle className="text-lg font-bold">
					Login to continue
				</CardTitle>

				<CardDescription>
					Use your email or another service to continue
				</CardDescription>
			</CardHeader>
			{!!errorMessage && (
				<div className="flex items-center mb-6 p-3 bg-destructive/15 rounded-md gap-x-2 text-destructive text-sm">
					<TriangleAlert className="size-4" />
					<p className="mt-1">{errorMessage}</p>
				</div>
			)}
			<CardContent className="space-y-5 px-0 pb-0">
				<form className="space-y-2.5" onSubmit={(e) => handleSubmit(e)}>
					<Input
						disabled={loading}
						value={data.email}
						onChange={(e) =>
							onInputChange(e.target.name, e.target.value)
						}
						type="email"
						required
						placeholder="email"
						name="email"
					/>

					<Input
						disabled={loading}
						value={data.password}
						onChange={(e) =>
							onInputChange(e.target.name, e.target.value)
						}
						type="password"
						placeholder="password"
						required
						name="password"
					/>

					<Button
						type="submit"
						className="w-full"
						size="lg"
						disabled={loading}
					>
						{loading && <Loader2 className="animate-spin" />}
						Continue
					</Button>
				</form>

				{/* Seperator */}
				<Separator />

				<div className="flex flex-col gap-y-2.5">
					<Button
						size="lg"
						className="w-full relative"
						disabled={loading}
						variant={"outline"}
						onClick={() => void handleProviderSignIn("google")}
					>
						{loading && <Loader2 className="animate-spin" />}
						<FcGoogle className="size-5 absolute left-2.5 top-2.5" />
						Continue with Google
					</Button>
					<Button
						size="lg"
						className="w-full relative"
						disabled={loading}
						variant={"outline"}
						onClick={() => void handleProviderSignIn("github")}
					>
						{loading && <Loader2 className="animate-spin" />}
						<FaGithub className="size-5 absolute left-2.5 top-2.5" />
						Continue with Github
					</Button>
				</div>

				<p className="text-xs text-muted-foreground">
					Don't have an account?{" "}
					<span
						className="text-sky-700 hover:underline cursor-pointer"
						onClick={() => setState("signUp")}
					>
						Sign Up
					</span>
				</p>
			</CardContent>
		</Card>
	);
};

export default SignInCard;
