const navItems = document.querySelectorAll('.nav-item');
const navIndicator = document.querySelector('.nav-indicator');
const cards = document.querySelectorAll('.card');

function setIndicator(el) {
    navIndicator.style.width = `${el.offsetWidth}px`;
    navIndicator.style.left = `${el.offsetLeft}px`;
}

window.addEventListener('DOMContentLoaded', () => {
    const activeNavItem = document.querySelector('.nav-item.active');
    if (activeNavItem) {
        setIndicator(activeNavItem);
    }
});

navItems.forEach(item => {
    item.addEventListener('click', () => {
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        setIndicator(item);
        
        const targetId = item.getAttribute('data-target');
        cards.forEach(card => {
            card.classList.remove('active');
            if (card.id === targetId) {
                card.classList.add('active');
            }
        });
    });
});

const overallCalculateBtn = document.getElementById("overallCalculateBtn");
overallCalculateBtn.addEventListener('click', calculateOverallAttendance);

function calculateOverallAttendance() {
    const classPerDay = parseInt(document.getElementById("classesPerDay").value) || 0;
    const requiredPercentage = parseInt(document.getElementById("requiredPercentage").value);
    const classesAttended = parseInt(document.getElementById("classesAttended").value);
    const totalClasses = parseInt(document.getElementById("totalClasses").value);

    const percentage = document.getElementById("Percentage");
    const Status = document.getElementById("Status");
    const daysToSkip = document.getElementById("daysToSkip");
    const attendanceAfterSkip = document.getElementById("attendanceAfterSkip");

    if (totalClasses === 0 || classPerDay === 0 || requiredPercentage === 0) {
        alert("Please enter valid numbers.");
        return;
    }

    const currentPercentage = (classesAttended / totalClasses) * 100;
    
    percentage.textContent = currentPercentage.toFixed(2) + "%";

    if (currentPercentage < requiredPercentage) {
        Status.textContent = "On Danger";
        Status.className = 'result-value danger';
        
        const requiredClasses = Math.ceil((requiredPercentage * totalClasses) / 100);
        const classesNeeded = requiredClasses - classesAttended;
        const daysNeeded = Math.ceil(classesNeeded / classPerDay);
        
        daysToSkip.textContent = `-${daysNeeded}`;
        attendanceAfterSkip.textContent = "Need to attend more classes";
    } else {
        Status.textContent = "On Track";
        Status.className = 'result-value success';
        
        const totalRequiredClasses = Math.ceil((totalClasses * requiredPercentage) / 100);
        const remainingClassesAllowedToMiss = classesAttended - totalRequiredClasses;
        const daysCount = Math.floor(remainingClassesAllowedToMiss / classPerDay);
        
        daysToSkip.textContent = daysCount > 0 ? daysCount : '0';
        attendanceAfterSkip.textContent = requiredPercentage + "%";
    }
    
    document.querySelector(".result-card").style.display = "block";
}

let subjectCount = 1;

const addSubjectBtn = document.getElementById("addSubjectBtn");
addSubjectBtn.addEventListener('click', addSubjectForm);

function addSubjectForm() {
    subjectCount++;
    
    const subjectForm = document.createElement('div');
    subjectForm.className = 'subject-form';
    subjectForm.innerHTML = `
        <div class="subject-header">
            <h3>Subject ${subjectCount}</h3>
            <button class="remove-subject-btn" title="Remove Subject"><i class="fas fa-times"></i></button>
        </div>
        <div class="form-group">
            <label>Subject Name</label>
            <input type="text" class="subject-name" placeholder="e.g., Mathematics">
        </div>
        <div class="form-group">
            <label>Required Attendance (%)</label>
            <input type="number" class="subject-required" min="0" max="100" value="75">
        </div>
        <div class="form-group">
            <label>Classes Attended</label>
            <input type="number" class="subject-attended" min="0">
        </div>
        <div class="form-group">
            <label>Total Classes</label>
            <input type="number" class="subject-total" min="1">
        </div>
    `;
    
    document.getElementById('subjects-container').appendChild(subjectForm);
    
    const removeButton = subjectForm.querySelector('.remove-subject-btn');
    removeButton.addEventListener('click', function() {
        subjectForm.remove();
    });
}

document.querySelector('.remove-subject-btn').addEventListener('click', function() {
    const subjectForms = document.querySelectorAll('.subject-form');
    if (subjectForms.length > 1) {
        this.closest('.subject-form').remove();
    } else {
        alert("You must have at least one subject!");
    }
});

const calculateSubjectsBtn = document.getElementById("calculateSubjectsBtn");
calculateSubjectsBtn.addEventListener('click', calculateSubjectsAttendance);

function calculateSubjectsAttendance() {
    const subjectForms = document.querySelectorAll('.subject-form');
    const resultsContainer = document.getElementById('subjectsResultContainer');
    
    resultsContainer.innerHTML = '';
    
    let validInput = true;
    let results = [];
    
    subjectForms.forEach((form, index) => {
        const subjectName = form.querySelector('.subject-name').value || `Subject ${index + 1}`;
        const requiredPercentage = parseInt(form.querySelector('.subject-required').value) || 0;
        const classesAttended = parseInt(form.querySelector('.subject-attended').value) || 0;
        const totalClasses = parseInt(form.querySelector('.subject-total').value) || 0;
        
        if (totalClasses === 0 || requiredPercentage === 0) {
            validInput = false;
            return;
        }
        
        const currentPercentage = (classesAttended / totalClasses) * 100;
        let status, statusClass, classesInfo, attendanceAfterInfo;
        
        if (currentPercentage < requiredPercentage) {
            status = "On Danger";
            statusClass = "danger";
            
            const requiredClasses = Math.ceil((requiredPercentage * totalClasses) / 100);
            const classesNeeded = requiredClasses - classesAttended;
            
            classesInfo = `-${classesNeeded} (need to attend)`;
            attendanceAfterInfo = "Need to attend more classes";
        } else {
            status = "On Track";
            statusClass = "success";
            
            const totalRequiredClasses = Math.ceil((totalClasses * requiredPercentage) / 100);
            const classesCanSkip = classesAttended - totalRequiredClasses;
            
            classesInfo = classesCanSkip > 0 ? classesCanSkip : 0;
            attendanceAfterInfo = requiredPercentage + "%";
        }
        
        results.push({
            name: subjectName,
            currentPercentage: currentPercentage.toFixed(2),
            status,
            statusClass,
            classesInfo,
            attendanceAfterInfo
        });
    });
    
    if (!validInput) {
        alert("Please enter valid numbers for all subjects.");
        return;
    }
    
    results.forEach(result => {
        const resultCard = document.createElement('div');
        resultCard.className = 'subject-result-card';
        resultCard.style.display = 'block';
        
        resultCard.innerHTML = `
            <div class="subject-title">${result.name}</div>
            <div class="result-item">
                <span class="result-label">Current Attendance</span>
                <span class="result-value">${result.currentPercentage}%</span>
            </div>
            <div class="result-item">
                <span class="result-label">Status</span>
                <span class="result-value ${result.statusClass}">${result.status}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Classes You Can ${result.statusClass === 'danger' ? 'Must Attend' : 'Skip'}</span>
                <span class="result-value">${result.classesInfo}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Attendance After ${result.statusClass === 'danger' ? 'Attending' : 'Skipping'}</span>
                <span class="result-value">${result.attendanceAfterInfo}</span>
            </div>
        `;
        
        resultsContainer.appendChild(resultCard);
    });
    
    resultsContainer.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', function() {
    const initialRemoveBtn = document.querySelector('.remove-subject-btn');
    if (initialRemoveBtn) {
        initialRemoveBtn.addEventListener('click', function() {
            const subjectForms = document.querySelectorAll('.subject-form');
            if (subjectForms.length > 1) {
                this.closest('.subject-form').remove();
            } else {
                alert("You must have at least one subject!");
            }
        });
    }
});