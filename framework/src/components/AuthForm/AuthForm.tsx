import { TextInput } from "../TextInput/TextInput";
import { useState } from "react";

export const AuthForm: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    return (
        <>
            <div>
                <label htmlFor="email">Email</label>
                <TextInput id="email" type="text" value={email} onChange={setEmail} />
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <TextInput id="password" type="password" value={password} onChange={setPassword} />
            </div>
        </>
    );
};
