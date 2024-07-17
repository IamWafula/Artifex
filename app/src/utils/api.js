import { addImage } from "./firebase_utils"

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
        return resJson
    },
    getPost : async (postId)=> {
        const url = `${import.meta.env.VITE_BACKEND_URL}/posts/${postId}`

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

    },
    getRecommendations: async (userId) => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/user/recommendations/${userId}`
        let options = {
            method: "GET",
            headers: {
                'accept': 'application/json',
                "Content-Type": "application/json",
            }
        }

        const response = await fetch(url, options)
        const resJson = await response.json()
        return resJson;

    },
    getLiked : async (userId) => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/user/liked/${userId}`
        let options = {
            method: "GET",
            headers: {
                'accept': 'application/json',
                "Content-Type": "application/json",
            }
        }

        const response = await fetch(url, options)
        const resJson = await response.json()
        return resJson;
    },
    addLiked : async (userId, postId) => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/user/liked`
        let options = {
            method: "POST",
            headers: {
                'accept': 'application/json',
                "Content-Type": "application/json",
            },
            body : JSON.stringify({
                userId: userId,
                postId: postId
            })
        }

        const response = await fetch(url, options)
        const resJson = await response.json()
        return resJson;
    },
    removeLiked : async (userId, postId) => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/user/liked`
        let options = {
            method: "DELETE",
            headers: {
                'accept': 'application/json',
                "Content-Type": "application/json",
            },
            body : JSON.stringify({
                userId: userId,
                postId: postId
            })
        }

        const response = await fetch(url, options)
        const resJson = await response.json()
        return resJson;
    },
    addBid : async (items, description, post_id, user_id) => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/bids`

        if (!description || !user_id) { return ;}
        const fullBid = []

        // first uploadImages to Firebase
        for (let i in items){
            const images = items[i]

            const portImages = []

            for (let j in images){
                const image = images[j]
                const newImage = await addImage(image.blob, image.name, user_id)

                portImages.push(newImage)
            }
            fullBid.push(portImages)
        }

        let options = {
            method: "POST",
            headers: {
                'accept': 'application/json',
                "Content-Type": "application/json",
            },
            body : JSON.stringify({
                fullBid,
                description,
                postId: post_id,
                userId : user_id
            })
        }
        const response = await fetch(url, options)
        const resJson = await response.json()

        return resJson;
    }



}

export default API;
