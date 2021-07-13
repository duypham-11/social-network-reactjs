import React, { useState, useEffect } from "react"
import { Link, useHistory } from "react-router-dom"
import { login } from "../redux/actions/authAction"
import { useDispatch, useSelector } from "react-redux"


const Login = () => {
    const initialState = { email: '', password: '' }
    const [userData, setUserData] = useState(initialState)
    const { email, password } = userData

    const { auth } = useSelector(state => state)

    const [typePass, setTypePass] = useState(false)

    const dispatch = useDispatch()

    const history = useHistory()

    useEffect(() => {
        if (auth.token) history.push("/")

    }, [auth.token, history])

    const handleChangeInput = (e) => {
        const { name, value } = e.target
        setUserData({ ...userData, [name]: value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(userData)
        dispatch(login(userData))
    }

    return (
        <div className="auth_page">
            <form onSubmit={handleSubmit}>
                <h2 className="text-uppercase text-center mb-4">Dee Network</h2>
                <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Email address</label>
                    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                        onChange={handleChangeInput} value={email} name="email" />

                    <small id="emailHelp" className="form-text text-muted">admin@gmail.com</small>
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <div className="pass">
                        <input type={typePass ? "text" : "password"} className="form-control" id="exampleInputPassword1"
                            onChange={handleChangeInput} value={password} name="password" />
                        <small onClick={() => setTypePass(!typePass)}>
                            {typePass ? 'Hide' : 'Show'}
                        </small>

                    </div>
                    <small id="emailHelp" className="form-text text-muted">admin123456</small>
                </div>
                <button type="submit" className="btn btn-dark w-100"
                    disabled={email && password ? false : true}>
                    Login
                </button>

                <p className="my-2">
                    Create new Account? <Link to="/register" style={{ color: "crimson" }}>Register</Link>
                </p>
            </form>
        </div>
    )
}
export default Login