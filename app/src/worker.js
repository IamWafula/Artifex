

const getImageUrl = async function (id, url) {
    // let url = `${import.meta.env.VITE_BACKEND_URL}/generate/${id}`

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
}

/*
    Function to manually add Image to Firebase storage
*/
async function addImageManually (id, image, user, prompt, url ) {
    // const url = `${import.meta.env.VITE_BACKEND_URL}/generate/upload-firebase`

    let options = {
        method: "POST",
        headers: {
            'accept': 'application/json',
            "Content-Type": "application/json",
        },
        body : JSON.stringify({
            'imageUrl' : image,
            'imageId' : id,
            'imagePrompt' : prompt,
            'userId' : user
        })
    }

    const response = await fetch(url, options)
    const resJson = await response.json()

    return resJson
}




onmessage = async function(e) {
    const generateUrl = e.data.generateUrl;
    const uploadUrl = e.data.uploadUrl;

    const imageId = e.data.id;
    const userId = e.data.userId;
    const prompt = e.data.prompt;
    let imageData = {}
    let generatedData = {}

    let countingTimeout;

    if (e.data.check){
        this.self.postMessage(generatedData)
        return;
    }


    const title = "default Title";

    const options = {
        body: 'Default message',
        icon: 'icon-url.png',
        badge: 'badge-icon-url.png'
    };

    if (imageData.id){
        this.self.postMessage(imageData)
        return;
    }


    const data = await getImageUrl(imageId, generateUrl);
    self.postMessage(data);


    if (data.wait_time > 0) {
        this.clearInterval(countingTimeout)
        countingTimeout = this.setTimeout(()=> {
            this.self.postMessage(e.data)
        }, [parseInt(data.wait_time)*1200])

    } else if (data.generations){

        if (data.generations.length > 0){

            const tempData = {
                'id' : data.generations[0].id,
                'genId': generatedData.genId? generatedData.genId : imageData.id,
                'imgUrl' : data.generations[0].img,
                'userId' : userId,
                'prompt' : prompt
            }

            generatedData = ({...data.generations[0], ...tempData})

            this.postMessage(generatedData)

            const image = await addImageManually(generatedData.id, generatedData.img, userId, generatedData.prompt, uploadUrl)

            imageData = image;


            this.postMessage(image)
        }

    }

};
