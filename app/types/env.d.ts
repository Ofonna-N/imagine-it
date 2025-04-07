declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PRINTFUL_BASE_URL: string;
      PRINTFUL_ACCESS_TOKEN: string;
      SUPABASE_URL: string;
      SUPABASE_ANON_KEY: string;
    }
  }
}

export {};
