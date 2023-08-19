import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default (props) => {
    const {
        id,
        isBuilder,
        onChange,
        value = '',
        placeholder,
    } = props


    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image'],
            ['clean']
        ],
    }

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
    ];

    return (
        <>
            <div

            >
                {
                    isBuilder ? (
                        <ReactQuill
                            modules={modules}
                            formats={formats}
                            theme="snow" value={value} 
                            onChange={e => {
                                onChange({ target: { id: 'formattedText', value: e } }, { type: 'text', placeholder: '' }, false)
                            }} 
                            style={{
                                minHeight: 200
                            }}
                            />
                    ) : (
                        <div dangerouslySetInnerHTML={{ __html: placeholder }}>
                     
                        </div>
                    )
                }
            </div>

        </>
    )
}
