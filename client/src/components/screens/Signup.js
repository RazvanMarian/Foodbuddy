import React, { useState } from 'react'
import { useHistory } from "react-router-dom"
import Toast from 'react-bootstrap/Toast'

const Signup = () => {

    const history = useHistory()
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [password, setPassword] = useState("")
    const [birthday, setBirthday] = useState("2000-01-01")
    const [email, setEmail] = useState("")
    const [show, setShow] = useState(false)
    const [error, setError] = useState("")

    const PostData = () => {
        if (!email) {
            setError("Please add all the fields!")
            setShow(true)
            return
        }
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            setError("E-mail does not exist!")
            setShow(true)
            return
        }

        if (password.length < 8) {
            setError("Your password is too weak!")
            setShow(true)
            return
        }


        fetch("/signup", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                firstName,
                lastName,
                email,
                birthday,
                password
            })
        }).then(res => res.json())
            .then(data => {
                if (data.error) {
                    console.log(data.error)
                    setError(data.error)
                    setShow(true)
                }
                else {
                    history.push("/login")
                }
            }).catch(err => {
                console.log(err)
            })
    }

    return (
        <div>
            <div className="toast-holder">
                <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide>
                    <Toast.Header>
                        {/* <img
                            src="holder.js/20x20?text=%20"
                            className="rounded mr-2"
                            alt=""
                        /> */}
                        <strong className="mr-auto">{error}</strong>
                    </Toast.Header>
                </Toast>
            </div>
            <div id="signup-form">
                <h3 id="signup-title">Sign Up</h3>

                <div className="form-group">
                    <label>First name</label>
                    <input type="text" className="form-control"
                        placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>

                <div className="form-group">
                    <label>Last name</label>
                    <input type="text" className="form-control" placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>

                <div className="form-group">
                    <label>Email address</label>
                    <input type="email" className="form-control" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>

                <div className="form-group">
                    <label>Birthday:</label>
                    <input type="date" id="birthday" className="form-control" name="birthday" value={birthday} onChange={(e) => setBirthday(e.target.value)}></input>
                </div>


                <button type="submit" className="btn btn-primary btn-block" onClick={() => PostData()}>Sign Up</button>
                <p className="forgot-password text-right">
                    Already registered <a href="/login">sign in?</a>
                </p>
            </div>
        </div>
    )
}

export default Signup