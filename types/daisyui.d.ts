declare module 'daisyui' {
  interface DaisyUITheme {
    [key: string]: string;
  }

  interface DaisyUIConfig {
    themes?: (DaisyUITheme | string)[];
    base?: boolean;
    styled?: boolean;
    utils?: boolean;
    prefix?: string;
    logs?: boolean;
    themeRoot?: string;
  }

  type PluginWithOptions<T> = {
    (options?: T): {
      handler: (api: any) => void;
      config?: any;
    };
    __isOptionsFunction: true;
  };

  const daisyui: PluginWithOptions<DaisyUIConfig>;

  export default daisyui;
}