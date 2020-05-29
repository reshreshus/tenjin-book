import axios from 'axios';

const serverUrl = 'http://localhost:4000'

export const uploadDeckImage = async (deckId, imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);
  formData.append("id", deckId);

  const { data } = await axios.post(`${serverUrl}/uploadByFile`, formData, {
    headers: {
    'Content-Type': 'multipart/form-data'
    }
  });
  return data.file.url;
}

export const deleteImage = async (url) => {
  const { data } = await axios.delete(url);
  return data.status;
}