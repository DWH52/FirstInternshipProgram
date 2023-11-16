import { NextResponse } from "next/server";

export async function GET(){
    
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Authorization", /*github environment secret*/);

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
    //console.log(JSON.stringify(result))
    return new NextResponse(result.access_token); //Test successful, returned value is the access_token
}