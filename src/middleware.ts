import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  beforeAuth(req, evt) {
    // console.log('middleware ran');
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
