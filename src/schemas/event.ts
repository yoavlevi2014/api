import { Event } from "@models/event";
import { Schema } from "mongoose";

const EventSchema = new Schema<Event>(
    {
        id: { type: String, required: true, unique: true, index: true },
        user: { type: Object, required: true, index: true },
        message: { type: String, required: true },
        created: { type: Number, required: true, index: true },
    },
    { timestamps: true }
);

export default EventSchema;