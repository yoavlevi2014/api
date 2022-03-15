import { Comment } from "@models/comment";
import PostModel, { Post } from "@models/post";
import UserModel, { User } from "@models/user";
import { RequestHandler } from "express";
import { v4 as uuidv4 } from "uuid";

class PostController {

    /**
     * @openapi
     * /posts:
     *   get:
     *     parameters:
     *       - in: query
     *         name: sortby
     *         required: false
     *         schema:
     *           type: string
     *           default: new
     *           enum:
     *             - new
     *             - top
     *         description: The order posts are sorted
     *     description: Retrieves all posts from the database
     *     responses:
     *       200:
     *         description: Returns a JSON array of all the posts in the database
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 allOf:
     *                   - $ref: '#/components/schemas/Post'
     * 
     *       401:
     *          description: Unauthorised
     *       500:
     *          description: Internal server error
     * 
     */
    public static getAllPosts: RequestHandler = async (req, res) => {

        let sortingOrder: string = req.params.sortby;

        // If the sorting order isn't supplied or is invalid default it to newest first
        if (sortingOrder != "new" && sortingOrder != "top") {

            sortingOrder = "new";

        }

        // Theres a bit of duplication here but its readable so probably not worth fixing
        if (sortingOrder == "new") {

            await PostModel.find({}).sort({'created': -1}).then(async (posts) => {
 
                return res.status(200).json(posts);
     
            }).catch((error: Error) => {
     
                // TODO handle this shit
                // maybe it handles itself idk
                // either way this seems to throw a 500 if it breaks so thats great i guess
                throw error;
     
            });

        } else {

            await PostModel.find({}).sort({'likes': -1}).then(async (posts) => {
 
                return res.status(200).json(posts);
     
            }).catch((error: Error) => {
     
                // TODO handle this shit
                // maybe it handles itself idk
                // either way this seems to throw a 500 if it breaks so thats great i guess
                throw error;
     
            });

        }
         
    };
 
 
    /**
     * @openapi
     * /posts/user:
     *   get:
     *     description: Retrieves all the posts created by a user
     *     responses:
     *       200:
     *         description: Returns a JSON array of all the posts created by the provided user
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 allOf:
     *                   - $ref: '#/components/schemas/Post'
     *       404:
     *          description: No posts returned
     *       401:
     *          description: Unauthorised
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
 
                return res.status(404).json({error: "No posts returned"});
 
            } else {
 
                return res.status(200).json(posts);
 
            }
  
        }).catch((error: Error) => {
  
            // TODO handle this shit
            throw error;
  
        });
   
    };
 
    // /**
    //  * // TODO THIS NEEDS DOING PROPERLY
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
     * @openapi
     * /posts:
     *   post:
     *     description: Creates a new post in the database
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               author:
     *                 type: User
     *                 description: User object representing the author of the post
     *                 $ref: '#/components/schemas/User'
     *               title:
     *                 type: string
     *                 description: Title of the post
     *                 example: Post title
     *               content:
     *                 type: string
     *                 description: SVG data of the post image
     *                 example: <?xml version=\"1.0\" encoding=\"utf-8\"?><!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\"><svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 1000 1000\" enable-background=\"new 0 0 1000 1000\" xml:space=\"preserve\"><g><path d=\"M881.1,132.5H118.9C59,132.5,10,181.5,10,241.4v517.3c0,59.9,49,108.9,108.9,108.9h762.2c59.9,0,108.9-49,108.9-108.9V241.4C990,181.5,941,132.5,881.1,132.5z M949.2,747.3c0,54.9-24.5,79.4-79.4,79.4H130.3c-54.9,0-79.4-24.5-79.4-79.4V252.7c0-54.9,24.5-79.4,79.4-79.4h739.5c54.9,0,79.4,24.5,79.4,79.4V747.3z M316.3,418.3L418.3,500l265.4-224.6l204.2,183.8v306.3H112.1V581.7L316.3,418.3z M193.8,234.6c-45.1,0-81.7,36.6-81.7,81.7s36.6,81.7,81.7,81.7s81.7-36.6,81.7-81.7S238.9,234.6,193.8,234.6z\"/></g></svg>
     *             required:
     *               - author
     *               - title
     *               - content
     *     responses:
     *       201:
     *         description: New post successfully created
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 post:
     *                   $ref: '#/components/schemas/Post'
     *       400:
     *          description: Request is badly formed
     *       401:
     *          description: Unauthorised
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
            created: Math.floor(new Date().getTime() / 1000),
            users: [req.body.author],
            size: req.body.size
        }

        // There's probably a better way of doing this but you need to check all properties are defined
        if (!post.author)
            return res.status(400).json({error: "Author is missing"});

        if (!post.title)
            return res.status(400).json({error: "Post title is missing"});

        if (!post.content)
            return res.status(400).json({error: "Post content is missing"});

        if (!post.size)
        return res.status(400).json({error: "Post size is missing"});
        
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

    //TODO docs and shit
    public static addComment: RequestHandler = async (req, res) => {

        const comment: Comment = {

            id: uuidv4(),
            author: req.body.author,
            content: req.body.content,
            likes: 0,
            created: Math.floor(new Date().getTime() / 1000), // UNIX timestamp,
            isOnOwnPost: false, // This gets set after checking post and user exists
            post_id: req.body.post_id

        };

        // There's probably a better way of doing this but you need to check all properties are defined
        if (!comment.author)
            return res.status(400).json({error: "Author is missing"});

        if (!comment.content)
            return res.status(400).json({error: "Comment is missing"});

        if (!comment.post_id)
            return res.status(400).json({error: "Post id is missing"});

        await UserModel.findOne({id: comment.author.id}).then(async (user) => {

            if (user == null) {
        
                return res.status(400).json({error: "Invalid user"});
        
            } else {

                await PostModel.findOne({id: comment.post_id}).then(async (post) => {

                    if (post == null) {
                
                        return res.status(400).json({error: "Invalid post"});
                
                    } else {
                
                        // User is commenting on their own post
                        if (comment.author.id == post.author.id) {

                            comment.isOnOwnPost = true;

                        }

                        // Now we need to add the comment
                        if (post.comments == null) {

                            post.comments = [comment];

                        } else {

                            post.comments.push(comment);

                        }

                        await post.save().then(async () => {

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
                
            }
         
        }).catch((error: Error) => {
         
            // TODO handle this shit
            throw error;
         
        });

    }

}

export default PostController;

// Need to create some proper schema for no posts being returned