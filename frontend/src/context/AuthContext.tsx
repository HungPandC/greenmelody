import { createContext } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { User } from "../types/TypeAuth";


type TypeContext = {
    user : User | null,
    setUser : Dispatch<SetStateAction<User | null>>,
    loading: boolean,
} 
const AuthContext = createContext<TypeContext | null>(null);

export default AuthContext