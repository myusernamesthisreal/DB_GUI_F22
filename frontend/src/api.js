export class Api {
    // ENTER YOUR EC2 PUBLIC IP/URL HERE
    ec2_url = '';
    // CHANGE THIS TO TRUE IF HOSTING ON EC2, MAKE SURE TO ADD IP/URL ABOVE
    ec2 = false;
    // USE localhost OR ec2_url ACCORDING TO ENVIRONMENT
    url = this.ec2 ? this.ec2_url : 'http://localhost:8000';

    async signup(username, password) {
        const body = { username, password };
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

    async makePost(body, categories) {
        const data = { body, categories };
        try {
            const res = await fetch(`${this.url}/posts`, {
                method: "POST",
                credentials: "include",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                }});
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
            return await res.json();
        } catch (e) {
            console.error(e)
            return e;
        }
    }


    //Follows calls
    //get users current user is following
    async getFollowingCurrent() {
        try {
            const res = await fetch(`${this.url}/users/following`, {
                method: "GET",
                credentials: "include"
            });
            return await res.json();
        } catch (e) {
            console.error(e)
            return e;
        }
    }

    //get users that a given user is following
    async getFollowingGivenID(id) {
        try {
            const res = await fetch(`${this.url}/users/${id}/following`, {
                method: "GET",
                credentials: "include"
            });
            return await res.json();
        } catch (e) {
            console.error(e)
            return e;
        }
    }

    //get users following the current user
    async getFollowersCurrent() {
        try {
            const res = await fetch(`${this.url}/users/followers`, {
                method: "GET",
                credentials: "include"
            });
            return await res.json();
        } catch (e) {
            console.error(e)
            return e;
        }
    }

    //get users following a given user
    async getFollowersGivenID(id) {
        try {
            const res = await fetch(`${this.url}/users/${id}/followers`, {
                method: "GET",
                credentials: "include"
            });
            return await res.json();
        } catch (e) {
            console.error(e)
            return e;
        }
    }

    //follow a user
    async follow(id) {
        try {
            const res = await fetch(`${this.url}/users/${id}/follow`, {
                method: "POST",
                credentials: "include"
            });
            return await res.json();
        } catch (e) {
            console.error(e)
            return e;
        }
    }

    //unfollow a user
    async unfollow(id) {
        try {
            const res = await fetch(`${this.url}/users/${id}/unfollow`, {
                method: "DELETE",
                credentials: "include"
            });
            return await res.json();
        } catch (e) {
            console.error(e)
            return e;
        }
    }

    //mark user as followed/unfollowed
    async patchFollow(id) {
        try {
            const res = await fetch(`${this.url}/users/${id}/follows`, {
                method: "PATCH",
                credentials: "include"
            });
            return await res.json();
        } catch (e) {
            console.error(e)
            return e;
        }
    }

    
    //Repost calls
    //get reposts
    async getReposts(id) {
        try {
            const res = await fetch(`${this.url}/posts/${id}/reposts`, {
                method: "GET",
                credentials: "include"
            });
            return await res.json();
        } catch (e) {
            console.error(e)
            return e;
        }
    }

    //post repost
    async postRepost(id) {
        try {
            const res = await fetch(`${this.url}/posts/${id}/reposts`, {
                method: "POST",
                credentials: "include"
            });
            return await res.json();
        } catch (e) {
            console.error(e)
            return e;
        }
    }

    //un-repost post
    async deleteRepost(id) {
        try {
            const res = await fetch(`${this.url}/posts/${id}/reposts`, {
                method: "DELETE",
                credentials: "include"
            });
            return await res.json();
        } catch (e) {
            console.error(e)
            return e;
        }
    }

    //patch repost
    async patchRepost(id) {
        try {
            const res = await fetch(`${this.url}/posts/${id}/reposts`, {
                method: "PATCH",
                credentials: "include"
            });
            return await res.json();
        } catch (e) {
            console.error(e)
            return e;
        }
    }

    //get a user's reposts
    async getUserReposts(id) {
        try {
            const res = await fetch(`${this.url}/users/${id}/reposts`, {
                method: "GET",
                credentials: "include"
            });
            return await res.json();
        } catch (e) {
            console.error(e)
            return e;
        }
    }

    //get the current user's reposts
    async getCurrentUserReposts() {
        try {
            const res = await fetch(`${this.url}/users/reposts`, {
                method: "GET",
                credentials: "include"
            });
            return await res.json();
        } catch (e) {
            console.error(e)
            return e;
        }
    }

    async getUserPost(id) { //get posts for user id
        try {
            const res = await fetch(`${this.url}/users/${id}/posts`, {
                method: "GET",
                credentials: "include"
            });
            return await res.json();
        } catch (e) {
            console.error(e)
            return e;
        }
    }

    async getUserSaves(id) { //get saved posts for user id
        try {
            const res = await fetch(`${this.url}/users/${id}/saves`, {
                method: "GET",
                credentials: "include"
            });
            return await res.json();
        } catch (e) {
            console.error(e)
            return e;
        }
    }

    async getUserFollowers(id) { //get followers for user id
        try {
            const res = await fetch(`${this.url}/users/${id}/followers`, {
                method: "GET",
                credentials: "include"
            });
            return await res.json();
        } catch (e) {
            console.error(e)
            return e;
        }
    }

    async getUserFollowing(id) { //get following for user id
        try {
            const res = await fetch(`${this.url}/users/${id}/following`, {
                method: "GET",
                credentials: "include"
            });
            return await res.json();
        } catch (e) {
            console.error(e)
            return e;
        }
    }


    //edit post calls
    // edit post
    async patchPost(id) {
        try {
            const res = await fetch(`${this.url}/posts/${id}/edit`, {
                method: "PATCH",
                credentials: "include"
            });
            return await res.json();
        } catch (e) {
            console.error(e)
            return e;
        }
    }
}