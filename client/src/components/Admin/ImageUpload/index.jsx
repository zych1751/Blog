import React from 'react';
import sessionStorage from 'sessionstorage';
import axios from 'axios';

class ImageUpload extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            file: ''
        };

        this.handleUpload = this.handleUpload.bind(this);
    }

    handleUpload() {
        const token = sessionStorage.getItem('jwtToken');
        const form = document.forms.imageform;

        const file = form.querySelector('#uploadImage').files[0];
        if(typeof file === "undefined") {
            return;
        }

        const data = new FormData();
        data.append('token', token);
        data.append('image', file);

        const config = {
            'Content-Type': 'multipart/form-data'
        };

        axios.post(API_SERVER_URL+'/api/image/upload', data, config);
        
        alert("업로드 성공!");
    }

    render() {
        return (
            <div>
                <form name="imageform" method="post">
                    <input type="file" name="image" accept="image/*" id="uploadImage"></input>
                    <button type="button" onClick={()=>this.handleUpload()}>Submit</button>
                </form>
            </div>
        );
    }
};

export default ImageUpload;
