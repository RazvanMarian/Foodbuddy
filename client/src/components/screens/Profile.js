import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../App'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'


const Profile = () => {
    const [posts, setPosts] = useState([])
    const { state, dispatch } = useContext(UserContext)
    const [show, setShow] = useState(false);
    const [recipeId, setRecipeId] = useState("")

    const handleClose = () => setShow(false);
    const handleShow = (recipeId) => {
        setRecipeId(recipeId)
        setShow(true)
    }

    useEffect(() => {
        fetch('/myposts', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(res => res.json())
            .then(data => {

                setPosts(data.myposts)
            })
            .catch(err => console.log(err))
    }, [])

    return (
        <div style={{ width: "60%", margin: "0px auto" }}>
            <div style={{
                display: "flex",
                justifyContent: "space-around",
                margin: "18px 0px",
                borderBottom: "1px solid grey"
            }}>
                <div>
                    <img alt="img" style={{ width: "160px", height: "160px", borderRadius: "80px" }}
                        src={state ? state.photo : "loading"}
                    />
                </div>
                <div id="profile-stats">
                    <h4 style={{ fontSize: "2.5rem", marginRight: "3rem" }}><strong>{state ? (state.result ? state.result.lastName + " " + state.result.firstName : state.lastName + " " + state.firstName) : "loading"}</strong></h4>
                    <h4>{state ? state.email : "loading"}</h4>
                    <div style={{ display: "flex", justifyContent: "space-between", width: "108%" }}>
                        <h6 style={{ fontSize: "1.5rem" }}><strong>{posts.length.toString() + " recipes"}</strong></h6>
                        <h6 style={{ fontSize: "1.5rem" }}><strong>{state ? (state.result ? state.result.followers.length : state.followers.length) + " followers" : "loading"}</strong></h6>
                    </div>
                </div>
            </div>

            <div className="profile-gallery">
                {
                    posts.map(item => {
                        return (
                            <div className="container" onClick={() => handleShow(item._id)} key={item._id}>
                                <img src={item.photo} alt="" />
                                <span className="title">{item.title}</span>
                                <span className="text">Click to see the recipe</span>
                            </div>
                        )
                    })
                }
            </div>
            <Modal show={show} onHide={handleClose} id="my-modal">
                <Modal.Header closeButton>
                    Recipe:
                </Modal.Header>

                <Modal.Body>
                    {posts.map(item => {
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
        </div >
    )
}

export default Profile