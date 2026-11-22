import { TextInput } from "../TextInput/TextInput"
import { useEffect, useState } from "react"

export const AuthForm: React.FC = () => {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")


  return <>
    <div><label>Password</label> <TextInput/></div>
  </>
}
