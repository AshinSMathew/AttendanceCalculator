const btn = document.querySelector(".btn");

btn.onclick = bunkCalculations;


function bunkCalculations(){
    const classPerDay=parseInt(document.getElementById("classesPerDay").value) || 0;
    const requiredPercentage=parseInt(document.getElementById("requiredPercentage").value);
    const classesAttended=parseInt(document.getElementById("classesAttended").value);
    const totalClasses=parseInt(document.getElementById("totalClasses").value);

    const percentage = document.getElementById("Percentage");
    const Status = document.getElementById("Status");
    const daysToSkip = document.getElementById("daysToSkip");
    const attendanceAfterSkip = document.getElementById("attendanceAfterSkip");

    if (totalClasses === 0 || classPerDay === 0) {
        alert("Please enter valid numbers.");
        return;
    }


    const currentPercentage = (classesAttended / totalClasses)*100;
    const totalClassAfterBunking = Math.floor((classesAttended * 100) / requiredPercentage);
    const classBunked = totalClassAfterBunking - classesAttended;
    const daysCount= Math.ceil(classBunked / classPerDay);

    percentage.textContent = currentPercentage + "%";

    if(currentPercentage < requiredPercentage){
        percentage.textContent = currentPercentage.toFixed(2) + "%";
        Status.textContent = "On Danger";
        Status.className = 'result-value warning';
        daysToSkip.textContent = '0';
    }
    else{
        percentage.textContent = currentPercentage.toFixed(2) + "%";
        Status.textContent = "On Track";
        Status.className = 'result-value success';
        daysToSkip.textContent = daysCount;
        attendanceAfterSkip.textContent = requiredPercentage+"%";
    }
    document.querySelector(".result-card").style.display= "block";
}