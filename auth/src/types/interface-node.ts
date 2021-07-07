declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // GITHUB_AUTH_TOKEN: string;
      NODE_ENV: 'development' | 'production';
      // PORT?: string;
      JWT_KEY: string;
      // PWD: string;
    }
  }
}

// export interface ProcessEnv {
//  [key: string]: string | undefined
// }

export {} 