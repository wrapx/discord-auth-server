import { models, Schema, model, Model, Document } from "mongoose";

const schema = new Schema(
    {
        discord: String,
        github: String,
    },
    { timestamps: true }
);

export interface IConnections extends Document<any> {
    discord: string;
    github: string;
    createdAt: Date;
    updatedAt: Date;
}

const connections =
    (models["connections"] as Model<IConnections>) ??
    model<IConnections>("connections", schema);

export default connections;
