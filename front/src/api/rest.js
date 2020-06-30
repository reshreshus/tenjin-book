import axios from 'axios';

// TODO DRY
const serverUrl = process.env.NODE_ENV === 'production' ? "https://api.jinbook.org"
 : 'http://localhost:4000';

export const uploadImage = async (token, imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const { data } = await axios.post(`${serverUrl}/uploadByFile`, formData, {
    headers: {
    'Content-Type': 'multipart/form-data',
    'authorization': token
    }
  });
  return data;
}

// export const deleteImage = async (token, url) => {
//   console.log("deleteImage", url);
//   const { data } = await axios.delete(url, {
//     headers: {
//       'authorization': token
//     }
//   });
//   return data.status;
// }