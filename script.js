// --- TAB SWITCHING LOGIC ---
function switchTab(tab) {
    const sipSection = document.getElementById('sip-calculator');
    const swpSection = document.getElementById('swp-calculator');
    const tabs = document.querySelectorAll('.tab');

    tabs.forEach(t => t.classList.remove('active'));
    document.querySelector(`.tab[onclick="switchTab('${tab}')"]`).classList.add('active');

    if (tab === 'sip') {
        sipSection.classList.add('active');
        swpSection.classList.remove('active');
    } else {
        swpSection.classList.add('active');
        sipSection.classList.remove('active');
    }
}

// --- SIP CALCULATOR ---
function calculateSIP() {
    const monthlyInvestment = parseFloat(document.getElementById('sip-amount').value);
    const annualRate = parseFloat(document.getElementById('sip-rate').value);
    const years = parseFloat(document.getElementById('sip-years').value);

    if (isNaN(monthlyInvestment) || isNaN(annualRate) || isNaN(years)) return;

    const months = years * 12;
    const monthlyRate = annualRate / 12 / 100;

    const maturityValue = monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    const totalInvested = monthlyInvestment * months;
    const estimatedReturns = maturityValue - totalInvested;

    document.getElementById('sip-invested').textContent = `₹${totalInvested.toLocaleString()}`;
    document.getElementById('sip-returns').textContent = `₹${estimatedReturns.toLocaleString()}`;
    document.getElementById('sip-maturity').textContent = `₹${maturityValue.toLocaleString()}`;

    drawChart('sip-chart', ['Invested', 'Returns'], [totalInvested, estimatedReturns], ['#F57329', '#2A9D8F']);
}

// --- SWP CALCULATOR ---
function calculateSWP() {
    const totalInvestment = parseFloat(document.getElementById('swp-investment').value);
    const monthlyWithdrawal = parseFloat(document.getElementById('swp-withdrawal').value);
    const annualRate = parseFloat(document.getElementById('swp-rate').value);
    const years = parseFloat(document.getElementById('swp-years').value);

    if (isNaN(totalInvestment) || isNaN(monthlyWithdrawal) || isNaN(annualRate) || isNaN(years)) return;

    const months = years * 12;
    const monthlyRate = annualRate / 12 / 100;

    let balance = totalInvestment;
    let totalWithdrawn = 0;

    for (let i = 0; i < months; i++) {
        balance = balance * (1 + monthlyRate) - monthlyWithdrawal;
        if (balance < 0) {
            balance = 0;
            break;
        }
        totalWithdrawn += monthlyWithdrawal;
    }

    const returnsGenerated = totalWithdrawn - totalInvestment + balance;

    document.getElementById('swp-withdrawn').textContent = `₹${totalWithdrawn.toLocaleString()}`;
    document.getElementById('swp-returns').textContent = `₹${returnsGenerated.toLocaleString()}`;
    document.getElementById('swp-balance').textContent = `₹${balance.toLocaleString()}`;

    drawChart('swp-chart', ['Withdrawn', 'Returns', 'Balance'], [totalWithdrawn, returnsGenerated, balance], ['#5E75DF', '#2A9D8F', '#F57329']);
}

// --- CHART DRAWING FUNCTION ---
let charts = {};

function drawChart(canvasId, labels, data, colors) {
    if (charts[canvasId]) {
        charts[canvasId].destroy();
    }
    const ctx = document.getElementById(canvasId).getContext('2d');
    charts[canvasId] = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}
