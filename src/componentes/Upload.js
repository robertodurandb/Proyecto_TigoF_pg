import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import UploadService from '../services/uploadservice';

const Upload = ({setImages, images}) => {

    const [ name, setName ] = useState("")
    const [file, setFile] = useState()
    const [pathImage, setPathImage] = useState("http://192.168.18.8:9100/upload.jpg")

    const sendImage = (e) => {
        e.preventDefault()
        UploadService.sendImages(name, file).then((result) => {
            console.log("el resultado es: "+result)
        })
    }

    const onFileChange = (e) => {
        if(e.target.files && e.target.files.lenth > 0) {
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

            </div>
        </form>
    )
}

export default Upload