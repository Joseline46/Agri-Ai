const regex = {
    username: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
    consumerType: /^(Livestock|Human)$/,
    grainType: /^[A-Za-z\s]+$/,
    quantity: /^(1000000000|[1-9][0-9]{0,4})$/,
    amount: /^(1000000000|[1-9][0-9]{0,4})$/,
    landsize:/^\d+\s?(acres|ha|hectares)$/,
    firstname: /^[A-Z][a-zA-Z'-]{1,49}$/,
    lastname: /^[A-Z][a-zA-Z'-]{1,49}$/,
    arable: /^\d+\s?(acres|ha|hectares)$/,
    price: /^\$?\d{1,3}(,\d{3})*(\.\d{2})?$/,
    region: /^-?\d+$/,
    plants: /^[\w\s]+(,[\w\s]+)*$/,
    address: /^\d{1,6}\s+[\w\s.'-]{2,50}$/
}

export default regex