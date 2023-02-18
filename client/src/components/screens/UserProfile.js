import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

const Profile = () => {

    const [profile, setProfile] = useState(null)
    const { userid } = useParams()
    const [showFollow, setShowFollow] = useState(true)
    const [show, setShow] = useState(false);
    const [recipeId, setRecipeId] = useState("")

    const handleClose = () => setShow(false);
    const handleShow = (recipeId) => {
        setRecipeId(recipeId)
        setShow(true)
    }


    useEffect(() => {
        fetch(`/user/${userid}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(res => res.json())
            .then(data => {
                setProfile(data)
                console.log(data)
                console.log(JSON.parse(localStorage.getItem("userN"))._id)
                var userId = JSON.parse(localStorage.getItem("userN"))._id
                if (data.user.followers.includes(userId))
                    setShowFollow(false)

            })
            .catch(err => console.log(err))
    }, [])


    const followUser = () => {
        fetch('/follow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                followId: userid
            })
        })
            .then(res => res.json())
            .then(data => {
                localStorage.setItem("userN", JSON.stringify(data.result))

                setProfile((previousState) => {
                    return {
                        ...previousState,
                        user: {
                            ...previousState.user,
                            followers: [...previousState.user.followers, data._id]
                        }
                    }
                })
                setShowFollow(false)
                window.location.reload()
            })
    }

    const unfollowUser = () => {
        fetch('/unfollow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                unfollowId: userid
            })
        })
            .then(res => res.json())
            .then(data => {
                localStorage.setItem("userN", JSON.stringify(data.result))
                setShowFollow(true)
                setProfile((previousState) => {
                    const newFollower = previousState.user.followers.filter(item => item !== data._id)
                    return {
                        ...previousState,
                        user: {
                            ...previousState.user,
                            followers: newFollower
                        }
                    }
                })
                window.location.reload()

            })
    }

    return (
        <>
            {profile ?
                <div style={{ width: "60%", margin: "0px auto" }}>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-around",
                        margin: "18px 0px",
                        borderBottom: "1px solid grey"
                    }}>
                        <div>
                            <img alt="img" style={{ width: "160px", height: "160px", borderRadius: "80px" }}
                                src={profile.user.photo}
                            />
                        </div>
                        <div id="profile-stats">
                            <h4 style={{ fontSize: "2.5rem", marginRight: "3rem" }}><strong>{profile.user.firstName + " " + profile.user.lastName}</strong></h4>
                            <h4>{profile.user.email}</h4>
                            <div style={{ display: "flex", justifyContent: "space-between", width: "108%" }}>
                                <h6 style={{ fontSize: "1.5rem" }}><strong>{profile.posts.length + " recipes"}</strong></h6>
                                <h6 style={{ fontSize: "1.5rem" }}><strong>{profile.user.followers.length} followers</strong></h6>
                            </div>
                            {showFollow ?
                                <button type="submit" onClick={() => followUser()} className="btn btn-primary btn-block">Follow</button>
                                :
                                <button type="submit" onClick={() => unfollowUser()} className="btn btn-primary btn-block">Unfollow</button>
                            }

                        </div>
                    </div>

                    <div className="profile-gallery">
                        {
                            profile.posts.map(item => {
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
                            {profile.posts.map(item => {
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

                : <h2>Loading . . .</h2>}

        </>
    )
}

export default Profile