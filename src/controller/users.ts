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
      public static search: RequestHandler = async (req, res) => {

        const query = req.params.query;

        // We can do .length without checking if it exists because the function doesnt run unless a query is provided
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



export default UserController;
