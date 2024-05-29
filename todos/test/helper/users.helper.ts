import axios from "axios"


export class Users {

    constructor(private uri: string) { 
        this.uri = uri
    }

    public async createUser(user: any): Promise<any> {
        return (await axios.post(`${this.uri}/users/v1/`, user))?.data?.data
    }

    public async loginUser(user: any): Promise<any> {
        return (await axios.post(`${this.uri}/users/v1/auth/login`, user))?.data?.data
    }

    public async deleteUser(id: string, token: string) {
        return (await axios.delete(`${this.uri}/users/v1/${id}`, { headers: { Authorization: `Bearer ${token}` } }))?.data?.data
    }

}