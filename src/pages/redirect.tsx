import { signIn, useSession } from "next-auth/client";

export default function Redirect() {
    const [sess, loading] = useSession();

    if (!sess && !loading) signIn("discord");

    return <div>Authentication complete. You can close this page.</div>;
}
