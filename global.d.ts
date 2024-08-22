declare global {
    var mongoose: {
      conn: typeof import('mongoose') | null;
      promise: Promise<typeof import('mongoose')> | null;
    };
  }
  
  // This is necessary to ensure TypeScript understands this file as a module.
  export {};
  