import React, { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import Button from './Button';
import './ImageUpload.css';

const ImageUpload = (props) => {
    const filePickerRef = useRef();
    const [file, setFile] = useState();
    const [previewUrl, setPreviewUrl] = useState();
    const [isValid, setIsValid] = useState(false);

    const pickImageHandler = () => {
        filePickerRef.current.click();
    };

    const pickedHandler = event => {
        let pickedFile, fileIsValid;
        fileIsValid = isValid;

        if (event.target.files || event.target.files.length === 1) {
            pickedFile = event.target.files[0];
            setFile(pickedFile);
            setIsValid(true);
            fileIsValid = true;
        } else {
            setIsValid(false);
            fileIsValid = false;
        }

        props.onInput(props.id, pickedFile, fileIsValid);
    };

    useEffect(() => {
        if (!file) {
            return;
        }

        // helps us read file, parsed files
        const fileReader = new FileReader();
        // this function execute after file is read as a data url ( see below )
        fileReader.onload = () => {
            setPreviewUrl(fileReader.result);
        };
        // read file as a url
        fileReader.readAsDataURL(file);
    }, [file]);

    return (
        <div className='form-control'>
            <input
                id={props.id}
                style={{
                    display: 'none'
                }}
                type="file"
                accept='.jpg,.png,.jpeg'
                ref={filePickerRef}
                onChange={pickedHandler}
            />
            <div className={`image-upload ${props.center && 'center'}`}>
                <div className='image-upload__preview'>
                    {previewUrl ? (<img src={previewUrl} alt="preview" />) : (<p>Place pick an image.</p>)}
                </div>
                <Button
                    type="button"
                    onClick={pickImageHandler}
                >
                    Pick Image
                </Button>
            </div>
            {!isValid && <p>{props.errorText}</p>}
        </div>
    );
};

export default ImageUpload;