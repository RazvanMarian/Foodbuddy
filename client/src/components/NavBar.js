import React, { useContext, useState } from 'react'
import { UserContext } from '../App'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
import { PersonCircle, Search } from 'react-bootstrap-icons'
import DropdownButton from 'react-bootstrap/DropdownButton'
import { Link, useHistory } from "react-router-dom"
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Modal from 'react-bootstrap/Modal'
import ListGroup from 'react-bootstrap/ListGroup'

const NavBar = () => {
    const history = useHistory()

    const { state, dispatch } = useContext(UserContext)

    const [show, setShow] = useState(false);
    const [user, setUser] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [dropdown, setDropdown] = useState(false)

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);



    const fetchUser = (query) => {
        setUser(query)

        fetch('/searchuser', {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query
            })
        })
            .then(res => res.json())
            .then(result => {
                setSearchResult(result.user)
            })

    }

    const logout = () => {
        localStorage.clear()
        dispatch({ type: "LOGOUT" })
        history.push("/")
    }

    const render = () => {
        if (state) {
            if (state.kind === "common") {
                return [
                    <Link to="/myprofile" className="dropdown-item" key="1">Your profile</Link>,
                    <Link to="/editprofile" className="dropdown-item" key="2">Edit profile</Link>,
                    <Link to="/" className="dropdown-item" onClick={logout} key="3">Log out</Link>
                ]
            }
            else if (state.kind === "admin") {
                return [
                    <Link to="/myprofile" className="dropdown-item" key="1">Your profile</Link>,
                    <Link to="/editprofile" className="dropdown-item" key="2">Edit profile</Link>,
                    <Link to="/manageusers" className="dropdown-item" key="12">Manage users</Link>,
                    <Link to="/" className="dropdown-item" onClick={logout} key="3">Log out</Link>
                ]
            }
        }
        else {
            return [
                <Link to="/login" className="dropdown-item" key="4">Log in</Link>,
                <Link to="/signup" className="dropdown-item" key="5">Sign up</Link>
            ]
        }
    }

    const renderN = () => {
        if (state) {
            return [
                <Link to="/createpost" className="navLinks btn" key="6">Add a recipe</Link>,
                <Link to="/mybuddies" className="navLinks btn" key="7">My buddies</Link>,
                <Link to="/tips" className="navLinks btn" key="8">Tips & Tricks</Link>
            ]
        }
        else {
            return [
                <Link to="/tips" className="navLinks btn" key="9">Tips & Tricks</Link>
            ]
        }
    }

    return (
        <>
            <Navbar className="navb" sticky="top" expand="lg">
                <Link to="/" className="navLinks btn" style={{ fontSize: "1.25rem" }}>Foodbuddy</Link>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        {renderN()}
                    </Nav>

                    {state ? <Button variant="outline-success" id="search-button" onClick={handleShow}> Search <Search></Search></Button> : <></>}
                    <DropdownButton show={dropdown} onClick={() => setDropdown(!dropdown)}
                        as={ButtonGroup}
                        menuAlign={{ lg: 'right' }}
                        title={<PersonCircle style={{ fontSize: 30 }}></PersonCircle>}
                        id="dropdown-menu-align-responsive-1"
                    >
                        {render()}

                    </DropdownButton>
                </Navbar.Collapse>
            </Navbar>

            <Modal show={show} onHide={handleClose} id="my-modal">
                <Modal.Header closeButton>
                    <input type="text" value={user} onChange={(e) => fetchUser(e.target.value)} className="form-control" placeholder="Search user" />
                </Modal.Header>

                <Modal.Body>
                    <ListGroup variant="flush">
                        {searchResult.map(item => {
                            return <a href={item._id !== state._id ? "/profile/" + item._id : "/myprofile"}><ListGroup.Item>{item.email}</ListGroup.Item></a>
                        })}

                    </ListGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default NavBar