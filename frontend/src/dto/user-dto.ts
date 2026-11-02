export interface UserDTO {
    id: number,
    email: string,
    userName: string,
    phoneNumber?: string,
    isBanned: boolean,
    createdAt: string,
    roles: string[]
}