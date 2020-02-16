## Install local version of ghost for development

The local version has minimal caching and logs to stdout making development easier. It should NOT be subsequently converted to a production install (antipattern).

### References

* Supported node versions: https://docs.ghost.org/docs/supported-node-versions
* Installing nvm: https://www.sitepoint.com/quick-tip-multiple-versions-node-nvm/
* Installing ghost for local development: https://docs.ghost.org/docs/install-local
* Checking nvm install: https://docs.ghost.org/docs/troubleshooting#section-using-nvm

### Install

1. Check if you have a compatible version of node
   a. If not, install nvm via homebrew `brew install nvm` - following the instructions to create ~/.nvm etc since officially not supported this way
   b. Restart shell
   c. `nvm ls-remote` to list all available versions
   d. Choose the latest compatible version and install: `nvm install 8.11.3` OR `nvm install 8.11` to install the latestest patch of 8.11
2. Install ghost with npm: `npm i -g ghost-cli@latest`
3. Create a directory for ghost (e.g. `~/ghost`, `cd` into it and `ghost install local`
4. If using nvm, following install, double check these two commands give the same path as per the ghost docs:
   a. `which ghost` and `npm root -g`

### Commands

The following commands are useful for local development:

* `ghost ls` to list running instances
* `ghost start` to start ghost (required after restarting workstation)
* `ghost stop` to stop ghost (or will stop when shutting down workstation)
* `ghost log` to view the logs

### Live reload for theme development

Use live reload during theme development to immediately see changes reflected

* create basic theme stub (as per docs)
   - `index.hbs` - template for a list of posts - minimally requires `{{ghost_head}}` and `{{ghost_foot}}` in it (these directives insert ghost specific javascript at the end of the head and end of the body to spam your blog with ga etc)
   - `post.hbs` - template for a post - minimally requires `{{ghost_head}}` and `{{ghost_foot}}` in it
   - `package.json` - containing valid minimal metadata about your theme
   - places files in [ghost-install-dir]/content/themes/[your-theme-name]
* switch to your new theme using ghost admin - pages will be blank
* `ghost stop`
* `npm install -g nodemon@latest`
* Start ghost using nodemon: `nodemon current/index.js --watch content/themes/[your-theme-name]` (you need to have already switched to your theme via ghost admin - this just simply watches the files and reloads the site if they change)

### Themes

https://themes.ghost.org/docs

### Push theme changes to remote Ghost blog using git push

A git remote can be set up to push local changes straight to a server via ssh.

1. Initialize a git repo inside your theme directory
2. Add remote to your server using ssh e.g. git remote add deploy ssh://me@100.10.9.8/opt/pod/repos/myapp.git
















