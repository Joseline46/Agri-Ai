const regex = {
    username: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    password: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!$%^&*()_+|~=`{}\[\]:";'<>?,./])[A-Za-z\d!$%^&*()_+|~=`{}\[\]:";'<>?,./]{8,20}$/,
}

export default regex