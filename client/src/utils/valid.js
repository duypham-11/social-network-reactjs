const valid = ({
    fullname, username, email, password, cf_password
}) => {
    const err = {}

    if (!fullname) {
        err.fullname = "Please add fullname"
    } else if (fullname.length > 25) {
        err.fullname = "Full name maximum 25 characters"
    }

    if (!username) {
        err.username = "Please add username"
    } else if (username.replace(/ /g, '') > 25) {
        err.username = "User name maximum 25 characters"
    }

    if (!email) {
        err.email = "Please add email"
    } else if (!validateEmail(email)) {
        err.email = "Email is not valid"
    }

    if (!password) {
        err.password = "Please add password"
    } else if (password.length < 6) {
        err.password = "Password at least 6 characters"
    }

    if(password !== cf_password){
        err.cf_password = "Confirm password not match"
    }

    return {
        errMsg: err,
        errLength: Object.keys(err).length
    }
}

//Regex email
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

export default valid