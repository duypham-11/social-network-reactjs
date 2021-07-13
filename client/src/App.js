import { BrowserRouter as Router, Route } from "react-router-dom";

import PageRender from "./customRouter/PageRender";
import PrivateRouter from "./customRouter/PrivateRouter";

import Login from "./pages/login"
import Register from "./pages/register";

import Home from "./pages/home"


import Alert from "./components/alert/Alert";
import Header from "./components/header/Header";
import StatusModal from "./components/StatusModal";


import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { refreshToken } from "./redux/actions/authAction"
import { getPosts } from "./redux/actions/postAction"
import { getSuggestions } from "./redux/actions/suggestionsAction"

import { getNotifies } from "./redux/actions/notifyAction"

import { GLOBALTYPES } from "./redux/actions/globalTypes";
import CallModal from "./components/message/CallModal";

//Socket
import io from "socket.io-client"
import SocketClient from "./SocketClient";
//Peer
import Peer from "peerjs"

function App() {
  const { auth, status, call } = useSelector(state => state)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(refreshToken())

    const socket = io()
    dispatch({ type: GLOBALTYPES.SOCKET, payload: socket })
    return () => socket.close()

  }, [dispatch])

  useEffect(() => {
    if (auth.token) {
      dispatch(getPosts(auth.token))
      dispatch(getSuggestions(auth.token))
      dispatch(getNotifies(auth.token))
    }
  }, [dispatch, auth.token])

  useEffect(() => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    }
    else if (Notification.permission === "granted") {
    }

    else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        if (permission === "granted") { }
      });
    }
  }, [])

  //Peer
  useEffect(() => {
    const newPeer = new Peer(undefined, {
      // host: '/', port: '3001'
      path: '/', secure: true
    })
    dispatch({ type: GLOBALTYPES.PEER, payload: newPeer })
  }, [dispatch])


  return (
    <Router>
      <Alert />

      <input type="checkbox" id="theme" />
      <div className="App">
        <div className="main">

          {auth.token && <Header />}
          {status && <StatusModal />}
          {auth.token && <SocketClient />}
          {call && <CallModal />}

          <Route exact path="/" component={auth.token ? Home : Login} />
          {/* Can connect route /register doesn't token */}
          <Route exact path="/register" component={Register} />

          {/*   Cann't connect any route  except login, register   /  */}
          <PrivateRouter exact path="/:page" component={PageRender} />
          <PrivateRouter exact path="/:page/:id" component={PageRender} />

        </div>
      </div>
    </Router>
  );
}

export default App;
