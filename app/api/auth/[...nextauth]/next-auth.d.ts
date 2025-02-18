import { DefaultSession} from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      db_id?: string;
    } & DefaultSession["user"];
  }

  interface JWT {
    db_id?: string;
  }
}
