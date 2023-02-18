import React, { useState, useEffect } from 'react'
import Form from 'react-bootstrap/Form'
import { useHistory } from 'react-router-dom'
import Toast from 'react-bootstrap/Toast'


var list = ['Lunch', 'Pork']

const Createpost = () => {
    const history = useHistory()
    const [fileName, setFileName] = useState("Upload Boundary File")
    const [image, setImage] = useState("")
    const [recipe, setRecipe] = useState("")
    const [description, setDescription] = useState("")
    const [imageString, setImageString] = useState("")
    const [title, setTitle] = useState("")
    const [url, setUrl] = useState("")
    const [show, setShow] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        if (url) {
            fetch('/createpost', {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    title,
                    description,
                    recipe,
                    picUrl: url,
                    categories: list
                })
            })
                .then(res => res.json())
                .then(data => {

                    if (data.error) {
                        console.log(data.error)
                        setError(data.error)
                        setShow(true)
                    }
                    else {
                        console.log(data)
                        history.push("/")
                    }
                }).catch(err => console.log(err))
        }
    }, [url])

    const postDetails = () => {

        if (!title || !recipe || !imageString) {
            setError("Please add all the fields")
            setShow(true)
            return
        }

        const data = new FormData()
        data.append("file", imageString)
        data.append("upload_preset", "foodbuddy")
        data.append("cloud_name", "razvan-cloud")
        fetch("https://api.cloudinary.com/v1_1/razvan-cloud/image/upload", {
            method: "post",
            body: data
        })
            .then(res => res.json())
            .then(data => {
                setUrl(data.url)
            })
            .catch(err => {
                console.log(err)
            })
    }


    const TagsInput = props => {
        const [tags, setTags] = useState(props.tags);

        const removeTags = indexToRemove => {
            setTags([...tags.filter((_, index) => index !== indexToRemove)]);
            list.splice(indexToRemove, 1)
        };
        const addTags = event => {
            if (event.target.value !== "") {
                setTags([...tags, event.target.value]);
                props.selectedTags([...tags, event.target.value]);
                event.target.value = "";
            }
        };
        return (
            <div>
                <div className="tags-input">
                    <ul id="tags">
                        {tags.map((tag, index) => (
                            <li key={index} className="tag">
                                <span className='tag-title'>{tag}</span>
                                <span className='tag-close-icon'
                                    onClick={() => removeTags(index)}
                                >
                                    x
                            </span>
                            </li>
                        ))}
                    </ul>
                </div>
                <input
                    className="form-control"
                    type="text"
                    onKeyUp={event => event.key === "Enter" ? addTags(event) : null}
                    placeholder="Press enter to add a category"
                />

            </div>
        );
    };
    const selectedTags = tags => {
        list = []
        for (var i = 0; i < tags.length; i++) {
            list.push(tags[i])
        }
    }

    return (
        <div id="createpost-holder">
            <div className="toast-holder">
                <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide>
                    <Toast.Header>
                        <strong className="mr-auto">{error}</strong>
                    </Toast.Header>
                </Toast>
            </div>
            <div id="createpost-form">
                <h3 id="createpost-title">Add a new recipe</h3>

                <div className="form-group">
                    <label>Final dish image:</label>
                    <img id="preview-image" src={image} alt=""></img>
                    <Form.File
                        id="custom-file"
                        label={fileName}
                        accept="image/png, image/jpeg"
                        onChange={(e) => {
                            if (e.target.files[0] === undefined) {
                                return
                            } else {
                                setFileName(e.target.files[0].name)
                                setImage(URL.createObjectURL(e.target.files[0]))
                            }
                            setImageString(e.target.files[0])
                        }
                        }
                        custom
                    />
                </div>

                <div className="form-group">
                    <label>Title</label>
                    <input type="text" className="form-control" placeholder="Enter recipe name here" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>

                <div className="form-group">
                    <label>Categories</label>
                    <TagsInput selectedTags={selectedTags} tags={list} />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <input type="text" className="form-control" placeholder="Enter your description here" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>

                <div className="form-group">
                    <label>Your recipe</label>
                    <textarea rows="4" type="text" className="form-control" placeholder="Enter your recipe here" value={recipe} onChange={(e) => setRecipe(e.target.value)} />
                </div>

                <button type="submit" onClick={() => postDetails()} className="btn btn-primary btn-block">Create post</button>


            </div>
        </div>
    )
}

export default Createpost