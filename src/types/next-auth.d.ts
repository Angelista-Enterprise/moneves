declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string | null;
      bunqApiKey?: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    image?: string | null;
    bunqApiKey?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    bunqApiKey?: string;
  }
}
