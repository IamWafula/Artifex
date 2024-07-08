


const API = {
    getAllPosts : async ()=> {
        const url = `${import.meta.env.VITE_BACKEND_URL}/posts/`

        let options = {
            method: "GET",
            headers: {
                'accept': 'application/json',
                "Content-Type": "application/json",
            }
        }

        const response = await fetch(url, options)
        const resJson = await response.json()
        console.log(resJson)
        return resJson
    },

}

export default API;
