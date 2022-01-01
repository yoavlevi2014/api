# Drawdojo backend

## WIP readme

Libraries used

   - [x] Swagger (/docs)
   - [x] Express ( server )
   - [] Jest ( unit testing )
   - [] Mocha ?
   - [] Chai ?

## Quick start

1. Install docker ( <https://www.docker.com/get-started> )
2. install vscode ( <https://code.visualstudio.com/> )
3. Fork repo
4. Clone your fork `git clone https://github.com/artcollab/api`
5. Open in vscode, install the remote development extention ( <https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack> )
6. Open the cloned repo in vscode
7. In windows/linux press `ctrl+shift+p`, macos `command+shift+p` a menu will pop up, type `Remote-containers: Open folder in container` and press enter. Now docker will build the container for you and open it.
8. The api should auto start on port "8080", and mongo on port "27017"
9. If you need to restart the back end simply open a terminal in the container and type `npm run dev`

## Folders, files, and their purpose

| Name                   | Location            | Type   | Note                                                    |
| ---------------------- | ------------------- | ------ | ------------------------------------------------------- |
| .devcontainer          | /                   | folder | VS code docker container for development                |
| devcontainer.json      | .devcontainer       | file   | Confrigation file for container startup                 |
| docker-compose-dev.yml | .devcontainer       | file   | Configration file for building containers               |
| mongo.env              | .devcontainer and / | file   | DB container enviroment variables                       |
| node.env               | .devcontainer and / | file   | nodejs container enviroment variables                   |
| src                    | /                   | folder | type script source code                                 |
| models                 | /src/               | folder | contains all type interfaces                            |
| services               | /src/               | folder | contains services for CRUD(interacts with DB container) |
| controller             | /src/               | folder | contains routes and responses                           |
| tsoa                   | /src/               | folder | contains built routes and swagger's config file         |
| index                  | /src/               | file   | express app                                             |
| .eslintrc              | /                   | file   | eslint config file                                      |
| tsconfig.json          | /                   | file   | typescript config file                                  |
| docker-compose.yml     | /                   | file   | docker containers production config file                |
| \*ignore               | /                   | files  | Ignores files from being commited/linted                |
| package.json           | /                   | file   | nodejs project config file                              |
| tsoa.json              | /                   | file   | tsoa config file                                        |
