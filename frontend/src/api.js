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

    async getPosts() {
        try {
            const res = await fetch(`${this.url}/posts`, {
                method: "GET",
                credentials: "include",
            })
            return await res.json();
        } catch (e) {
            console.log(e)
            return e;
        }
    }
        
    async getUser(id) {
        try {
            const res = await fetch(`${this.url}/users/${id}`, {
                method: "GET",
                credentials: "include"
            });
            return await res.json();
        } catch (e) {
            console.error(e)
            return e;
        }
    }

    //Likes calls
    //like/unlike a post
    async like(id) {
        try {
            const res = await fetch(`${this.url}/posts/${id}/likes`, {
                method: "PATCH",
                credentials: "include"
            });
            return await res.json();
        } catch (e) {
            console.error(e)
            return e;
        }
    }

    //get number of likes on post
    async getLikes(id) {
        try {
            const res = await fetch(`${this.url}/posts/${id}/likes`, {
                method: "GET",
                credentials: "include"
            });
            return await res.json();
        } catch (e) {
            console.error(e)
            return e;
        }
    }

    //get posts liked by a user
    async getLikedPosts(id) {
        try {
            const res = await fetch(`${this.url}/users/${id}/likes`, {
                method: "GET",
                credentials: "include"
            });
            return await res.json();
        } catch (e) {
            console.error(e)
            return e;
        }
    }

    //get posts liked by current user
    async getUserLikedPosts() {
        try {
            const res = await fetch(`${this.url}/users/likes`, {
                method: "GET",
                credentials: "include"
            });
        } catch (e) {
            console.error(e)
            return e;
        }
    }
}