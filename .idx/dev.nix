# This is a Nix configuration file.
# For more information, see https://developer.jetpack.io/idx/docs/config/
{ pkgs, ... }: {
  # This line ensures a MongoDB server is running in your environment
  services.mongodb.enable = true;

  # Which nixpkgs channel to use.
  channel = "stable-23.11"; # Or "unstable"
  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs_20 # Pinned to Node.js 20
  ];
  # Sets environment variables in the workspace
  env = {};
  # Search for the extensions you want on https://open-vsx.org/
  extensions = [
    "unifiedjs.vscode-mdx"
  ];
  # Broader VS Code settings
  vscode = {
    settings = {
      "editor.formatOnSave" = true;
    };
  };
  # Add a command to run on workspace startup
  startup = {
    command = [
      "npm install"
    ];
  };
}
