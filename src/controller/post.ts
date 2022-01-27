import PostModel from "@models/post";
import { RequestHandler } from "express";

class PostController {

    /**
     * @openapi
     * /posts:
     *   get:
     *     description: Retrieves all posts from the database
     *     responses:
     *       200:
     *         description: Returns a JSON array of all the posts in the database
     *       500:
     *          description: Internal server error
     */
     public static getAllPosts: RequestHandler = async (_req, res) => {

        await PostModel.find({}).then(async (posts) => {
 
             return res.status(200).json(posts);
 
        }).catch((error: Error) => {
 
             // TODO handle this shit
             // maybe it handles itself idk
             // either way this seems to throw a 500 if it breaks so thats great i guess
             throw error;
 
         });
 
     };
 
 
     /**
      * @openapi
      * /posts/id/:id:
      *   get:
      *     description: Retrieves all the posts created by a user with a provided user id
      *     responses:
      *       200:
      *         description: Returns a JSON array  of all the posts created by a user with the provided user id
      *       404:
      *          description: User not found
      *       500:
      *          description: Internal server error
      */
      public static getPostsByID: RequestHandler = async (_req, res) => {
         
         const id = _req.params.id;
         
         // validate id
 
         await PostModel.find({user_id: id}).then(async (posts) => {
 

            // Might need to check for an empty array if the user hasn't made any posts
             if (posts == null) {
 
                 return res.status(404).json({error: "User not found"});
 
             } else {
 
                 return res.status(200).json(posts);
 
             }
  
         }).catch((error: Error) => {
  
              // TODO handle this shit
              throw error;
  
          });
   
      };
 
    //   /**
    //   * @openapi
    //   * /posts/name/:username:
    //   *   get:
    //   *     description: Retrieves a single user account based on a supplied user id
    //   *     responses:
    //   *       200:
    //   *         description: Returns a user from the database
    //   *       404:
    //   *          description: User not found
    //   *       500:
    //   *          description: Internal server error
    //   */
    //    public static getPostsByUsername: RequestHandler = async (_req, res) => {
 
    //      const username = _req.params.username;
         
    //      // validate username
 
    //      // This is going to need a bit more work than i thought
    //      // We need to get the user first (in order to get their user id) then get the 
    //      await PostModel.find({username: username}).then(async (posts) => {
 
    //         // Might need to check for an empty array if the user hasn't made any posts
    //          if (posts == null) {
 
    //              return res.status(404).json({error: "User not found"});
 
    //          } else {
 
    //              return res.status(200).json([posts]);
 
    //          }
  
    //      }).catch((error: Error) => {
  
    //           // TODO handle this shit
    //           throw error;
  
    //       });
   
    //   };

}

export default PostController;