import React, { useEffect, createContext, useReducer, useContext } from 'react'
import './App.css';
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom'
import NavBar from './components/NavBar'
import Home from './components/screens/Home'
import Createpost from './components/screens/Createpost'
import Signup from './components/screens/Signup'
import Login from './components/screens/Login'
import Editprofile from './components/screens/Editprofile'
import Measure from './components/screens/Measure'
import Category from './components/screens/Category'
import Profile from './components/screens/Profile'
import UserProfile from './components/screens/UserProfile'
import Mybuddies from './components/screens/Mybuddies'
import ManageUsers from './components/screens/ManageUsers'
import { reducer, initialState } from './reducers/userReducer'


export const UserContext = createContext()


const Routing = () => {
  const history = useHistory()
  const { state, dispatch } = useContext(UserContext)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userN"))
    if (user) {
      dispatch({ type: "USER", payload: user })
    }
    else {
      history.push('/login')
    }
  }, [])

  return (
    <Switch>
      <Route exact path="/">
        <Home></Home>
      </Route>
      <Route path="/mybuddies">
        <Mybuddies></Mybuddies>
      </Route>
      <Route path="/createpost">
        <Createpost></Createpost>
      </Route>
      <Route path="/signup">
        <Signup></Signup>
      </Route>
      <Route path="/login">
        <Login></Login>
      </Route>
      <Route path="/editprofile">
        <Editprofile></Editprofile>
      </Route>
      <Route path="/tips">
        <Measure></Measure>
      </Route>
      <Route path="/category/:cat">
        <Category></Category>
      </Route>
      <Route path="/myprofile">
        <Profile></Profile>
      </Route>
      <Route path="/manageusers">
        <ManageUsers></ManageUsers>
      </Route>
      <Route path="/profile/:userid">
        <UserProfile></UserProfile>
      </Route>
    </Switch>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <NavBar></NavBar>
        <Routing></Routing>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
