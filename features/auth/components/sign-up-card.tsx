import React, { useState } from "react";

import { FcGoogle } from "react-icons/fc";
import { Loader2, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { FaGithub } from "react-icons/fa";
import { SignInFlow } from "../types";

import { useAuthActions } from "@convex-dev/auth/react";

interface SignUpCardProps {
	setState: (state: SignInFlow) => void;
}

const SignUpCard: React.FC<SignUpCardProps> = ({ setState }) => {
	const { signIn } = useAuthActions();

	const [data, setdata] = useState({
		email: "",
		password: "",
		confirm: "",
		name: "",
	});

	const [loading, setloading] = useState(false);

	const [errorMessage, seterrorMessage] = useState("");

	const handleProviderSignUp = (value: "github" | "google") => {
		setdata((prev) => {
			return { ...prev, email: "", password: "", confirm: "" };
		});

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
		seterrorMessage("");

		if (data.password !== data.confirm) {
			setloading(false);
			return seterrorMessage("Password not matched");
		}

		const body = {
			email: data.email,
			password: data.password,
			name: data.name,
			flow: "signUp",
		};

		signIn("password", body)
			.catch((e) => {
				setloading(false);
				seterrorMessage("Something went wrong!");
			})
			.finally(() => {
				setloading(false);
			});
	};

	return (
		<Card className="w-full h-full p-8">
			<CardHeader className="px-0 pt-0">
				<CardTitle className="text-lg font-bold">
					Sign up to continue
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
						value={data.name}
						onChange={(e) =>
							onInputChange(e.target.name, e.target.value)
						}
						required
						placeholder="Full Name"
						name="name"
					/>
					<Input
						disabled={loading}
						value={data.email}
						onChange={(e) =>
							onInputChange(e.target.name, e.target.value)
						}
						type="email"
						required
						placeholder="Email"
						name="email"
					/>
					<Input
						disabled={loading}
						value={data.password}
						onChange={(e) =>
							onInputChange(e.target.name, e.target.value)
						}
						type="password"
						placeholder="Password"
						name="password"
						required
					/>
					<Input
						disabled={loading}
						value={data.confirm}
						onChange={(e) =>
							onInputChange(e.target.name, e.target.value)
						}
						type="password"
						placeholder="Confirm password"
						name="confirm"
						required
					/>
					<Button
						type="submit"
						className="w-full"
						size="lg"
						disabled={loading}
					>
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
						onClick={() => void handleProviderSignUp("google")}
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
						onClick={() => void handleProviderSignUp("github")}
					>
						{loading && <Loader2 className="animate-spin" />}
						<FaGithub className="size-5 absolute left-2.5 top-2.5" />
						Continue with Github
					</Button>
				</div>

				<p className="text-xs text-muted-foreground">
					Already have an account?{" "}
					<span
						className="text-sky-700 hover:underline cursor-pointer"
						onClick={() => setState("signIn")}
					>
						Sign In
					</span>
				</p>
			</CardContent>
		</Card>
	);
};

export default SignUpCard;
