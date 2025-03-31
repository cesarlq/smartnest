export interface newUserI {
    id: string,
    name: string,
    email: string,
    password: string
  };

export interface ResponseNewUserI {
    success: boolean,
    user: {
        id: string,
        email: string,
        name: string
    },
    token: string
}
export interface ResponseuserI {
  success: boolean,
  user: {
    id: string,
    email: string,
    name: string
  }
}