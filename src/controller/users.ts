import FriendRequestModel from "@models/friend_request";
import UserModel, { User } from "@models/user";
import { FriendRequest } from "@models/friend_request";
import { v4 as uuidv4 } from "uuid";
import { RequestHandler } from "express";
import PostModel, { Post } from "@models/post";
import CanvasRequestModel, { CanvasRequest } from "@models/canvas_request";
import jwt from "jsonwebtoken";
import { logEvent } from "@helpers/eventLogger";
import EventModel from "@models/event";

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
        await UserModel.findOne({ id: id }).then(async (user) => {

            if (user == null) {

                return res.status(404).json({ error: "User not found" });

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

        await UserModel.findOne({ username: username }).then(async (user) => {

            if (user == null) {

                return res.status(404).json({ error: "User not found" });

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
            return res.status(400).json({ error: "To user is missing" });

        if (!from)
            return res.status(400).json({ error: "From user is missing" });

        if (to === from)
            return res.status(403).json({ error: "Cannot send friend request to yourself" });


        // Check "to" user is a valid user
        await UserModel.findOne({ username: to }).then(async (toUser) => {

            if (toUser == null) {

                return res.status(404).json({ error: "To user not found" });

            } else {

                // Check "from" user is a valid user
                await UserModel.findOne({ username: from }).then(async (fromUser) => {

                    if (fromUser == null) {

                        return res.status(404).json({ error: "From user not found" });

                    } else {

                        // Not sure if i can check an optional property like this lol
                        if (toUser.friends?.includes(fromUser.username)) {

                            return res.status(400).json({ error: "Users are already friends" });

                        } else {

                            // Still need to handle situations where both uses send a friend request to each other
                            await FriendRequestModel.findOne({ to_user: to, from_user: from }).then((async (request) => {

                                if (request == null) {

                                    const request: FriendRequest = {

                                        request_id: uuidv4(),
                                        to_user: to,
                                        from_user: from,
                                        status: "pending"

                                    };

                                    await new FriendRequestModel({ ...request }).save().then(async () => {

                                        logEvent(fromUser, `${from} just sent a friend request to ${to}`);

                                        return res.status(201).json(request);

                                    }).catch((e: Error) => { return res.status(500).json({ error: e.name }); });

                                } else {

                                    return res.status(403).json({ error: "Request already exists" });

                                }

                            })).catch((error: Error) => { throw error });

                        }

                    }

                }).catch((error: Error) => { throw error });

            }

        }).catch((error: Error) => { throw error });

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
    * /users/friends/:user:/requests:
    *   get:
    *     description: Retrieves all friend requests a user is involved with from the database
    *     responses:
    *       200:
    *         description: Returns a JSON array of all the friend requests that involve a user
    *       500:
    *          description: Internal server error
    */
    public static getAllUsersFriendRequests: RequestHandler = async (req, res) => {

        const username: string = req.params.user;

        if (username == null) {

            return res.status(400).json({ error: "User missing" });

        } else {

            await UserModel.findOne({ username: username }).then(async (user) => {

                if (user == null) {

                    return res.status(404).json({ error: "User doesn't exist" });

                } else {

                    await FriendRequestModel.find({ $or: [{ to_user: username }, { from_user: username }] }).then(async (requests) => {

                        return res.json(requests).status(200);

                    }).catch((error: Error) => { throw error; });

                }

            });

        }

    };

    /**
    * @openapi
    * /users/friends/:user:/requests/to:
    *   get:
    *     description: Retrieves all friend requests sent to a user from the database
    *     responses:
    *       200:
    *         description: Returns a JSON array of all the friend requests sent to a user
    *       500:
    *          description: Internal server error
    */
    public static getAllUsersToFriendRequests: RequestHandler = async (req, res) => {

        const username: string = req.params.user;

        if (username == null) {

            return res.status(400).json({ error: "User missing" });

        } else {

            await UserModel.findOne({ username: username }).then(async (user) => {

                if (user == null) {

                    return res.status(404).json({ error: "User doesn't exist" });

                } else {

                    await FriendRequestModel.find({ to_user: username }).then(async (requests) => {

                        return res.json(requests).status(200);

                    }).catch((error: Error) => { throw error; });

                }

            });

        }

    };

    /**
    * @openapi
    * /users/friends/:user:/requests/from:
    *   get:
    *     description: Retrieves all active friend requests a user has sent from the database
    *     responses:
    *       200:
    *         description: Returns a JSON array of all the active friend requests sent by a user
    *       500:
    *          description: Internal server error
    */
    public static getAllUsersFromFriendRequests: RequestHandler = async (req, res) => {

        const username: string = req.params.user;

        if (username == null) {

            return res.status(400).json({ error: "User missing" });

        } else {

            await UserModel.findOne({ username: username }).then(async (user) => {

                if (user == null) {

                    return res.status(404).json({ error: "User doesn't exist" });

                } else {

                    await FriendRequestModel.find({ from_user: username }).then(async (requests) => {

                        return res.json(requests).status(200);

                    }).catch((error: Error) => { throw error; });

                }

            });

        }

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
            return res.status(400).json({ error: "Request id is missing" });

        await FriendRequestModel.findOne({ request_id: request_id }).then(async (request) => {

            if (request == null) {

                return res.status(404).json({ error: "Request not found" });

            } else {

                await UserModel.findOne({ username: request.to_user }).then(async (to) => {

                    if (to == null) {

                        // This should never ever happen
                        return res.status(404).json({ error: "A user that should exist doesn't exist" });

                    } else {

                        await UserModel.findOne({ username: request.from_user }).then(async (from) => {

                            if (from == null) {

                                // This should never ever happen
                                return res.status(404).json({ error: "A user that should exist doesn't exist" });

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

                                            logEvent(to, `${to.username} just became friends with ${from.username}`);

                                            return res.status(200).json({ message: "success" });

                                        }).catch((e: Error) => { return res.status(500).json({ error: e.name }); });

                                    }).catch((e: Error) => { return res.status(500).json({ error: e.name }); });

                                }).catch((e: Error) => { return res.status(500).json({ error: e.name }); });

                            }

                        });

                    }

                });

            }

        }).catch((error: Error) => { throw error; });

    }

    /**
   * @openapi
   * /users/friends/requests/cancel:
   *   post:
   *     description: Cancel a friend request
   *     responses:
   *       200:
   *         description: Friend request successfully cancelled
   *       400:
   *         description: Request id missing
   *       404:
   *         description: Request not found
   *       500:
   *         description: Internal server error
   */
    public static cancelFriendRequest: RequestHandler = async (req, res) => {

        // Check all parameters are there
        // Check friend request is real
        // Remove friend request from database

        const request_id: string = req.params.request_id;

        if (!request_id)
            return res.status(400).json({ error: "Request id is missing" });

        await FriendRequestModel.findOne({ request_id: request_id }).then(async (request) => {

            if (request == null) {

                return res.status(404).json({ error: "Request not found" });

            } else {

                await request.remove().then(async () => {

                    return res.status(200).json({ message: "success" });

                }).catch((e: Error) => { return res.status(500).json({ error: e.name }); });

            }

        }).catch((error: Error) => { throw error; });

    }

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

            return res.status(400).json({ error: "Too few characters supplied" });

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

    public static editBio: RequestHandler = async (req, res) => {
        const bio = req.body.bio;
        const user_id = req.body.user_id;

        if (!user_id) {
            return res.status(400).json({ error: "User ID is missing" });
        }

        await UserModel.findOne({ id: user_id }).then(async (user) => {
            if (!user) {
                return res.status(400).json({ error: "No user found" });
            } else {
                user.bio = bio ?? "";

                await user.save().then(async () => {

                    logEvent(user, `${user.username} just updated their bio`);

                    return res.status(201).json(user);
                })
                    .catch((e: Error) => {
                        return res.status(500).json({ error: e.name });
                    });
            }
        })
    };

    /**
     * @openapi
     * /users/canvas/request:
     *   post:
     *     description: Sends a canvas request from one user to another
     *     body:
     *       to: username of recipient
     *       from: username of sender
     *       size: size of canvas
     *       roomID: id of socket io room
     *     responses:
     *       201:
     *         description: Returns canvas request object
     *       400:
     *         description: Request is missing one or more user
     *       403:
     *         description: There is an error with your request
     *       404:
     *         description: One or more of the users in the request doesn't exist
     *       500:
     *          description: Internal server error
     */
    public static sendCanvasRequest: RequestHandler = async (req, res) => {

        const to: string = req.body.to;
        const from: string = req.body.from;
        const size: string = req.body.size;
        const roomID: string = req.body.roomID;

        if (!to)
            return res.status(400).json({ error: "To user is missing" });

        if (!from)
            return res.status(400).json({ error: "From user is missing" });

        if (to === from)
            return res.status(403).json({ error: "Cannot send canvas request to yourself" });

        if (!size)
            return res.status(400).json({ error: "canvas size is missing" });

        if (!roomID)
            return res.status(400).json({ error: "room ID is missing" });


        // Check "to" user is a valid user
        await UserModel.findOne({ username: to }).then(async (toUser) => {

            if (toUser == null) {

                return res.status(404).json({ error: "To user not found" });

            } else {

                // Check "from" user is a valid user
                await UserModel.findOne({ username: from }).then(async (fromUser) => {

                    if (fromUser == null) {

                        return res.status(404).json({ error: "From user not found" });

                    } else {

                        await CanvasRequestModel.findOne({ to_user: to, from_user: from }).then((async (request) => {

                            if (request == null) {

                                const request: CanvasRequest = {
                                    request_id: uuidv4(),
                                    to_user: to,
                                    from_user: from,
                                    status: "pending",
                                    size: size,
                                    roomID: roomID
                                };

                                await new CanvasRequestModel({ ...request }).save().then(async () => {

                                    logEvent(fromUser, `${fromUser.username} just sent a canvas request to ${toUser.username} `);

                                    return res.status(201).json(request);

                                }).catch((e: Error) => { return res.status(500).json({ error: e.name }); });

                            } else {

                                return res.status(403).json({ error: "Request already exists" });

                            }

                        })).catch((error: Error) => { throw error });

                    }

                }).catch((error: Error) => { throw error });

            }

        }).catch((error: Error) => { throw error });

    };

    /**
    * @openapi
    * /users/canvas/request/accept:
    *   post:
    *     description: Accept a canvas request
    *     responses:
    *       200:
    *         description: request is returned
    *       404: 
    *         description: request not found
    *       500:
    *         description: Internal server error
    */
    public static acceptCanvasRequest: RequestHandler = async (req, res) => {

        const request_id: string = req.params.request_id;

        if (!request_id)
            return res.status(400).json({ error: "Request id is missing" });

        await CanvasRequestModel.findOne({ request_id: request_id }).then(async (request) => {

            if (request == null) {

                return res.status(404).json({ error: "Request not found" });

            } else {

                await UserModel.findOne({ username: request.to_user }).then(async (to) => {

                    if (to == null) {

                        // This should never ever happen
                        return res.status(404).json({ error: "A user that should exist doesn't exist" });

                    } else {

                        await UserModel.findOne({ username: request.from_user }).then(async (from) => {

                            if (from == null) {

                                // This should never ever happen
                                return res.status(404).json({ error: "A user that should exist doesn't exist" });

                            } else {

                                await request.remove().then(async () => {

                                    logEvent(to, `${to.username} just accepted a canvas request from ${from.username}`);

                                    return res.status(200).json(request);

                                }).catch((e: Error) => { return res.status(500).json({ error: e.name }); });

                            }

                        });

                    }

                });

            }

        }).catch((error: Error) => { throw error; });

    }

    /**
    * @openapi
    *   /users/canvas/request/cancel:
    *   post:
    *     description: Cancel a canvas request
    *     responses:
    *       200:
    *         description: Canvas request successfully cancelled
    *       400:
    *         description: Request id missing
    *       404:
    *         description: Request not found
    *       500:
    *         description: Internal server error
    */
    public static cancelCanvasRequest: RequestHandler = async (req, res) => {

        const request_id: string = req.params.request_id;

        if (!request_id)
            return res.status(400).json({ error: "Request id is missing" });

        await CanvasRequestModel.findOne({ request_id: request_id }).then(async (request) => {

            if (request == null) {

                return res.status(404).json({ error: "Request not found" });

            } else {

                await request.remove().then(async () => {

                    return res.status(200).json({ message: "success" });

                }).catch((e: Error) => { return res.status(500).json({ error: e.name }); });

            }

        }).catch((error: Error) => { throw error; });

    }

    /**
    * @openapi
    * /users/canvas/:user:/request/to:
    *   get:
    *     description: Retrieves all canvas requests sent to a user from the database
    *     responses:
    *       200:
    *         description: Returns a JSON array of all the canvas requests sent to a user
    *       500:
    *          description: Internal server error
    */
    public static getAllUsersToCanvasRequests: RequestHandler = async (req, res) => {

        const username: string = req.params.user;

        if (username == null) {

            return res.status(400).json({ error: "User missing" });

        } else {

            await UserModel.findOne({ username: username }).then(async (user) => {

                if (user == null) {

                    return res.status(404).json({ error: "User doesn't exist" });

                } else {

                    await CanvasRequestModel.find({ to_user: username }).then(async (requests) => {

                        return res.json(requests).status(200);

                    }).catch((error: Error) => { throw error; });

                }

            });

        }
    }

    public static removeUser: RequestHandler = async (req, res) => {
        const user_id = req.body.user_id;
        const username = req.body.username;

        // user can add either user ID or username as the body, if both are empty, throw error
        if (!user_id && !username) {
            return res.status(400).json({ error: "User ID or Username is missing" });
        }

        const at = req.headers.authorization?.split(' ')[1];

        if (at) {
            await jwt.verify(
                at,
                process.env.SEED as string,
                async (err, token) => {
                    if (err || !token) {
                        return res.status(403).json({ error: "Error verifying token" });
                    }

                    await UserModel.findOne({ id: token.sub }).then(async (user) => {
                        if (!user || !user.admin) {
                            return res.status(403).json({ error: "Invalid user" });
                        } else {

                            // route defaults to using user_id if both params are present
                            if (user_id) {

                                await UserModel.findOne({ id: user_id }).then(async (user) => {
                                    if (!user) {
                                        return res.status(400).json({ error: "No user found" });
                                    } else {
                                        // find posts made by this user and remove them
                                        await PostModel.find({ author: user }).then(async (posts) => {
                                            posts.map(async (post) => {
                                                await post.remove()
                                                    .catch((e: Error) => { return res.status(500).json({ error: e.name }); })
                                            })
                                        }).catch((e: Error) => { return res.status(500).json({ error: e.name }); })

                                        // remove user
                                        await user.remove().then(async () => {
                                            return res.status(200).json({ message: "Success removing user" });
                                        }).catch((e: Error) => { return res.status(500).json({ error: e.name }); });
                                    }
                                })

                            } else {
                                await UserModel.findOne({ username: username }).then(async (user) => {
                                    if (!user) {
                                        return res.status(400).json({ error: "No user found" });
                                    } else {
                                        // find posts made by this user and remove them
                                        await PostModel.find({ author: user }).then(async (posts) => {
                                            posts.map(async (post) => {
                                                await post.remove()
                                                    .catch((e: Error) => { return res.status(500).json({ error: e.name }); })
                                            })
                                        }).catch((e: Error) => { return res.status(500).json({ error: e.name }); })

                                        // remove user
                                        await user.remove().then(async () => {
                                            return res.status(200).json({ message: "Success removing user" });
                                        }).catch((e: Error) => { return res.status(500).json({ error: e.name }); });
                                    }
                                })
                            }

                        }
                    })
                }
            )
        }
    };

    public static getProfile: RequestHandler = async (req, res) => {
        const profileID = req.params.profile_id;
        let body: { user: User, posts?: Array<Post> };

        if (!profileID) {
            return res.status(400).json({ error: "missing profile ID" });
        }

        await UserModel.findOne({ profileID: profileID }).then(async (user) => {

            if (!user) {
                return res.status(400).json({ error: "User not found" });
            } else {

                await PostModel.find({ "author.id": user.id }).then(async (posts) => {
                    console.log(posts);

                    // Might need to check for an empty array if the user hasn't made any posts
                    if (posts == null) {

                        body = {
                            user: user,
                        };

                        return res.status(200).json(body);

                    } else {

                        body = {
                            user: user,
                            posts: posts
                        }
                        return res.status(200).json(body);

                    }

                }).catch((error: Error) => {

                    throw error;

                });

            }

        })
    }

    public static fetchNewEvents: RequestHandler = async (req, res) => {
        const at = req.headers.authorization?.split(' ')[1];

        if (at) {
            await jwt.verify(
                at,
                process.env.SEED as string,
                async (err, token) => {
                    if (err || !token) {
                        return res.status(403).json({ error: "Error verifying token" });
                    }

                    await UserModel.findOne({ id: token.sub }).then(async (user) => {
                        if (!user || !user.admin) {
                            return res.status(403).json({ error: "Invalid user" });
                        } else {
                            await EventModel.find({}).sort({ 'created': -1 }).then(async (events) => {

                                return res.status(200).json(events);
                
                            }).catch((error: Error) => {
                
                                throw error;
                
                            });
                        }
                    })
                }
            )
        }
    }
}


// Friends and shit

// ---Friends---

// -GET-
// Number of friends
// List of friends
// List of invites - DONE
// List of friend requests - DONE
// List of friend requests involving user - DONE
// List of friend requests sent by user - DONE
// List of friend requests sent to user - DONE



// -POST-
// Send request - DONE
// Accept request - DONE
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
