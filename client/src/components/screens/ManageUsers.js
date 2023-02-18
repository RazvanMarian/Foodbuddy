import React, { useState, useEffect, useContext } from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { UserContext } from '../../App'




const ManageUsers = () => {

    const { state, dispatch } = useContext(UserContext)
    const [users, setUsers] = useState([])
    const [show, setShow] = useState(false);
    const [userid, setUserid] = useState("")

    const handleClose = () => setShow(false);
    const handleShow = (userid) => {
        setShow(true)
        setUserid(userid)
    }

    useEffect(() => {
        fetch('/allusers', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
            }
        })
            .then(res => res.json())
            .then(result => {
                setUsers(result.users)
                console.log(result.users)
            })
            .catch(err => console.log(err))
    }, [])


    const deleteUser = (userid) => {
        fetch(`/deleteuser/${userid}`, {
            method: "delete",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(res => res.json())
            .then(result => {
                console.log(result)
                window.location.reload()
            })
            .catch(err => console.log(err))

    }

    const deletePosts = (userid) => {
        fetch(`/deleteposts/${userid}`, {
            method: "delete",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(res => res.json())
            .then(result => {
                console.log(result)
                window.location.reload()
            })
            .catch(err => console.log(err))

    }


    return (
        <div id="manage-container">
            <h1>Manage users</h1>

            <ListGroup>
                {users.map(item => {
                    if (item._id !== state._id)
                        return (
                            <ListGroup.Item action onClick={() => handleShow(item._id)} key={item._id}>
                                <div id="avatar-holder">
                                    <img id="post-avatar" src={item.photo} alt="Avatar" />
                                    <p id="post-owner">{item.firstName + " " + item.lastName + " " + item.email}</p>
                                </div >
                            </ListGroup.Item>
                        )
                })}


            </ListGroup>
            <Modal show={show} onHide={handleClose} id="my-modal">
                <Modal.Header closeButton>
                    What do you want to do:
                                </Modal.Header>

                <Modal.Body>
                    <Button id="manage-button" onClick={() => deleteUser(userid)}>Delete user</Button>
                    <Button onClick={() => deletePosts(userid)}>Delete user's posts</Button>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default ManageUsers