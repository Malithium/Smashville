[![Codacy Badge](https://api.codacy.com/project/badge/Grade/d2e482cf66b74dc9b70244ccba7638b5)](https://www.codacy.com/app/JoshuaPetherick/Smashville?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=Malithium/Smashville&amp;utm_campaign=Badge_Grade)

# Smashville
## Description
Smashville is a tribute game to the Nintendo game Super Smash Bros with inspirations from other classic games, such as Street Fighter 2. Players
will be able to run a local version of our game, or connect to a hosted server, provided by Node.js and Socket.io. Once connected players can
either host an open session for others to join, or connect to an already existing session.

The controls for the game are simple:

Move Left       -   A

Move Right      -   D

Jump            -   Space bar

Double Jump     -   (Double tap) Space bar

Attack Left     -   Left Arrow Key

Attack Right    -   Right Arrow Key

Uppercut        -   Up Arrow Key

Low Blow        -   Down Arrow Key

## How to Install
To run the game itself just head to our hosted link (Provided by Github) at: https://malithium.github.io/Smashville/game/

To host a server then you'll need to install Node.js and npm. These can both be obtained at: https://nodejs.org/en/download/
Once these are installed just follow the instructions below:
-   Clone/Download this git repository.
-   Open your terminal.
-   CD to the cloned/downloaded game folder ("Smashville/game").
-   Type "npm install". Wait until download has finished. This should automatically kick off the next step.
-   Type "npm run server". This will start hosting your server on port 44555.
-   You're good to go!

## Class Documentation
Documentation for both our client side and server side can be found at the links below.

Client: https://malithium.github.io/Smashville/documentation/Client_Documentation/index.html

Server: https://malithium.github.io/Smashville/documentation/Server_Documentation/index.html

# Project Logs
## Kyle Note 20/01/2017
Added in a very basic level and menu system, this needs to be redesigned a bit, the current implementation is very 'crude' but it is a starting 
point to work with. I am also currently unsure how to test it, will look into potential test cases. 

## Joshua Note 03/02/2017
Begun looking into Node.js and Socket.io for networking element of this program. Will begin coding for this sooner rather than later.

## Joshua Note 21/02/2017
Three of our four game stages have been completed, with the fourth stage being working on currently. Once that it done we'll have a successful,
happy to submit version of our game. Onwards we will be working on adding new features, such as Spectating and host commands.


# Task priority list
## Required
-	Github - Kyle Tuckey
-	Player - Joshua Petherick
-	Physic's & Logic - Joshua Petherick
-	Moveset & Stock - Kyle Tuckey
-	Networking - Joshua Petherick

## Not Important
-	Level Loader - Kyle Tuckey (JSON tilemap)
-	Menus - Kyle Tuckey
-	Pixel Art - Kyle Tuckey
-	Media - Kyle Tuckey
-	Music - Joshua Petherick

## Hardly worth considering
-	AI - ?
-	team selection - ?
-	lobby - ? (Technically a menu)

## Characters
-	Joshua nomination - Ferox
-	Kyle nomination - Standard Knight
-	Joshua nomination - Master yi jedi skin
-	Kyle nomination - Lord Joshy
-	Joshua nomination - Small Character
-	Kyle nomination - Destroyer of worlds