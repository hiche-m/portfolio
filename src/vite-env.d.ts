/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_SUBMIT_URL: string;
  readonly VITE_API_MASTER_KEY: string;
  readonly VITE_API_ACCESS_KEY: string;
  readonly VITE_API_COLLECTION_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}