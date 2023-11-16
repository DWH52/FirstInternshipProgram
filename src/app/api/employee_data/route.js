import { authenticationToken } from "@/app/credentials";
import { NextResponse } from "next/server";

export async function GET(request) { 
    //constants and variables pulled from searchParams 
    const companyId = "S2222";
    const { searchParams } = new URL(request.url)
    var employeeInput = searchParams.get('employeeInput')
    
    const options = {
        method: "GET",
        headers: {"Authorization" : `Bearer ${authenticationToken}`},
        redirect: "follow"
    }
    
    
    //api call to Paylocity for employee data
    var employeeData = await fetch(`https://apisandbox.paylocity.com/api/v2/companies/${companyId}/employees/${employeeInput}`, options)
        .then(response => response.json())
        .catch(error => console.log('error', error));
    
    
    return NextResponse.json(employeeData);
}



export async function POST(request){

    
    //constants and variables pulled from searchParams
    const companyId = "S2222";
    
    //initializes and gets the current date and format it to use for Paylocity
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    var datetime = today.toLocaleString();
    const formattedToday = yyyy + '-' + mm + '-' + dd;

    const { searchParams } = new URL(request.url)
    var employeeInput = searchParams.get('employeeInput')
    var newWorkEmailAddress = searchParams.get('workEmailAddress')
    var newPositionCode = searchParams.get('positionCode')
    var newEmploymentType = searchParams.get('employmentType')
    var newWorkLocation = searchParams.get('workLocation')
    var newWorkDepartment = searchParams.get('workDepartment')
    var newWorkNA = searchParams.get('workNA')
    var newJobTitle = searchParams.get('jobTitle')
    var newWorkAddress1 = searchParams.get('workAddress1')
    var newWorkCity = searchParams.get('workCity')
    var newWorkState = searchParams.get('workState')
    var newWorkPostalCode = searchParams.get('workPostalCode')
    var newSupervisorReviewerId = searchParams.get('newSupervisorReviewerId')

    function isOvertimeExempt(){
        if (newEmploymentType === "RFT" || newEmploymentType === "TFT"){
            return true;
        } else {
            return false;
        }
    }
    
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${authenticationToken}`);

    /*
        Body to be sent on the PATCH request to Paylocity to promote to supervisor
        Some of the hard-coded information may change based on the overall function
        trying to be performed. Will have to update manually or write additional
        api endpoints to meet your needs.
    */
    var raw = JSON.stringify({
        "departmentPosition": {
            "changeReason": "Promotion",
            "costCenter1": `${newWorkLocation}`,
            "costCenter2": `${newWorkDepartment}`,
            "costCenter3": `${newWorkNA}`,
            "effectiveDate": `${formattedToday}`,
            "employeeType": `${newEmploymentType}`,
            "isOvertimeExempt": isOvertimeExempt(),
            "isSupervisorReviewer": true,
            "jobTitle": `${newJobTitle}`,
            "positionCode": `${newPositionCode}`,
            "reviewerCompanyNumber": `${companyId}`,
            "reviewerEmployeeId": `${newSupervisorReviewerId}`,
            "supervisorCompanyNumber": `${companyId}`,
            "supervisorEmployeeId": `${newSupervisorReviewerId}`,
        },
        "workAddress": {
            "address1": `${newWorkAddress1}`,
            "city": `${newWorkCity}`,
            "emailAddress": `${newWorkEmailAddress}`,
            "postalCode": `${newWorkPostalCode}`,
            "state": `${newWorkState}`
        }
    });

    var requestOptions = {
    method: 'PATCH',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    
    
    //API call to Paylocity to PATCH updated employee information.
    var statusMsg;
    let statusMsgTxt;
    var patchRes = null;

    async function outputData(companyId, employeeInput, requestOptions){

        var catchRes = await fetch(`https://apisandbox.paylocity.com/api/v2/companies/${companyId}/employees/${employeeInput}`, requestOptions)
        
        statusMsg = catchRes.status;

        if (statusMsg === 200)
        {
            statusMsgTxt = `Employee: ${employeeInput} Successfully Updated`;
        } else if (statusMsg === 400)
        {
            patchRes = (await catchRes.json())
            console.log("User Error: ", patchRes, datetime)
            statusMsgTxt = "Bad Request - Please confirm the data entered.";
        } else if (statusMsg === 401)
        {
            statusMsgTxt = "Unauthorized - Please contact IT: Paylocity Credentials incorrect or expired.";
        } else if (statusMsg === 403)
        {
            statusMsgTxt = "Forbidden - Please contact IT.";
        } else if (statusMsg === 429)
        {
            statusMsgTxt = "Too Many Requests - Try again later.";
        } else if (statusMsg === 500)
        {
            statusMsgTxt = "Internal Server Error - Please contact IT.";
        } else{
            statusMsgTxt = "Please panic, since this should never display. Contact IT Immediately."
        }

        return ([statusMsg, statusMsgTxt])

    }

    return NextResponse.json((await outputData(companyId, employeeInput, requestOptions)))
}