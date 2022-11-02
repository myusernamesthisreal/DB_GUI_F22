export class Api {
    // ENTER YOUR EC2 PUBLIC IP/URL HERE
    ec2_url = '';
    // CHANGE THIS TO TRUE IF HOSTING ON EC2, MAKE SURE TO ADD IP/URL ABOVE
    ec2 = false;
    // USE localhost OR ec2_url ACCORDING TO ENVIRONMENT
    url = this.ec2 ? this.ec2_url : 'http://localhost:8000';

    async signup(username, password) {
        const body = { username, password };
        console.log(username, password)
        try {
            const res = await fetch(`${this.url}/users`,
                {
                    method: "POST",
                    body: JSON.stringify(body),
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    }
                })
            return await res.json();
        } catch (e) {
            console.error(e);
            return e;
        }
    }

    async login(username, password) {
        const body = {username, password };
        console.log(username, password)
        try {
            const res = await fetch(`${this.url}/login`,
            {
                method: "POST",
                body: JSON.stringify(body),
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                }

            })
            return await res.json();
        } catch (e) {
            console.error(e);
            return e;
        }
    }

    async checkUser() {
        try {
            const res = await fetch(`${this.url}/users/check`, {
                credentials: "include"
            })
            return await res.json();
        } catch (e) {
            console.error(e);
            return e;
        }
    }

    async logOut() {
        try {
            const res = await fetch(`${this.url}/logout`, {
                method: "POST",
                credentials: "include"
            });
            return await res.json();
        } catch (e) {
            console.error(e)
            return e;
        }
    }

    //to get list of accounts the user is following
    async following() {
        try {
            const res = await fetch(`${this.url}/following`, {
                method: "GET",
                credentials: "include"
            });
            return await res.json();
        } catch (e) {
            console.error(e)
            return e;
        }
    }

    //to get list of accounts following the user
    async followers() {
        try {
            const res = await fetch(`${this.url}/followers`, {
            method: "GET",
            credentials: "include"
        });
        return await res.json();
        } catch (e) {
            console.error(e)
            return e;
        }
    }

    //lets user follow another account
    async follow() {
        try {
            const res = await fetch(`${this.url}/follows`, {
                method: "POST",
                credentials: "include"
            });
            return await res.json();
        } catch (e) {
            console.error(e)
            return e;
        }
    }

    //lets user unfollow another user they are following
    async unfollow() {
        try {
            const res = await fetch(`${this.url}/unfollow`, {
                method: "DELETE",
                credentials: "include"
            });
            return await res.json();
        } catch (e) {
            console.error(e)
            return e;
        }
    }


    // Likes API calls
    //GET number of likes on post
    async likes() {
        try {
            const res = await fetch(`${this.url}/likes`, {
                method: "GET",
                credentials: "include"
            });
            return await res.json();
        } catch (e) {
            console.error(e)
            return e;
        }
    }

    // like a post
    async likes() {
        try {
            const res = await fetch(`${this.url}/likes`, {
                method: "POST",
                credentials: "include"
            });
            return await res.json();
        } catch (e) {
            console.error(e)
            return e;
        }
    }

    // unlike a post
    async likes() {
        try {
            const res = await fetch(`${this.url}/likes`, {
                method: "DELETE",
                credentials: "include"
            });
            return await res.json();
        } catch (e) {
            console.error(e)
            return e;
        }
    }

    // get list of liked posts of a user
    async likes() {
        try {
            const res = await fetch(`${this.url}/likes`, {
                method: "GET",
                credentials: "include"
            });
            return await res.json();
        } catch (e) {
            console.error(e)
            return e;
        }
    }

    // get list of liked posts of current user
    async likes() {
        try {
            const res = await fetch(`${this.url}/likes`, {
                method: "GET",
                credentials: "include"
            });
            return await res.json();
        } catch (e) {
            console.error(e)
            return e;
        }
    }
}