import Swal from 'sweetalert2'

export async function fetchDataTransaction(){
    const data = await fetch(`http://10.10.13.150:9090/transactions`, {method:'GET',})
        .then((response) => {
            return response.json()
        })
    return data;
}
export async function fetchDataPayment(pagination){
    const data = await fetch(`http://10.10.13.150:9090/page-transactions?size=10&page=${pagination}`, {method:'GET',})
        .then((response) => {
            return response.json()
        })
    return data;
}
export async function getDataTransactionDataById(idTransaction){
    const data = await fetch(`http://10.10.13.150:9090/transaction/${idTransaction}`, {method:'GET',})
        .then((response) => {
            return response.json()
        })
    return data;
}
export async function getDataTransactionDataByTable(idTable){
    const data = await fetch(`http://10.10.13.150:9090/transaction-table/${idTable}`, {method:'GET',})
        .then((response) => {
            return response.json()
        })
    return data;
}
export async function updatePayment(paymentData) {
    paymentData.pay = paymentData.pay.replace(/\D+/g, '');
    return await fetch('http://10.10.13.150:9090/transaction', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            "Content-type": "application/json"
        },
        body: JSON.stringify(paymentData)
    })
        .then( async (res) => {
            let respond = await res.json();
            if (res.status === 200){
                await Swal.fire(
                    'Success!',
                    'Payment Success!',
                    'success'
                )
            } else await Swal.fire(
                'Error!',
                ''+respond.message,
                'error'
            )
        }).catch();

}
