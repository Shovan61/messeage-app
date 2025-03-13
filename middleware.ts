import {
	convexAuthNextjsMiddleware,
	createRouteMatcher,
	nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isSignInPage = createRouteMatcher(["/auth"]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
	if (!isSignInPage(request) && !(await convexAuth.isAuthenticated())) {
		return nextjsMiddlewareRedirect(request, "/auth");
	}
	
	if (isSignInPage(request) && (await convexAuth.isAuthenticated())) {
		return nextjsMiddlewareRedirect(request, "/");
	}
});

export const config = {
	// The following matcher runs middleware on all routes
	// except static assets.
	matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
