import React, { useEffect, useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import { UserContext } from '../../App'
import Toast from 'react-bootstrap/Toast'

const Editprofile = () => {
    const history = useHistory()
    const { state, dispatch } = useContext(UserContext)
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [password, setPassword] = useState("")
    const [fileName, setFileName] = useState("Upload Boundary File")
    const [image, setImage] = useState("")
    const [imageString, setImageString] = useState("")
    const [url, setUrl] = useState("")
    const [show, setShow] = useState(false)
    const [error, setError] = useState("")
    const [email, setEmail] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")


    useEffect(() => {
        if (url) {
            localStorage.setItem("userN", JSON.stringify({ ...state, photo: url }))

            fetch('/updatephoto', {
                method: "put",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    photo: url
                })
            })
                .then(res => res.json())
                .then(result => {
                    window.location.reload()
                })
                .catch(err => console.log(err))
        }
    }, [url])

    const uploadImage = () => {
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

    const changePass = () => {
        if (!password || !newPassword || !confirmPassword) {
            setError("Please add the neccesary fields!")
            setShow(true)
            return
        }

        if (newPassword.length < 8) {
            setError("Your new password is too short!")
            setShow(true)
            return
        }

        if (newPassword !== confirmPassword) {
            setError("The new passwords do not corespond!")
            setShow(true)
            return
        }


        fetch('/updatepassword', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                password: password,
                newpassword: newPassword
            })
        })
            .then(res => res.json())
            .then(result => {
                if (result.error) {
                    setError(result.error)
                    setShow(true)
                } else {
                    setError(result.res)
                    setShow(true)
                }
                setPassword("")
                setConfirmPassword("")
                setNewPassword("")
            })
            .catch(err => console.log(err))
    }

    const changeDetails = () => {
        if (!email || !firstName || !lastName) {
            setError("Please add the neccesary fields!")
            setShow(true)
            return
        }

        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            setError("E-mail does not exist!")
            setShow(true)
            return
        }

        fetch('/updatedetails', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                email,
                firstName,
                lastName
            })
        })
            .then(res => res.json())
            .then(result => {
                if (result.error) {
                    setError(result.error)
                    setShow(true)
                } else {
                    setError(result.res)
                    setShow(true)
                }
                localStorage.clear()
                dispatch({ type: "LOGOUT" })
                history.push("/")
            })
            .catch(err => console.log(err))

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
            <div id="my-profile">
                <h3 id="signup-title">Change your profile picture</h3><br></br>
                <img id="preview-image" src={image} alt=""></img>
                <div className="form-group">
                    <Form.File
                        id="custom-file"
                        label={fileName}
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

                <button type="submit" onClick={() => uploadImage()} className="btn btn-primary btn-block">Save</button>

            </div>

            <div id="my-profile">
                <h3 id="signup-title">My profile</h3>

                <div className="form-group">
                    <label>Email address</label>
                    <input type="text" className="form-control" placeholder="Enter new email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div className="form-group">
                    <label>First Name</label>
                    <input type="text" className="form-control" placeholder={state ? state.firstName : "loading"} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>

                <div className="form-group">
                    <label>Last Name</label>
                    <input type="text" className="form-control" placeholder={state ? state.lastName : "loading"} value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>

                <button type="submit" className="btn btn-primary btn-block" onClick={() => changeDetails()}>Save</button>
            </div>

            <div id="my-profile">
                <h3 id="signup-title">Change your password</h3>

                <div className="form-group">
                    <label>Old password</label>
                    <input type="password" className="form-control" placeholder="Enter old password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>

                <div className="form-group">
                    <label>New password</label>
                    <input type="password" className="form-control" placeholder="Enter your new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </div>

                <div className="form-group">
                    <label>Confirm new password</label>
                    <input type="password" className="form-control" placeholder="Confirm your new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>

                <button type="submit" onClick={() => changePass()} className="btn btn-primary btn-block">Save</button>

            </div>
        </div >
    )
}



export default Editprofile