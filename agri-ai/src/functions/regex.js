const regex = {
    username: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
    consumerType: /^(Livestock|Human)$/,
    grainType: /^[A-Za-z\s]+$/,
    quantity: /^(1000000000|[1-9][0-9]{0,4})$/,
    landsize:/^\d+\s?(acres|ha|hectares)$/,
    arable: /^\d+\s?(acres|ha|hectares)$/,
    price: /^\$?\d{1,3}(,\d{3})*(\.\d{2})?$/,
    region: /^-?\d+$/,
    plants: /^[\w\s]+(,[\w\s]+)*$/
}

export default regex