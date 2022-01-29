import PostModel, { Post } from "@models/post";
import UserModel, { User } from "@models/user";
import { RequestHandler } from "express";
import { v4 as uuidv4 } from "uuid";

// TODO do all the docs for this

class PostController {

    /**
     * THIS NEEDS DOING PROPERLY
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
     * THIS NEEDS DOING PROPERLY
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
    public static getPostsByUser: RequestHandler = async (req, res) => {
         
        // not sure this is type safe (it defo isn't)
        // but it will do for the demo
        //TODO make this type safe
        const user: User = req.body.user as unknown as User;
         
        // validate id
 
        await PostModel.find({"author.id": user.id}).then(async (posts) => {
 

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
 
    // /**
    //  * THIS NEEDS DOING PROPERLY
    // * @openapi
    // * /posts/name/:username:
    // *   get:
    // *     description: Retrieves a single user account based on a supplied user id
    // *     responses:
    // *       200:
    // *         description: Returns a user from the database
    // *       404:
    // *          description: User not found
    // *       500:
    // *          description: Internal server error
    // */
    // public static getPostsByUsername: RequestHandler = async (_req, res) => {
 
    //     const username: string = _req.params.username;
    //     let user_id: string;
         
    //     // validate username

    //     await UserModel.findOne({username: username}).then(async (user) => {

    //         if (user == null) {
 
    //             return res.status(404).json({error: "User not found"});

    //         } else {

    //             user_id = user.id;

    //             await PostModel.find({user_id: user_id}).then(async (posts) => {
 
    //                 // Might need to check for an empty array if the user hasn't made any posts
    //                 if (posts == null) {
         
    //                     // Don't like this
    //                     return res.status(404).json({error: "No posts"});
         
    //                 } else {
         
    //                     return res.status(200).json(posts);
         
    //                 }
          
    //             }).catch((error: Error) => {
          
    //                 // TODO handle this shit
    //                 throw error;
          
    //             });

    //         }

    //     }).catch((error: Error) => {
  
    //         // TODO handle this shit
    //         throw error;

    //     });
   
    // };

    //TODO Get all posts by friends of a user

    //TODO Get all posts by people a user follows

    //TODO Get all posts user has collaborated on

    //TODO Get all posts (sorted by score)

    /**
     * THIS NEEDS DOING PROPERLY
     * @openapi
     * /posts:
     *   post:
     *     description: Creates a new post in the database
     *     responses:
     *       201:
     *         description: New post successfully created
     *         content:
     *           application/json
     *             schema:
     *               type: object
     *                 properties:
     *                    post:
     *                      $ref: '#/components/schemas/Post'
     *               required:
     *                 - 
     *       500:
     *          description: Internal server error
     */
     public static createPost: RequestHandler = async (req, res) => {

        const post: Post = {

            id: uuidv4(),
            author: req.body.author,
            title: req.body.title,
            content: req.body.content,
            likes: 0,
            created: Math.floor(new Date().getTime() / 1000), // UNIX timestamp
            users: [req.body.author]

        }

        // There's probably a better way of doing this but you need to check all properties are defined
        if (!post.author)
            return res.status(400).json({error: "Author is missing"});

        if (!post.title)
            return res.status(400).json({error: "Post title is missing"});

        if (!post.content)
            return res.status(400).json({error: "Post content is missing"});

        
        await UserModel.findOne({id: post.author.id}).then(async (user) => {

            if (user == null) {
    
                return res.status(400).json({error: "Invalid user"});
    
            } else {
    
                await new PostModel({...post}).save().then(async () => {

                    // Return the post object
                    return res.status(201).json(post);  
        
                }).catch((e: Error) => {
        
                    return res.status(500).json({error: e.name});
        
        
                });
    
            }
     
        }).catch((error: Error) => {
     
            // TODO handle this shit
            throw error;
     
        });
 
    };

    //TODO Update post

}

export default PostController;

// Need to create some proper schema for no posts being returned