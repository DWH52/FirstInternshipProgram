export default async function getPaylocityToken(){
    
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Authorization", "Basic K0lJUEVadEhaMG1SSTRxZ0hNb01sUzA0TlRnMU1EVXlOVGN6TVRVek1qZzVPRGd6OmRwN3dncEMzKzBTeFhVUis0WEQ3TC9OcjVabHU2OEcwVnYza2pXSm5TaVl6ODF4NFdiUDFUcTU4SXAvQnFpSHRvZzVkNUw5clJNaW9pTzl1VHkrNVl3PT0=");

    const urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "client_credentials");
    urlencoded.append("scope", "WebLinkAPI");

    const options = {
        method:'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow',
        next: { revalidate: 3599}
    };

    let result = await fetch('https://apisandbox.paylocity.com/IdentityServer/connect/token', options)
        .then(response => response.json())
        .catch(error => console.log('error', error));

    return result.access_token; //Test successful, returned value is the access_token
}