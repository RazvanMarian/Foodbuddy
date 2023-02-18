import React, { useState, useEffect, useContext } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import { Heart, Chat } from 'react-bootstrap-icons'
import { UserContext } from '../../App'
import { Link } from 'react-router-dom'
import Modal from 'react-bootstrap/Modal'

const Mybuddies = () => {
    const [data, setData] = useState([])
    const { state, dispatch } = useContext(UserContext)
    const [comment, setComment] = useState("")
    const [show, setShow] = useState(false);
    const [recipeId, setRecipeId] = useState("")

    const handleClose = () => setShow(false);
    const handleShow = (recipeId) => {
        setRecipeId(recipeId)
        setShow(true)
    }

    useEffect(() => {
        fetch('/followposts', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
            }
        })
            .then(res => res.json())
            .then(result => {
                setData(result.posts)
                console.log(result.posts)
            })
            .catch(err => console.log(err))
    }, [])


    const likePost = (id) => {
        fetch('/like', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        item.likes = result.likes
                        return item
                    } else {
                        return item
                    }
                })
                setData(newData)
            })
            .catch(err => console.log(err))
    }

    const unlikePost = (id) => {
        fetch('/unlike', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {

                const newData = data.map(item => {
                    if (item._id === result._id) {
                        item.likes = result.likes
                        return item
                    } else {
                        return item
                    }
                })

                setData(newData)

            }).catch(err => console.log(err))
    }

    const doComment = (text, postId) => {
        setComment("")
        fetch('/comment', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: postId,
                text: text
            })
        })
            .then(res => res.json())
            .then(result => {
                console.log(result)
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        item.likes = result.likes
                        item.comments = result.comments
                        return item
                    } else {
                        return item
                    }
                })
                setData(newData)
            })
            .catch(err => console.log(err))
    }

    return (
        <div id="card-holder">
            {
                data.map(item => {
                    return (
                        <>
                            <Card key={item._id}>
                                <div id="avatar-holder">
                                    <img id="post-avatar" src={item.postedBy.photo} alt="Avatar" />
                                    <p id="post-owner"><Link to={item.postedBy._id !== state._id ? "/profile/" + item.postedBy._id : "/myprofile"}>{item.postedBy.lastName + " " + item.postedBy.firstName}</Link></p>
                                </div >
                                <Card.Img variant="top" src={item.photo} />
                                <Card.Body>
                                    <Card.Title>{item.title}</Card.Title>
                                    <Card.Text>{item.description}</Card.Text>
                                    <p id="card-like">
                                        {item.likes.includes(state._id)
                                            ?
                                            <Button id="unlike-btn" onClick={() => unlikePost(item._id)}><Heart></Heart></Button>
                                            :
                                            <Button id="like-btn" onClick={() => likePost(item._id)}><Heart></Heart></Button>
                                        }
                                        <Button className="postBtn" >{item.likes.length} likes</Button>
                                        <Button className="postBtn" onClick={() => handleShow(item._id)}>See the recipe</Button>
                                    </p>
                                    <div>
                                        {item.comments.map(record => {
                                            return (
                                                <h6 key={record._id}><span><strong>{record.postedBy.firstName} {record.postedBy.lastName}</strong>: </span>{record.text}</h6>
                                            )
                                        })
                                        }
                                    </div>

                                    <InputGroup className="mb-3">
                                        <InputGroup.Prepend>
                                            <Button id="comment-btn" onClick={() => doComment(comment, item._id)}><Chat></Chat></Button>
                                        </InputGroup.Prepend>
                                        <FormControl placeholder="Leave a comment" value={comment} onChange={(e) => setComment(e.target.value)} aria-describedby="basic-addon1" />
                                    </InputGroup>
                                </Card.Body>
                            </Card>
                            <Modal show={show} onHide={handleClose} id="my-modal">
                                <Modal.Header closeButton>
                                    Recipe:
                                </Modal.Header>

                                <Modal.Body>
                                    {data.map(item => {
                                        if (item._id === recipeId)
                                            return item.recipe
                                    })}
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button onClick={handleClose}>
                                        Close
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        </>
                    )
                })
            }

        </div >
    )
}

export default Mybuddies