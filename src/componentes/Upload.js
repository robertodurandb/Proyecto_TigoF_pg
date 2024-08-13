import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import UploadService from '../services/uploadservice';

const Upload = ({setImages, images}) => {

    //const [ name, setName ] = useState("")
    const [file, setFile] = useState()
    const [pathImage, setPathImage] = useState("http://192.168.18.8:9100/upload.jpg")

    const sendImage = (e) => {
        e.preventDefault()
        UploadService.sendImages(file).then((result) => {
            console.log("el resultado es: "+result)
        })
    }

    const onFileChange = (e) => {
        if(e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]
            if(file.type.includes("image")){
                const reader = new FileReader()
                reader.readAsDataURL(file)

                reader.onload = function load() {
                    setPathImage(reader.result)
                }

                setFile(file)
            }else {
                console.log("there was an error")
            }
        }
    }

    return (
     
        <form>
            <div className='input-file'>
                <input
                type='file'
                placeholder='file'
                onChange={onFileChange}
                />
                <img className='img-fluid img-thumbnail' src={pathImage} alt='Image'/>
            </div>

            {/* <input
                type='text'
                placeholder='enter a name'
                className='name-picture mt-2'
                onChange={(e) => setName(e.target.value)}
            /> */}
            <br/>

            <button type='submit' className='btn btn-outline-primary btn-lg btn-block'
            onClick={sendImage}>
                Send Image
            </button>
        </form>
    )
}

export default Upload