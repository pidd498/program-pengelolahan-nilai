// Data storage
let namaSiswa = [];
let nilaiSiswa = [];

// Generate input fields based on number of students
function generateInputFields() {
    const jumlah = parseInt(document.getElementById('jumlahSiswa').value);
    
    if (!jumlah || jumlah < 1) {
        alert('Masukkan jumlah siswa yang valid!');
        return;
    }
    
    const formContainer = document.getElementById('formContainer');
    formContainer.innerHTML = '';
    
    for (let i = 0; i < jumlah; i++) {
        const studentDiv = document.createElement('div');
        studentDiv.className = 'student-input';
        studentDiv.innerHTML = `
            <h4> Siswa ke-${i + 1}</h4>
            <div class="input-group">
                <div class="input-field">
                    <label for="nama${i}">Nama:</label>
                    <input type="text" id="nama${i}" placeholder="Masukkan nama siswa" required>
                </div>
                <div class="input-field">
                    <label for="nilai${i}">Nilai:</label>
                    <input type="number" id="nilai${i}" min="0" max="100" placeholder="0-100" required>
                </div>
            </div>
        `;
        formContainer.appendChild(studentDiv);
    }
    
    document.getElementById('calculateButton').style.display = 'block';
    document.getElementById('resultSection').style.display = 'none';
}

// Get predikat based on score
function getPredikat(nilai) {
    if (nilai >= 85) return 'A';
    if (nilai >= 70) return 'B';
    if (nilai >= 55) return 'C';
    return 'D';
}

// Calculate grades and display results
function calculateGrades() {
    const jumlah = parseInt(document.getElementById('jumlahSiswa').value);
    namaSiswa = [];
    nilaiSiswa = [];
    
    // Validate and collect data
    for (let i = 0; i < jumlah; i++) {
        const nama = document.getElementById(`nama${i}`).value.trim();
        const nilai = parseFloat(document.getElementById(`nilai${i}`).value);
        
        if (!nama) {
            alert(`Nama siswa ke-${i + 1} belum diisi!`);
            return;
        }
        
        if (isNaN(nilai) || nilai < 0 || nilai > 100) {
            alert(`Nilai siswa ke-${i + 1} tidak valid! (harus 0-100)`);
            return;
        }
        
        namaSiswa.push(nama);
        nilaiSiswa.push(nilai);
    }
    
    // Calculate total and average
    const total = nilaiSiswa.reduce((sum, nilai) => sum + nilai, 0);
    const rataRata = total / nilaiSiswa.length;
    
    // Display calculation process
    displayCalculationProcess(total, rataRata);
    
    // Display results table
    displayResultsTable();
    
    // Display class average
    displayClassAverage(rataRata);
    
    // Show result section
    document.getElementById('resultSection').style.display = 'block';
    
    // Scroll to results
    document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth' });
}

// Display calculation process
function displayCalculationProcess(total, rataRata) {
    const calculationDiv = document.getElementById('calculationProcess');
    const nilaiString = nilaiSiswa.map(n => Math.round(n)).join(' + ');
    
    calculationDiv.innerHTML = `
        <p><strong>Perhitungan Total:</strong></p>
        <div class="calculation-formula">${nilaiString} = ${total}</div>
        <p><strong>Perhitungan Rata-rata:</strong></p>
        <div class="calculation-formula">${total} ÷ ${nilaiSiswa.length} = ${rataRata.toFixed(1)}</div>
    `;
}

// Display results table
function displayResultsTable() {
    const tableDiv = document.getElementById('resultTable');
    
    let tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>No</th>
                    <th>Nama Siswa</th>
                    <th>Nilai</th>
                    <th>Predikat</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    for (let i = 0; i < namaSiswa.length; i++) {
        const predikat = getPredikat(nilaiSiswa[i]);
        tableHTML += `
            <tr>
                <td>${i + 1}</td>
                <td>${namaSiswa[i]}</td>
                <td>${nilaiSiswa[i]}</td>
                <td><span class="predikat predikat-${predikat}">${predikat}</span></td>
            </tr>
        `;
    }
    
    tableHTML += `
            </tbody>
        </table>
    `;
    
    tableDiv.innerHTML = tableHTML;
}

// Display class average
function displayClassAverage(rataRata) {
    const avgDiv = document.getElementById('classAverage');
    const predikatKelas = getPredikat(rataRata);
    
    avgDiv.innerHTML = `
        <h4>📈 Rata-rata Kelas</h4>
        <div class="avg-value">${Math.round(rataRata)}</div>
        <div class="avg-predikat">Predikat: ${predikatKelas}</div>
    `;
}

// Reset form
function resetForm() {
    document.getElementById('jumlahSiswa').value = '';
    document.getElementById('formContainer').innerHTML = '';
    document.getElementById('calculateButton').style.display = 'none';
    document.getElementById('resultSection').style.display = 'none';
    namaSiswa = [];
    nilaiSiswa = [];
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Add enter key support
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('jumlahSiswa').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            generateInputFields();
        }
    });
});
