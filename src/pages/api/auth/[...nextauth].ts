import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import fetch from "node-fetch";
import mongoose from "mongoose";
import connectionsModel from "../../../models/connections";

export default NextAuth({
    providers: [
        Providers.Discord({
            clientId: process.env.DISCORD_ID,
            clientSecret: process.env.DISCORD_SECRET,
            scope: "identify connections",
        }),
    ],
    events: {
        async signIn({ user, account }) {
            const connections: {
                type: string;
                id: string;
                name: string;
                visibility: number;
                show_activity: boolean;
                verified: boolean;
            }[] = await (
                await fetch(
                    "https://discord.com/api/v9/users/@me/connections",
                    {
                        headers: {
                            Authorization: `Bearer ${account.accessToken}`,
                        },
                    }
                )
            ).json();

            const github = connections.find((e) => e.type === "github");

            if (!github) return;

            try {
                await mongoose.connect(process.env.MONGODB_URI, {
                    useUnifiedTopology: true,
                    useFindAndModify: false,
                    useCreateIndex: true,
                    useNewUrlParser: true,
                });

                await connectionsModel.findOneAndUpdate(
                    {
                        discord: user.id,
                    },
                    {
                        discord: user.id as string,
                        github: github.id,
                    },
                    {
                        upsert: true,
                    }
                );
            } catch {
                return;
            } finally {
                await mongoose.disconnect();
            }
        },
    },
});
