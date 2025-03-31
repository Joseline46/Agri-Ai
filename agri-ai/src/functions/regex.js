const regex = {
    username: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
    consumerType: /^(Livestock|Human)$/,
    quantity: /^(1000000000|[1-9][0-9]{0,4})$/
}

export default regex