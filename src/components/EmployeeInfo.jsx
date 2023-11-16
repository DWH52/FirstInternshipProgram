"use client"

import React, { useEffect, useState } from 'react';


function EmployeeInfo() {

  //page state for submission
  const [pageState, setPageState] = useState(false);
  const [employeeExists, setEmployeeExists] = useState(true);
  const [responseMessage, setResponseMessage] = useState("");
  var res;

  //employee ID input State Manager  
  const [employeeIdNumber, setEmployeeIdNumber] = useState('');
  
  //Data Field Generative Text States
  const [displayedEmployeeId, setDisplayedEmployeeId] = useState(null);
  const [firstNameField, setFirstNameField] = useState([]);
  const [lastNameField, setLastNameField] = useState([]);
  const [workAddressField, setWorkAddressField] = useState([]);
  const [workEmailAddress, setWorkEmailAddress] = useState([]);
  const [jobTitleField, setJobTitleField] = useState([]);
  const [isSupervisorReviewer, setIsSupervisorReviewer] = useState();
  const [employmentType, setEmploymentType] = useState();
  const [effectiveDate, setEffectiveDate] = useState();
  const [companyCodeOptions, setCompanyCodeOptions] = useState([]);
  const [currentPositionCode, setCurrentPositionCode] = useState();
  const [currentWorkLocation, setCurrentWorkLocation] = useState([]);
  const [currentWorkDepartment, setCurrentWorkDepartment] = useState([]);
  const [currentWorkNA, setCurrentWorkNA] = useState([]);
  const [companyCostCenterOneOptions, setCompanyCostCenterOneOptions] = useState([]);
  const [companyCostCenterTwoOptions, setCompanyCostCenterTwoOptions] = useState([]);
  const [companyCostCenterThreeOptions, setCompanyCostCenterThreeOptions] = useState([]);
  const [currentSupervisorReviewer, setCurrentSupervisorReviewer] = useState();

  //Input for Update Fields
  const [newWorkEmailAddress, setNewWorkEmailAddress] = useState(workEmailAddress)
  const [selectedPositionOption, setSelectedPositionOption] = useState([])
  const [newWorkLocation, setNewWorkLocation] = useState([])
  const [newWorkDepartment, setNewWorkDepartment] = useState([])
  const [newWorkNA, setNewWorkNA] = useState([])
  const [newEmploymentType, setNewEmploymentType] = useState("RFT")
  const [newJobTitle, setNewJobTitle] = useState(jobTitleField)
  const [newWorkAddress1, setNewWorkAddress1] = useState([])
  const [newWorkCity, setNewWorkCity] = useState([])
  const [newWorkState, setNewWorkState] = useState([])
  const [newWorkPostalCode, setNewWorkPostalCode] = useState([])
  var [newSupervisorReviewerId, setNewSupervisorReviewerId] = useState("")

  //refresh page inside the component
  function refreshPage(){
    window.location.reload(false);
  }
  
  

  //generates data on page-load
  useEffect(() => {
    generateCompanyPositions();
    generateCompanyCostCenterOne();
    generateCompanyCostCenterTwo();
    generateCompanyCostCenterThree();
  }, []);

  //gets employee data for use
  async function searchEmployee(){
    var employeeDataToInformation = [];
    var employeeData = await fetch(`http://localhost:3000/api/employee_data?employeeInput=${employeeIdNumber}`, {method: "GET"})
    .then(response => response.json())

    //map out data from api GET
    employeeDataToInformation = Object.keys(employeeData).map((key) => [key, employeeData[key]])
    
    //checks to see if employee exists, if length === 1 employee DNE
    if(employeeDataToInformation.length === 1){
      setEmployeeExists(false);
    } else{
      setEmployeeExists(true);
    }
    
    //Parse fetch response, set fields equal to respective keys' values
    for (let i = 0; i < employeeDataToInformation.length; i++)
    {
      if (employeeDataToInformation[i][0] === "firstName")
      {
        setFirstNameField(employeeDataToInformation[i][1])
      }
      else if (employeeDataToInformation[i][0] === "lastName")
      {
        setLastNameField(employeeDataToInformation[i][1])
      }
      else if (employeeDataToInformation[i][0] === "departmentPosition")
      {
        setCurrentSupervisorReviewer(employeeDataToInformation[i][1].reviewerEmployeeId);
        setJobTitleField([employeeDataToInformation[i][1].jobTitle]);
        setIsSupervisorReviewer(employeeDataToInformation[i][1].isSupervisorReviewer);
        setEmploymentType(employeeDataToInformation[i][1].employeeType);
        setEffectiveDate(employeeDataToInformation[i][1].effectiveDate);
        setCurrentPositionCode(employeeDataToInformation[i][1].positionCode);
        setCurrentWorkLocation(employeeDataToInformation[i][1].costCenter1);
        setCurrentWorkDepartment(employeeDataToInformation[i][1].costCenter2);
        setCurrentWorkNA(employeeDataToInformation[i][1].costCenter3); 
      }
      else if (employeeDataToInformation[i][0] === "workAddress")
      {
        setWorkAddressField([employeeDataToInformation[i][1].address1," ", employeeDataToInformation[i][1].city,", ", employeeDataToInformation[i][1].state," ", employeeDataToInformation[i][1].postalCode])
        setWorkEmailAddress([employeeDataToInformation[i][1].emailAddress])
      }
      
    }
  }

  //cleans up output and translates to provide context
  function cleanCostCenterCode(costCenter, num){
    fetch(`http://localhost:3000/api/company_codes?codeResource=costcenter${num}`, {method: "GET"})
    .then(response => response.json())
    .then((val) => {
      for(let x = 0; x < val.length; x++){
        if (val[x].code === costCenter){
          if(num === 1){
            setCurrentWorkLocation([val[x].code, " : ", val[x].description])
          } else if (num === 2){
            setCurrentWorkDepartment([val[x].code, " : ", val[x].description])
          } else if (num === 3){
            setCurrentWorkNA([val[x].code, " : ", val[x].description])
          }
        }   
      }
    })

    if(num === 1){
      return currentWorkLocation
    } else if(num === 2){
      return currentWorkDepartment
    } else if(num === 3){
      return currentWorkNA
    }
  }

  //cleans up output and translates to provide context
  function cleanPositionCode(positionCode){
    fetch(`http://localhost:3000/api/company_codes?codeResource=positions`, {method: "GET"})
    .then(response => response.json())
    .then((val) => {
      for(let x = 0; x < val.length; x++){
        if (val[x].code === positionCode){
          setCurrentPositionCode([val[x].code, " : ", val[x].description])
        }   
      }
    })
    return currentPositionCode
  }

  //api call to get position codes
  async function generateCompanyPositions(){
    await fetch(`http://localhost:3000/api/company_codes?codeResource=positions`, {method: "GET"})
      .then(response => response.json())
      .then((val) => setCompanyCodeOptions(val))
  }

  //api call to get costcenter1 codes
  async function generateCompanyCostCenterOne(){
    await fetch(`http://localhost:3000/api/company_codes?codeResource=costcenter1`, {method: "GET"})
      .then(response => response.json())
      .then((val) => setCompanyCostCenterOneOptions(val))
  }

  //api call to get costcenter2 codes
  async function generateCompanyCostCenterTwo(){
    await fetch(`http://localhost:3000/api/company_codes?codeResource=costcenter2`, {method: "GET"})
      .then(response => response.json())
      .then((val) => setCompanyCostCenterTwoOptions(val))
  }

  //api call to get costcenter3 codes
  async function generateCompanyCostCenterThree(){
    await fetch(`http://localhost:3000/api/company_codes?codeResource=costcenter3`, {method: "GET"})
      .then(response => response.json())
      .then((val) => setCompanyCostCenterThreeOptions(val))
  }

  //handles click on search element
  async function handleSearchClick(e){
    e.preventDefault();
    setDisplayedEmployeeId(employeeIdNumber)
    
    searchEmployee();
  }

  //handles click on submit element
  async function handleSubmitClick(e){
    e.preventDefault();
  
    //Prevention methods for empty fields
    if(newSupervisorReviewerId === ""){
      newSupervisorReviewerId = currentSupervisorReviewer;
    }

    if(newWorkAddress1 === ""){
      setNewWorkAddress1(workAddressField[0])
    }

    if(newWorkCity === ""){
      setNewWorkCity(workAddressField[2])
    }

    if(newWorkState === ""){
      setNewWorkState(workAddressField[4])
    }

    if(newWorkPostalCode === ""){
      setNewWorkPostalCode(workAddressField[6])
    }

    if(newWorkLocation === ""){
      setNewWorkLocation(currentWorkLocation)
    }

    if(newWorkDepartment === ""){
      setNewWorkDepartment(currentWorkDepartment)
    }

    if(newWorkNA === ""){
      setNewWorkNA(currentWorkNA)
    }

    if(selectedPositionOption === ""){
      setSelectedPositionOption(currentPositionCode)
    }

    // --------END OF DEFAULT PREVENTION METHODS--------------

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const options = {
      method:'POST',
      headers: myHeaders,
      body: {},
    }
    
    var catchRes = await fetch(`http://localhost:3000/api/employee_data?employeeInput=${employeeIdNumber}&workEmailAddress=${newWorkEmailAddress}&positionCode=${selectedPositionOption}&employmentType=${newEmploymentType}&workLocation=${newWorkLocation}&workDepartment=${newWorkDepartment}&workNA=${newWorkNA}&jobTitle=${newJobTitle}&workAddress1=${newWorkAddress1}&workCity=${newWorkCity}&workState=${newWorkState}&workPostalCode=${newWorkPostalCode}&newSupervisorReviewerId=${newSupervisorReviewerId}`, options)
    res = (await catchRes.json());
    
    //changes page state to indicate the information has been sent and updated or any errors.
    setResponseMessage(res[1])
    setPageState(true)
  }

  /*rendered HTML/React on the DOM
  Organization:

      1) <div> for the overall page state, if pageState === false,
      the page will show it's original content, pageState is false by default.
      Otherwise will show the 'resolved action screen' indicating the command
      is complete and prompts the user to update another employee if needed.
      
        a) <form> for looking up the target employee, calls a GET function on
        search submission to generate employee data. If the length of data is
        equivalent to that of a non-existing element, the page is rendered to show
        that the target employee ID does not have any corresponding data.

        b) <div> that houses the error message if an employee does not exist
        as described in search form (a)

        c) <div> that wraps the employee data and update fields to only be shown if
        the employee exists.

          i) <div> that shows generated employee data from the search submission,
          this information does not change or re-render until new search submission.
          Does not render if search form (a) is left blank.

          ii) <div> that houses the form fields to update information.
          Does not render if search form (a) is left blank.

      2) <div> that shows the 'resolved action screen' as described in div (1).
      Displays if pageState === true.  
  */
  return (
  <>

    <div className={!pageState? "w-full": "hidden"}>
      <br />
        <h2 className="text-black"><strong>Select Employee to be promoted to Supervisor.</strong></h2>
      <br />

      <form name= "employeeSearchBox" target="_parent" onSubmit={e=> { e.preventDefault()}}>
        <input 
          className = "text-black p-2 rounded border border-black" 
          value = {employeeIdNumber} 
          placeholder = "Input Employee ID Number" 
          onChange={e=> setEmployeeIdNumber(e.target.value)}/>
        <button 
          className = "text-black mx-2 p-2 border border-solid rounded-md border-black hover:bg-cyan-950 hover:text-white" 
          name = "employeeSearchBox" 
          type ="button" 
          onClick={e=> handleSearchClick(e)}><strong>Submit</strong></button>
      </form>

      <div className={employeeExists? "hidden" : "w-full h-full my-4 justify-center"}>
        <h1 className="flex text-black justify-center content-center"><strong>EMPLOYEE WITH ID: {displayedEmployeeId} DOES NOT EXIST. </strong></h1>
      </div>
      
      <div className = {!employeeExists? "hidden" : "w-full h-full my-4 justify-center"}>
        <div className={(displayedEmployeeId === null || displayedEmployeeId === "")? "hidden" : "border border-black my-8 p-6 w-full grid grid-cols-2 space-x-16"}>
          <ul className="h-full my-4 bg-white rounded-md p-4 break-words text-black">  
            <strong>The Employee Information is the following...</strong>
            <br />
            <br />
            <li className="flex">Employee ID: {displayedEmployeeId}</li>
            <br />
            <li className="flex">Employee Name: {`${firstNameField} ${lastNameField}`} </li>
            <br />
            <li className="flex">Contact Information: Email- {workEmailAddress} </li>
            <br />
            <li className="flex">Work Address: {workAddressField} </li>
            <br />
            <li className="flex">Current Work Location: {cleanCostCenterCode(currentWorkLocation, 1)}</li>
            <li className="flex">Current Work Department: {cleanCostCenterCode(currentWorkDepartment, 2)}</li>
            <li className="flex">Current Work NA: {cleanCostCenterCode(currentWorkNA, 3)}</li>
            <li className="flex">Current Job Title: {jobTitleField} </li>
            <li className="flex">Position Code: {cleanPositionCode(currentPositionCode)}</li>
            <li className="flex"> Employment Type: {employmentType} </li>
            <li className={isSupervisorReviewer && isSupervisorReviewer !== null ? "flex" : "hidden"}><strong>Supervisor/Reviewer</strong></li>
            <br />
            <li className="flex">Effective Date: {effectiveDate}</li>
          </ul>
      
          <div className={displayedEmployeeId === null || displayedEmployeeId === ""? "hidden" : "h-full my-4 bg-white rounded-md p-4 break-words text-black"}><strong>Verify/Update the following information.</strong>
            <br />
            <form action="POST">

              <br />
              Work Street Address: 
              <input 
              className = "max-w-full w-full text-black border border-black my-2 p-2 rounded" 
              value = {newWorkAddress1}
              placeholder = {workAddressField[0]} 
              onChange={e=> setNewWorkAddress1(e.target.value)}/>
              <br />

              Work City: 
              <input 
              className = "max-w-full w-full text-black border border-black my-2 p-2 rounded" 
              value = {newWorkCity}
              placeholder = {workAddressField[2]} 
              onChange={e=> setNewWorkCity(e.target.value)}/>
              <br />

              Work State: 
              <input 
              className = "max-w-full w-full text-black border border-black my-2 p-2 rounded" 
              value = {newWorkState}
              placeholder = {workAddressField[4]} 
              onChange={e=> setNewWorkState(e.target.value)}/>
              <br />

              Work Postal Code: 
              <input 
              className = "max-w-full w-full text-black border border-black my-2 p-2 rounded" 
              value = {newWorkPostalCode}
              placeholder = {workAddressField[6]} 
              onChange={e=> setNewWorkPostalCode(e.target.value)}/>
              <br />

              Work Email Address: 
              <input 
              className = "max-w-full w-full text-black border border-black my-2 p-2 rounded" 
              value = {newWorkEmailAddress}
              placeholder = {workEmailAddress} 
              onChange={e=> setNewWorkEmailAddress(e.target.value)}/>
              <br />

              Work Location:
              <select className="max-w-full w-full text-black my-2 p-2 border border-solid rounded-md border-black" defaultValue = {""} onChange={(e)=> setNewWorkLocation(e.target.value)}>
                <option value="">Select new location code...</option>
                {
                  companyCostCenterOneOptions.map((opts,i)=> <option key={i}  value = {opts.code}>{opts.code} : {opts.description}</option>)
                }
              </select>
              <br />

              Work Department:
              <select className="max-w-full w-full text-black my-2 p-2 border border-solid rounded-md border-black" defaultValue = {""} onChange={(e)=> setNewWorkDepartment(e.target.value)}>
                <option value="">Select new department code...</option>
                {
                  companyCostCenterTwoOptions.map((opts,i)=> <option key={i}  value = {opts.code}>{opts.code} : {opts.description}</option>)
                }
              </select>
              <br />

              Work NA:
              <select className="max-w-full w-full text-black my-2 p-2 border border-solid rounded-md border-black" defaultValue = {""} onChange={(e)=> setNewWorkNA(e.target.value)}>
                <option value="">Select new NA code...</option>
                {
                  companyCostCenterThreeOptions.map((opts,i)=> <option key={i}  value = {opts.code}>{opts.code} : {opts.description}</option>)
                }
              </select>

              <br />
              

              Job Title: 
              <input 
              className = "max-w-full w-full text-black border border-black my-2 p-2 rounded" 
              value = {newJobTitle}
              placeholder = {jobTitleField} 
              onChange={e=> setNewJobTitle(e.target.value)}/>
              
              <br />
              Position Selection:
              <select className="max-w-full w-full text-black my-2 p-2 border border-solid rounded-md border-black" defaultValue = {""} onChange={(e)=> {setSelectedPositionOption(e.target.value)}}>
                <option value="">Select new position code...</option>
                {
                  companyCodeOptions.map((opts,i)=> <option key={i}  value = {opts.code}>{opts.code}</option>)
                }
              </select>

              <br />
              Employment Type:
              <select className ="max-w-full w-full text-black my-2 p-2 border border-solid rounded-md border-black" onChange={(e)=> setNewEmploymentType(e.target.value)}>
                <option value="RFT">RFT - Regular Full Time</option>
                <option value="TFT">TFT - Temporary Full Time</option>
                <option value="RPT">RPT - Regular Part Time</option>
              </select>

              <br />
              Set Employee's Supervisor/Reviewer 
              <input 
              className = "max-w-full w-full text-black border border-black my-2 p-2 rounded" 
              value = {newSupervisorReviewerId}
              placeholder = "Input Supervisor/Reviewer Employee ID" 
              onChange={e=> setNewSupervisorReviewerId(e.target.value)}/>
              
              <br />             
              <button 
                type="button" 
                className="text-black my-2 p-2 border border-solid rounded-md border-black hover:bg-cyan-950 hover:text-white"
                onClick={e => {handleSubmitClick(e)}}> 
                <strong>Update</strong> 
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
      
    <div className={!pageState?  "hidden" : "w-full h-full my-4 justify-center"}>
      <h1 className="flex text-black justify-center content-center"><strong>{responseMessage}</strong></h1>
      <button className="w-full text-black my-2 p-2 border border-solid rounded-md border-black hover:bg-cyan-950 hover:text-white" onClick={refreshPage}>Update Another Employee</button>
    </div>

  </>
  )
}

export default EmployeeInfo