import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  beforeAuth(req, evt) {
    // console.log('middleware ran');
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
