# ChildAdvocacy
Web Application for the Child Advocacy center https://cacrutherford.org/

## Team Members
> Development is divided into two sub-projects with heavy cross-development between team members.

Spencer Arnold <br/>
Bryce Taylor <br/>
Hyeji Oh <br/>
Kiran Patel <br/>
Munayfah Albaqami <br/>
Sophie McIntyre <br/>
Tamhid Chowdhury <br/>
Tristan Hall <br/>

## Project 1:
Re-building landing page from the ground up.

## Project 2:
Building an app portal for case management.

## How repo was setup:


In this repo, I created a Readme.md, uploaded a .gitignore, and created two empty projects within the src/ folder.

Within the src/ folder, I ran the command

> dotnet new web

Which creates a new empty Asp.net core project. Then I ran the command

> npx create-react-app cacportal

Which creates a folder and initializes a create-react-app project. Create-react-app contains some boilerplate code and tooling that can help us get started building the frontend for the app portal. Read more about create-react-app [here](https://reactjs.org/docs/create-a-new-react-app.html).

This folder is in the same folder as the asp.net core source files, because we will directly reference it to serve up our (html, css, and js) to the clients web browser when they create it.

As for the landing page website, we can do this multiple ways... we can serve up an index.html with css and js attached... to be discussed later.


## Setting up the development environment:
Before you set up the development environment, you can check out the [Resources.md File](/Resources.md) for resources and references on the technologies we will use in this project.

#### Tooling: 
These are the four main toolsets that we will be using to develop the frontend and backend.
0) Git
1) Visual Studio Code
2) .NET core SDK
3) Node.js (which gives us npx and npm)
4) MySql tooling

#### OS:
For this environment, you need to be running one of these operating systes:
1) Windows 10, Mac OSX, or Linux

#### Installing Git vcs
This is what we are using for version control! https://git-scm.com/book/en/v2/Getting-Started-Installing-Git

#### Installing Node.js
This will give us everything we need to develop our React stuff with ease. (we are using CRA).
https://nodejs.org/en/download/

#### Installing .NET core SDK:
This will give us the .NET Core CLI, .NET Core libraries and runtime, and the dotnet driver.
https://dotnet.microsoft.com/download

#### Installing Visual Studio Code and Extension:
1) Install [Visual Studio Code](https://code.visualstudio.com/), which is a cross platform and open source code editor.
2) Install required extension: **C# for Visual Studio Code (powered by OmniSharp).** `ms-dotnettools.csharp`
      1) Open VSCode and on the left hand menu, click the fourth button down. This is the extensions manager.
      2) In the search bar, type C#. Click on the first result. It should have over 8 million downloads and be published by Micrsoft. 
      3) Then click install. You may have to reboot visual studio code as prompted.
3) Github integration with VS Code extension:
      GitHub Pull Requests and Issues by GitHub
      https://code.visualstudio.com/docs/editor/github

#### Installing and setting up MySql
> --Note that if you are only developing the landing page, you won't need to perform this step.--
1) Install [MySql Community Server](https://dev.mysql.com/downloads/windows/installer/8.0.html). This is the database engine.
      1) Follow the default setup screens, which will install the core code and dependencies. Just go with the default configuration settings.
      2) When you get to the root password setup screen, enter one that you will remember. This is critical for setup. 
      3) Continue the setup with defaults.
2) Install [MySql Workbench](https://dev.mysql.com/downloads/workbench/). This is the gui that will make it easy for us to manage the database.
      1) Follow the default setup screens and install.
3) Setting up the database:
      1) Open MySqlWorkBench
      2) On the homescreen, you should see your database engine instance under the "MySQL Connections" section. Click it.
      3) It should prompt you for the password you created in the installation process. Enter that password under the root account.
      4) Once you are logged in, in the left hand menu, click on "Users and Privileges"
      5) The toward the bottom of the screen, click on "Add Account". We are about to create the account that our backend will authenticate to.
      6) In the "Login Name" field, enter `client`
      7) In the "Password" and "Confirm Password" fields, enter `Purpletiger1!`. This will be the development password for the database. This will be changed for production.
      8) Click apply and make sure you can see `client` in the users list.
      The next two steps are under the `users and privileges` screen.
      9) Go into the `client` account and grant it permissions as `DBA` (should be a checkbox under the `administrator roles` tab).
      10) You also need to go to the `login` tab `limit to hosts matching` and type `localhost` in the textbox.
      11) Click `Apply` at the bottom to save changes.
4) Importing the schema:
      1) Note that each time the database schema is updated, you will need to perform these next steps so you have the current schema version.
      2) If you have the repository cloned, in the `MySql_Schema_Export` directory at the root of the repo, you should see a Dump.sql file. This is the file that you can import the most current schema into.
      3) Open MySqlWorkBench.
      4) In the top toolbar, go to the `server` menu and click `Data Import`.
      5) Select `Import from self contained file` radio button and then browse for the dump file in the repository.
      6) By the `Default Target Schema` dropdown, click the `new` button and type in `ChildAdvocacyOLTP`. Then select it from that dropdown.
      7) Click start import. Once it is finished, you should be able to see (in the left hand menu, under the schema tab) the database.
      8) Note that each time the schema is updated, you should be able to import the newest .sql file from that same screen. Once we have a considerable amount of test data in the database, that .sql file can also have the new data and new schema.

### Landing Page Team... getting started! {basic steps}
1) Once the tooling above is installed, continue.
2) Open up a command line of your platform and choice (reccommended powershell on windows)
> git clone https://github.com/spencer741/ChildAdvocacy.git

> cd ChildAdvocacy

> cd src

> cd caclanding

> npm install

> npm start

The above installs dependencies and runs a local (frontend only) development server.
You can find the source files if you then type `cd src`. This is where all of the react source code lives. You can open an editor at this location and start hacking. When you save a change to a file, note that CRA dev hotloads, so your changes will immediately be present in the browser.

You can use npm to install any necessary packages in the `caclanding` project folder.

Currently, the login page and registration page is built. Just keep these links in mind as you are developing :)

### Staff Portal Team... getting started! {basic steps}
1) Once the tooling above is installed, continue.
2) Open up a command line of your platform and choice (reccommended powershell on windows)
> git clone https://github.com/spencer741/ChildAdvocacy.git

> cd ChildAdvocacy

> cd src

> cd caclanding

> npm install

> npm run build

> cd ..

> cd cacportal

> npm install

> npm run build

> cd ..

> dotnet build

> dotnet run

In addition to these items, make sure that your MySql instance is up and running. This is crucial for database operation. If you want to develop the `cacportal` frontend isolated from the backend (which can be very useful for experimenting with UI changes -- since you have hot-loading), type `cd cacportal` and then type `npm start`. It will take a minute for the isolated create-react-app development server to boot, but once it does, it should open the browser and render the app.




