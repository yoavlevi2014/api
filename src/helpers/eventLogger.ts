import EventModel, { Event } from "@models/event";
import { User } from "@models/user";
import { v4 as uuidv4 } from "uuid";

export async function logEvent(user : User, message : string) {
    const event: Event = {
        id: uuidv4(),
        user: user,
        message: message,
        created: Math.floor(new Date().getTime() / 1000),
    }

    await new EventModel({...event}).save().catch((err) => {
        throw err;
    })
}