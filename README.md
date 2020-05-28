# Web Development Final Project 
## Authors: Carlos Tamez and José Flores 

This web page purpose is to make a more dynamic experience to a restaurant that has board games. 

#### Reservation
In order to do that the site have a reservation view where you can make your reserve your table with anticipation by filling some info like the number of people that will come with you, and the date when you will visit. 

#### Board Games Selling 
The site will have a board game selling view where you could find games that you played in the restaurant before or that you already know and buy them.

#### Food Menu 
The site will also have a Food Menu view where you can look at the menu and order where you are in the restaurant direct to your table. 

## API endpoints

Note: All api endpoints have a prefix /api/ in the route.

### Authentication

Login and register endpoints return a token which is to be used for authentication.
Token must be sent as a header as a field named sessiontoken.

### Endpoints

* login, register. Method: POST. Used for user authentication
* verify-token: Method: GET. Used to verify if a user is authenticated
* verify-admin: Method: GET. Used to verify if a user has administrative privileges
* games: Method: GET,POST, DELETE, PATCH. Used for game manipulation, user must be authenticated and be an admin, for any method that isn't GET.
* cart: Method: GET, POST, DELETE. User must be authenticated, used to retrieve and manipulate user's cart.
* pay: Method: POST. User must be authenticated, it makes the payment of whatever is in the cart.
* sendmail: Method: POST. Used to contact the owner by sending an email.
* food: Method: GET, POST, PATCH, DELTE. Used to manipulate food from the menu, to change or insert food user must be an admin.
* reservation: Method: GET, POST. Used to manipulate reservations, user must be authenticated to be able to ask for a reservation
* order: Method: GET, POST. Used for in-restaurante service so that a user can order food during his stay.
