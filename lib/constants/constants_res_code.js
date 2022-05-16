module.exports = Object.freeze({
    SUCCESS: {
        code: 1,
        message: "SUCCESS",
        description: "operation success"
    },
    MINT_SUCCESS: {
        code: 100,
        message: "MINT_REQUEST_SUCCESS",
        description: "Get Mint Tx Success"
    },
    MINT_AMOUNT_EXCEED: {
        code: 101,
        message: "MINT_AMOUNT_EXCEED",
        description: "exceed mint max amount"
    },
    WHITELISTING: {
        code: 300,
        message: "WHITELISTING",
        description: "This account is whitelisting"
    }, 
    NOT_WHITELISTING: {
        code:    301,
        message: "NOT_WHITELISTING",
        description: "This account is not whitelisting"
    }
     
});