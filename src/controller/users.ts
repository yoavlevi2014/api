import UserModel from "@models/user";
import { RequestHandler } from "express";

// All these routes could do with being a bit more typescripty
class UserController {

    /**
     * @openapi
     * /users:
     *   get:
     *     description: Retrieves all user accounts from the database
     *     responses:
     *       200:
     *         description: Returns a JSON array of all the users in the databse
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

}



export default UserController;
