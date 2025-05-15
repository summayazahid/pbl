import React, { useState } from 'react';
import AWS from 'aws-sdk';

const S3_BUCKET = 'summibucket'; 
const REGION = 'us-east-1'; 



AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  region: REGION,
});

const myBucket = new AWS.S3({
  params: { Bucket: S3_BUCKET },
  region: REGION,
});

function FileUploader() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileInput = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const uploadFile = (file) => {
    const params = {
      ACL: 'public-read',
      Body: file,
      Bucket: S3_BUCKET,
      Key: file.name,
    };

    myBucket.putObject(params)
      .on('httpUploadProgress', (evt) => {
        console.log('Upload Progress:', Math.round((evt.loaded / evt.total) * 100) + '%');
      })
      .send((err) => {
        if (err) console.log('Upload Error:', err);
        else alert('Upload Success!');
      });
  };

  return (
    <div className="upload-box">
      <input type="file" onChange={handleFileInput} />
      <button onClick={() => uploadFile(selectedFile)}>Upload to S3</button>
    </div>
  );
}

export default FileUploader;