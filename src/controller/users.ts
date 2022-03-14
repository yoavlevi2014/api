import FriendRequestModel from "@models/friend_request";
import UserModel from "@models/user";
import { FriendRequest } from "@models/friend_request";
import { v4 as uuidv4 } from "uuid";
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
      public static getUserByUsername: RequestHandler = async (req, res) => {

        const username = req.params.username;
        
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
     *       403:
     *         description: There is an error with your request
     *         need body shit here to explain the various options
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

        if (to === from)
            return res.status(403).json({error: "Cannot send friend request to yourself"});
        

        // Check "to" user is a valid user
        await UserModel.findOne({username: to}).then(async (user) => {

            if (user == null) {

                return res.status(404).json({error: "To user not found"});

            } else {

                // Check "from" user is a valid user
                await UserModel.findOne({username: from}).then(async (user) => {

                    if (user == null) {

                        return res.status(404).json({error: "From user not found"});

                    } else {

                        // Still need to handle situations where both uses send a friend request to each other
                        await FriendRequestModel.findOne({to_user: to, from_user: from}).then((async (request) => {

                            if (request == null) {

                                const request: FriendRequest = {

                                    request_id: uuidv4(),
                                    to_user: to,
                                    from_user: from,
                                    status: "pending"

                                };

                                await new FriendRequestModel({...request}).save().then(async () => {

                                    return res.status(201).json(request);

                                }).catch((e: Error) => {return res.status(500).json({error: e.name});});

                            } else {

                                return res.status(403).json({error: "Request already exists"});
                                
                            }

                        })).catch((error: Error) => {throw error});

                    }
 
                }).catch((error: Error) => {throw error});

            }
 
        }).catch((error: Error) => {throw error});

     };

    /**
    * @openapi
    * /users/friends/requests:
    *   get:
    *     description: Retrieves all friend requests from the database
    *     responses:
    *       200:
    *         description: Returns a JSON array of all the friend request in the database
    *       500:
    *          description: Internal server error
    */
    public static getAllFriendRequests: RequestHandler = async (_req, res) => {
        
        await FriendRequestModel.find({}).then(async (requests) => {
 
             return res.json(requests).status(200);
 
        }).catch((error: Error) => {
 
             // TODO handle this shit
             // maybe it handles itself idk
             // either way this seems to throw a 500 if it breaks so thats great i guess
             throw error;
 
         });
 
     };

     /**
    * @openapi
    * /users/friends/requests/accept:
    *   post:
    *     description: Accept a friend request
    *     responses:
    *       200:
    *         description: 
    *       500:
    *          description: Internal server error
    */
    public static acceptFriendRequest: RequestHandler = async (req, res) => {
        
        // Check all parameters are there
        // Check friend request is real
        // Add both users to each others friend arrays
        // Remove friend request from database

        const request_id: string = req.params.request_id;

        if (!request_id)
            return res.status(400).json({error: "Request id is missing"});

        await FriendRequestModel.findOne({request_id: request_id}).then(async (request) => {
 
            if (request == null) {

                return res.status(404).json({error: "Request not found"});

            } else {

                await UserModel.findOne({username: request.to_user}).then(async (to) => {

                    if (to == null) {

                        // This should never ever happen
                        return res.status(404).json({error: "A user that should exist doesn't exist"});

                    } else {

                        await UserModel.findOne({username: request.from_user}).then(async (from) => {

                            if (from == null) {
        
                                // This should never ever happen
                                return res.status(404).json({error: "A user that should exist doesn't exist"});
        
                            } else {

                                if (to.friends == null) {

                                    to.friends = [from.username];
        
                                } else {
        
                                    to.friends.push(from.username);
        
                                }

                                if (from.friends == null) {

                                    from.friends = [to.username];
        
                                } else {
        
                                    from.friends.push(to.username);
        
                                }
        
                                await to.save().then(async () => {

                                    await from.save().then(async () => {
        
                                        await request.remove().then(async () => {
        
                                            return res.status(200).json({message: "success"});
                                
                                        }).catch((e: Error) => { return res.status(500).json({error: e.name}); });
                            
                                    }).catch((e: Error) => { return res.status(500).json({error: e.name}); });
                        
                                }).catch((e: Error) => { return res.status(500).json({error: e.name}); });
        
                            }
        
                        });

                    }

                });

            }

       }).catch((error: Error) => { throw error; });
 
     };

     /**
     * @openapi
     * /users/search:
     *   get:
     *     description: Searches for usernames in the database and returns up to 4 results
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               query:
     *                 type: string
     *                 description: Partial query used to search the database for matches
     *     responses:
     *       200:
     *         description: Array of users matching the search query (limit of 4)
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 allOf:
     *                   - $ref: '#/components/schemas/User'
     *                 
     *       404:
     *          description: User not found
     *          content:
     *            application/json:
     *              schema:
     *                type: object
     *                properties:
     *                  error:
     *                    type: string
     *                    description: Error message
     *       500:
     *          description: Internal server error
     */
     public static search: RequestHandler = async (_req, res) => {

        const query = _req.body.query;

        if (query.length < 3) {

            return res.status(400).json({error: "Too few characters supplied"});

        }

        // TODO Do some validation on query

        await UserModel.find({ username: { $regex: query, $options: "i" } }).then(async (users) => {

            // Only return best 4 matches
            return res.status(200).json(users.slice(0, 3));
        
        }).catch((error: Error) => {
 
            // TODO handle this shit
            throw error;

        });
  
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
