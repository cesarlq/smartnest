import { ResponseNewUserI, ResponseuserI } from "./users"

export interface InitialStateAhutI {
    getAuth: {
        status: "idle" | "loading" | "succeeded" | "failed",
        error: null | string
    }
    auth: null | ResponseuserI,

    getregister: {
        status: "idle" | "loading" | "succeeded" | "failed",
        error: null | string
    }
    register: null | ResponseNewUserI,
}