export type User = {
    id: string;
    username: string;
    email: string;
};

export type RouteProps = {
    user: User | null;
    loading: boolean;
};
export type RegisterData = {
    username: string;
    email: string;
    password: string;
    password_again: string;
};
export type ChangePass = {
    oldPassword : string,
    newPassword : string,
    confirmPassword : string,
}