const habits = [
"⏰ Wake 6AM",
"🏋️ Gym",
"🙏 Prayer",
"🚿 Cold Shower",
"👔 Dress Fresh",
"🚫 NoFap",
"📚 Reading",
"💻 Project Work",
"🚭 No Drink/Smoke",
"📵 Social Detox",
"📩 Job Apply",
"📱 No Phone 2Hr",
"💰 Budget <200",
"📝 Fill 10PM"
];

const days = 30;
const habitList = document.getElementById("habitList");
const table = document.getElementById("habitTable");

let xp = localStorage.getItem("xp") ? parseInt(localStorage.getItem("xp")) : 0;
let level = Math.floor(xp / 500) + 1;

document.getElementById("xp").innerText = xp;
document.getElementById("level").innerText = level;

habits.forEach(h => {
    let div = document.createElement("div");
    div.className = "habit";
    div.innerText = h;
    habitList.appendChild(div);
});

for (let i = 0; i < habits.length; i++) {
    let row = table.insertRow();
    for (let j = 0; j < days; j++) {
        let cell = row.insertCell();
        let cb = document.createElement("input");
        cb.type = "checkbox";
        cb.checked = localStorage.getItem(i+"-"+j) === "true";
        cb.onchange = function() {
            localStorage.setItem(i+"-"+j, cb.checked);
            update();
        };
        cell.appendChild(cb);
    }
}

function update() {
    const checkboxes = document.querySelectorAll("input");
    let checked = 0;
    checkboxes.forEach(cb => {
        if (cb.checked) checked++;
    });

    let percent = ((checked / checkboxes.length) * 100).toFixed(2);
    document.getElementById("percent").innerText = percent;

    xp = checked * 10;
    level = Math.floor(xp / 500) + 1;

    localStorage.setItem("xp", xp);

    document.getElementById("xp").innerText = xp;
    document.getElementById("level").innerText = level;

    updateChart();
}

const ctx = document.getElementById("chart");
let chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: Array.from({length: 30}, (_, i) => "Day " + (i+1)),
        datasets: [{
            label: "Performance %",
            data: [],
            borderColor: "lime"
        }]
    }
});

function updateChart() {
    let daily = [];
    for (let d = 0; d < days; d++) {
        let count = 0;
        for (let h = 0; h < habits.length; h++) {
            if (localStorage.getItem(h+"-"+d) === "true") count++;
        }
        daily.push((count / habits.length) * 100);
    }
    chart.data.datasets[0].data = daily;
    chart.update();
}

update();

// 10PM Notification
if ("Notification" in window) {
    Notification.requestPermission();
}

setInterval(() => {
    let now = new Date();
    if (now.getHours() === 22 && now.getMinutes() === 0) {
        new Notification("📝 Fill your 10PM habit!");
    }
}, 60000);

// Monthly Reset
let month = new Date().getMonth();
if (localStorage.getItem("month") != month) {
    localStorage.clear();
    localStorage.setItem("month", month);
}