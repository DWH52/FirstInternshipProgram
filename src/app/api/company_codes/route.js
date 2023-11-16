import { authenticationToken } from "@/app/credentials";
import { NextResponse } from "next/server";

export async function GET(request) {  
    const companyId = "S2222";
    
    const { searchParams } = new URL(request.url)
    const codeResource = searchParams.get('codeResource')
    
    const options = {
        method: "GET",
        headers: {"Authorization" : `Bearer ${authenticationToken}`},
        redirect: "follow"
    }
    

    var companyCodes = await fetch(`https://apisandbox.paylocity.com/api/v2/companies/${companyId}/codes/${codeResource}`, options)
        .then(response => response.json())
        .catch(error => console.log('error', error));
    
    
    return NextResponse.json(companyCodes);
}