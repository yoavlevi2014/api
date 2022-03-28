import EventSchema from "@schemas/event";
import { model } from "mongoose";
import { User } from "./user";

export interface Event {
    id: string,
    user: User,
    message: string,
    created: number
};

const EventModel = model<Event>("events", EventSchema);

export default EventModel;