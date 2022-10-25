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
        try{
            const res = await fetch(`${this.url}/users`,
            {
                method: "POST",
                body: JSON.stringify(body),
                headers: {
                    "Content-Type": "application/json",
                }
            })
            return await res.json();
        } catch (e) {
            console.error(e);
            return {success: false}
        }
        

    }
}