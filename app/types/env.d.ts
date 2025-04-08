declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BASE_URL: string;
      PRINTFUL_BASE_URL: string;
      PRINTFUL_ACCESS_TOKEN: string;
      SUPABASE_URL: string;
      SUPABASE_SERVICE_ROLE_KEY: string;
    }
  }
}

export {};
