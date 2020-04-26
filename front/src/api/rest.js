import axios from 'axios';

const serverUrl = 'http://localhost:5000'

export const uploadDeckImage = (deckId, imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("id", deckId);

    axios.post(`${serverUrl}/uploadByFile`, formData, {
        headers: {
        'Content-Type': 'multipart/form-data'
        }
    }).then(response => {
        console.log({'response': response.data});
    })
}