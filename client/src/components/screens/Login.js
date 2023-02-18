import React, { useState, useContext } from 'react'
import Toast from 'react-bootstrap/Toast'
import { useHistory, Link } from "react-router-dom"
import { UserContext } from '../../App'

const Login = () => {
    const { state, dispatch } = useContext(UserContext)
    const history = useHistory()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [show, setShow] = useState(false)
    const [error, setError] = useState("")


    const handleSignIn = () => {

        fetch("/signin", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
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
                    console.log(data)
                    localStorage.setItem("jwt", data.token)
                    localStorage.setItem("userN", JSON.stringify(data.user))
                    dispatch({ type: "USER", payload: data.user })
                    history.push("/")
                    window.location.reload()
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
                <h3 id="signup-title">Sign In</h3>

                <div className="form-group">
                    <label>Email address</label>
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" placeholder="Enter email" />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" placeholder="Enter password" />
                </div>

                <div className="form-group">
                    <div className="custom-control custom-checkbox">
                        <input type="checkbox" className="custom-control-input" id="customCheck1" />
                        <label className="custom-control-label" htmlFor="customCheck1">Remember me</label>
                    </div>
                </div>

                <button type="submit" onClick={() => handleSignIn()} className="btn btn-primary btn-block">Submit</button>

                <p id="left-p">
                    Don't have an account, <Link to="/signup">sign up</Link>
                </p>

            </div>

        </div>
    )
}

export default Login