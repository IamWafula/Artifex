


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
    postNewImage : async (userId, desc) => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/generate`
        let options = {
            method: "POST",
            headers: {
                'accept': 'application/json',
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "prompt" : desc,
                "userId" : userId
            })
        }

        const response = await fetch(url, options)
        return response
    },
    getUserImages : async (userId) => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/images/${userId}`

        let options = {
            method: "GET",
            headers: {
                'accept': 'application/json',
                "Content-Type": "application/json",
            }
        }

        const response = await fetch(url, options)
        const resJson = await response.json()

        // only allow images not tagged in any post
        return resJson.filter((item) => {
            return item.postId == null
        })
    },
    getImageUrl: async (id) => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/generate/${id}`

        let options = {
            method: "GET",
            headers: {
                'accept': 'application/json',
                "Content-Type": "application/json",
            }
        }

        const response = await fetch(url, options)
        const resJson = await response.json()

        return resJson
    },
    uploadImages: async (images, title, desc, category) => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/posts/`
        let options = {
            method: "POST",
            headers: {
                'accept': 'application/json',
                "Content-Type": "application/json",
            },
            body : JSON.stringify({
                images: images,
                title: title,
                description: desc,
                category: category
            })
        }

        await fetch(url, options)

    }



}

export default API;
