import UserModel from "@models/user";
import { RequestHandler } from "express";

// All these routes could do with being a bit more typescripty
class UserController {

    // TODO Add unauthorised 401 to the documentation

    /**
     * @openapi
     * /users:
     *   get:
     *     description: Retrieves all user accounts from the database
     *     responses:
     *       200:
     *         description: Returns a JSON array of all the users in the database
     *       500:
     *          description: Internal server error
     */
    public static getAllUsers: RequestHandler = async (_req, res) => {

       await UserModel.find({}).then(async (users) => {

            return res.json(users).status(200);

       }).catch((error: Error) => {

            // TODO handle this shit
            // maybe it handles itself idk
            // either way this seems to throw a 500 if it breaks so thats great i guess
            throw error;

        });

    };


    /**
     * @openapi
     * /users/id/:id:
     *   get:
     *     description: Retrieves a single user account based on a supplied user id
     *     responses:
     *       200:
     *         description: Returns a user from the database
     *       404:
     *          description: User not found
     *       500:
     *          description: Internal server error
     */
     public static getUserByID: RequestHandler = async (_req, res) => {
        
        const id = _req.params.id;
        
        // validate id

        // TODO investigate if this needs to be id not _id 
        await UserModel.findOne({_id: id}).then(async (user) => {

            if (user == null) {

                return res.status(404).json({error: "User not found"});

            } else {

                return res.status(200).json(user);

            }
 
        }).catch((error: Error) => {
 
             // TODO handle this shit
             throw error;
 
         });
  
     };

     /**
     * @openapi
     * /users/name/:username:
     *   get:
     *     description: Retrieves a single user account based on a supplied user id
     *     responses:
     *       200:
     *         description: Returns a user from the database
     *       404:
     *          description: User not found
     *       500:
     *          description: Internal server error
     */
      public static getUserByUsername: RequestHandler = async (_req, res) => {

        const username = _req.params.username;
        
        // validate username

        await UserModel.findOne({username: username}).then(async (user) => {

            if (user == null) {

                return res.status(404).json({error: "User not found"});

            } else {

                return res.status(200).json(user);

            }
 
        }).catch((error: Error) => {
 
             // TODO handle this shit
             throw error;
 
         });
  
    };

    /**
     * @openapi
     * /users/friends/request:
     *   post:
     *     description: Sends a friend request from one user to another
     *     need body shit here
     *     responses:
     *       201:
     *         description: Returns a JSON array of all the users in the database
     *       400:
     *         description: Request is missing one or more user
     *       404:
     *         description: One or more of the users in the request doesn't exist
     *       500:
     *          description: Internal server error
     */
     public static sendFriendRequest: RequestHandler = async (req, res) => {

        const to: string = req.body.to;
        const from: string = req.body.from;

        if (!to)
            return res.status(400).json({error: "To user is missing"});

        if (!from)
            return res.status(400).json({error: "From user is missing"});

        

        // Check to user is provided
        // Check from user is provided
        // Check to user exists
        // Check from user exists
        // Not sure if we're storing requests in their own table or as part of the user objects
        // But store is somehow
 
     };

}

// Friends and shit

// ---Friends---

// -GET-
// Number of friends
// List of friends
// List of invites


// -POST-
// Send request
// Accept request
// Decline request
// Remove request
// Remove friend
// Send message


// ---Following---

// -GET-
// Number of following
// List of following
// List of posts from following

// -POST-
// Follow
// Unfollow


// ---Followers---

// -GET-
// Number of followers
// List of followers


export default UserController;
