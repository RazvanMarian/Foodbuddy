import React from 'react'
import { useHistory } from "react-router-dom"


const Home = () => {
    const history = useHistory()

    const forward = (category) => {
        history.push({
            pathname: '/category/' + category,
            state: { detail: category }
        })
    }

    return (
        <div className="container-all">
            <h1>What kind of recipe are you looking for</h1><br></br>
            <div className="container" onClick={() => forward("Breakfast")}>
                <img src="https://images.unsplash.com/photo-1526127230111-0197afe94d72?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1055&q=80" alt="" />
                <span className="title">Breakfast</span>
            </div>
            <div className="container" onClick={() => forward("Lunch")}>
                <img src="https://images.unsplash.com/photo-1576867757603-05b134ebc379?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" alt="" />
                <span className="title">Lunch</span>
            </div>
            <div className="container" onClick={() => forward("Beverages")}>
                <img src="https://images.unsplash.com/photo-1612528443702-f6741f70a049?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1059&q=80" alt="" />
                <span className="title">Beverages</span>
            </div>
            <div className="container" onClick={() => forward("Soups")}>
                <img src="https://images.unsplash.com/photo-1607528971899-2e89e6c0ec69?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=967&q=80" alt="" />
                <span className="title">Soups</span>
            </div>
            <div className="container" onClick={() => forward("Desserts")}>
                <img src="https://images.unsplash.com/photo-1491600395818-515d7b81de11?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1063&q=80" alt="" />
                <span className="title">Desserts</span>
            </div>
            <div className="container" onClick={() => forward("Salads")}>
                <img src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80" alt="" />
                <span className="title">Salads</span>
            </div>
            <div className="container" onClick={() => forward("Holidays")}>
                <img src="https://images.unsplash.com/photo-1509456592530-5d38e33f3fdd?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1055&q=80" alt="" />
                <span className="title">Holidays</span>
            </div>
            <div className="container" onClick={() => forward("Pork")}>
                <img src="https://images.unsplash.com/photo-1602491950780-1c5411ecfdf6?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" alt="" />
                <span className="title">Pork</span>
            </div>
            <div className="container" onClick={() => forward("Sushi")}>
                <img src="https://images.unsplash.com/photo-1553621042-f6e147245754?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=925&q=80" alt="" />
                <span className="title">Sushi</span>
            </div>
            <div className="container" onClick={() => forward("Beef")}>
                <img src="https://images.unsplash.com/photo-1547637205-fde0c9011f9d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80" alt="" />
                <span className="title">Beef</span>
            </div>
            <div className="container" onClick={() => forward("FastFood")}>
                <img src="https://images.unsplash.com/photo-1561758033-d89a9ad46330?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" alt="" />
                <span className="title">Fast Food</span>
            </div>
            <div className="container" onClick={() => forward("Other")}>
                <img src="https://bit.ly/2zd3HLf" alt="" />
                <span className="title">Other</span>
            </div>
        </div>
    )
}

export default Home