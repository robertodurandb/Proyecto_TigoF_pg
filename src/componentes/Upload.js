// import React, { useState } from 'react';
// import axios from 'axios';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import API from '../utils/const'

// function Upload (){

//     const [selectedImage, setSelectedImage] = useState(null);

//     let ipbackend = `${API.URL}`;

//     const handleImageChange = (event) => {
//         setSelectedImage(event.target.files[0]);
//     };

//     const handleSubmit = async (event) => {
//         event.preventDefault();

//         const formData = new FormData();
//         formData.append('image', selectedImage);

//         try {
//             const response = await axios.post(ipbackend+'imagen', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data'
//                 }
//             });
//             console.log(response.data);
//         } catch (error) {
//             console.error(error);
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit}> 
//             <input type="file" onChange={handleImageChange}/>
//             <button type="submit">Subir imagen</button>
//         </form>
//     );    
// }

// export default Upload