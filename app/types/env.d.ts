declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PRINTFUL_BASE_URL: string;
      PRINTFUL_ACCESS_TOKEN: string;
    }
  }
}

export {};
