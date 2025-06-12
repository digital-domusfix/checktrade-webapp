/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  /**
   * When set to "false", the "Skip for now" link on ProfileSetupPage is hidden.
   */
  readonly VITE_SHOW_PROFILE_SKIP_LINK?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
