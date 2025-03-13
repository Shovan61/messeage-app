import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import Modals from "../components/modals/modals";
import { Toaster } from "@/components/ui/sonner";
import { JotaiProvider } from "./jotai-provider";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Slack Clone",
	description: "This is a clone app of Slack ",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ConvexAuthNextjsServerProvider>
			<html lang="en">
				<body
					className={`${geistSans.variable} ${geistMono.variable} antialiased`}
				>
					<ConvexClientProvider>
						<JotaiProvider>
							<Modals />
							<Toaster />
							{children}
						</JotaiProvider>
					</ConvexClientProvider>
				</body>
			</html>
		</ConvexAuthNextjsServerProvider>
	);
}
