// Data storage
let namaSiswa = [];
let nilaiSiswa = [];
let fileData = []; // Untuk menyimpan data dari file

// Tab switching
function switchTab(tabName) {
    // Hide all tabs
    document.getElementById('manualTab').classList.remove('active');
    document.getElementById('fileTab').classList.remove('active');
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab
    if (tabName === 'manual') {
        document.getElementById('manualTab').classList.add('active');
        document.querySelectorAll('.tab-btn')[0].classList.add('active');
    } else if (tabName === 'file') {
        document.getElementById('fileTab').classList.add('active');
        document.querySelectorAll('.tab-btn')[1].classList.add('active');
    }
}

// Handle file upload
function handleFileUpload(event) {
    const file = event.target.files[0];
    
    if (!file) return;
    
    // Check file type
    const allowedTypes = ['text/csv', 'text/plain', 'application/vnd.ms-excel'];
    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.csv') && !file.name.endsWith('.txt')) {
        alert('Format file tidak didukung! Gunakan file CSV atau TXT.');
        return;
    }
    
    // Read file
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            fileData = parseCSVData(e.target.result);
            
            if (fileData.length === 0) {
                alert('File kosong atau format salah!');
                return;
            }
            
            // Show preview
            showFilePreview(fileData);
            document.getElementById('uploadButtonText').textContent = `✓ File "${file.name}" terbaca (${fileData.length} siswa)`;
            document.getElementById('uploadButtonText').style.color = 'var(--success)';
            
        } catch (err) {
            alert('Error membaca file: ' + err.message);
        }
    };
    
    reader.readAsText(file);
}

// Parse CSV data
function parseCSVData(content) {
    const lines = content.split('\n').filter(line => line.trim() !== '');
    const data = [];
    
    for (let line of lines) {
        // Support both comma and tab as delimiter
        let parts;
        if (line.includes('\t')) {
            parts = line.split('\t');
        } else {
            parts = line.split(',');
        }
        
        if (parts.length >= 2) {
            const nama = parts[0].trim();
            const nilaiStr = parts[1].trim();
            const nilai = parseFloat(nilaiStr);
            
            if (nama && !isNaN(nilai) && nilai >= 0 && nilai <= 100) {
                data.push({
                    nama: nama,
                    nilai: nilai
                });
            }
        }
    }
    
    return data;
}

// Show file preview
function showFilePreview(data) {
    let tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>No</th>
                    <th>Nama Siswa</th>
                    <th>Nilai</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    for (let i = 0; i < data.length; i++) {
        tableHTML += `
            <tr>
                <td>${i + 1}</td>
                <td>${data[i].nama}</td>
                <td>${data[i].nilai}</td>
            </tr>
        `;
    }
    
    tableHTML += `
            </tbody>
        </table>
    `;
    
    document.getElementById('previewTable').innerHTML = tableHTML;
    document.getElementById('filePreview').style.display = 'block';
}

// Load data from file to form
function loadFromFile() {
    if (fileData.length === 0) {
        alert('Tidak ada data file untuk dimuat!');
        return;
    }
    
    // Set jumlah siswa
    document.getElementById('jumlahSiswa').value = fileData.length;
    
    // Generate input fields
    const formContainer = document.getElementById('formContainer');
    formContainer.innerHTML = '';
    
    for (let i = 0; i < fileData.length; i++) {
        const studentDiv = document.createElement('div');
        studentDiv.className = 'student-input';
        studentDiv.innerHTML = `
            <h4>Siswa ke-${i + 1}</h4>
            <div class="input-group">
                <div class="input-field">
                    <label for="nama${i}">Nama:</label>
                    <input type="text" id="nama${i}" placeholder="Masukkan nama siswa" value="${fileData[i].nama}" required>
                </div>
                <div class="input-field">
                    <label for="nilai${i}">Nilai:</label>
                    <input type="number" id="nilai${i}" min="0" max="100" placeholder="0-100" value="${fileData[i].nilai}" required>
                </div>
            </div>
        `;
        formContainer.appendChild(studentDiv);
    }
    
    document.getElementById('calculateButton').style.display = 'block';
    document.getElementById('resultSection').style.display = 'none';
    
    // Switch back to manual tab
    switchTab('manual');
    
    // Scroll to form
    document.getElementById('formContainer').scrollIntoView({ behavior: 'smooth' });
}

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
    document.getElementById('fileUpload').value = '';
    document.getElementById('filePreview').style.display = 'none';
    document.getElementById('uploadButtonText').textContent = 'Klik untuk memilih file atau drag & drop';
    document.getElementById('uploadButtonText').style.color = 'var(--primary)';
    namaSiswa = [];
    nilaiSiswa = [];
    fileData = [];
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Export to CSV
function exportToCSV() {
    if (namaSiswa.length === 0) {
        alert('Tidak ada data untuk diekspor!');
        return;
    }
    
    // Create CSV content
    let csvContent = 'data:text/csv;charset=utf-8,%EF%BB%BF'; // Add BOM for UTF-8
    csvContent += 'No,Nama Siswa,Nilai,Predikat\n';
    
    for (let i = 0; i < namaSiswa.length; i++) {
        const predikat = getPredikat(nilaiSiswa[i]);
        const row = `${i + 1},"${namaSiswa[i]}",${nilaiSiswa[i]},${predikat}`;
        csvContent += row + '\n';
    }
    
    // Add summary
    const total = nilaiSiswa.reduce((sum, nilai) => sum + nilai, 0);
    const rataRata = total / nilaiSiswa.length;
    const predikatKelas = getPredikat(rataRata);
    csvContent += '\n,,Ringkasan,\n';
    csvContent += `,,Total Nilai,${total}\n`;
    csvContent += `,,Rata-rata,${rataRata.toFixed(2)}\n`;
    csvContent += `,,Predikat Kelas,${predikatKelas}\n`;
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nilai_siswa_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    
    link.click();
    document.body.removeChild(link);
    
    alert('Data berhasil diekspor!');
}

// Add enter key support
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('jumlahSiswa').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            generateInputFields();
        }
    });
    
    // Drag and drop support for file upload
    const fileUploadLabel = document.querySelector('.file-input-label');
    const fileInput = document.getElementById('fileUpload');
    
    if (fileUploadLabel) {
        fileUploadLabel.addEventListener('dragover', function(e) {
            e.preventDefault();
            fileUploadLabel.style.background = 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.15))';
            fileUploadLabel.style.borderColor = 'var(--secondary)';
        });
        
        fileUploadLabel.addEventListener('dragleave', function(e) {
            e.preventDefault();
            fileUploadLabel.style.background = 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.05))';
            fileUploadLabel.style.borderColor = 'var(--primary)';
        });
        
        fileUploadLabel.addEventListener('drop', function(e) {
            e.preventDefault();
            fileUploadLabel.style.background = 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.05))';
            fileUploadLabel.style.borderColor = 'var(--primary)';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                fileInput.files = files;
                handleFileUpload({ target: { files: files } });
            }
        });
    }
});
