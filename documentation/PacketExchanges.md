#Rough Client to Server data exchanges


##Connecting
(client -> server)
-	Username

(server -> client)
-	ID

##Lobby
(client -> server)
-	Character Selection
-	Lobby Messages (Username, Message)

(server -> client)
-	New Lobby Messages (Username, Message)
-	New Opponent Character Selection

##Loading
(server -> client)
-	Map Choice
-	X & Y Position
-	Enemy X & Y Positions

##Playing
(client -> server)
-	Input (W,A,S,D, Space, Up, Left, Down, Right)

(server -> client)
-	X & Y Position (When updated)
-	Enemy X & Y Positions (When updated)



##Storage
Client:
-	Username
-	ID
-	X
-	Y
-	Percentage
-	Enemies[] (Percentage, CharID, X, Y)

Server:
-	Players (IDs, Username, Percentage, CharID, X, Y)
-	LobbyMessages [Username, Messages]
		
