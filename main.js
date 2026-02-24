// Main JavaScript

// Inisialisasi AOS
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Load data saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    
    // Inisialisasi berdasarkan halaman
    const path = window.location.pathname;
    
    if (path.includes('dashboard.html')) {
        initDashboard();
    } else if (path.includes('tambah-tabungan.html')) {
        initFormTabungan();
    } else if (path.includes('rekap.html')) {
        initRekap();
    } else if (path.includes('index.html') || path === '/' || path.endsWith('/')) {
        initHomepage();
    }
    
    // Inisialisasi navbar toggle
    initNavbar();
});

// Inisialisasi Navbar
function initNavbar() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('show');
        });
    }
}

// Inisialisasi Homepage
function initHomepage() {
    // Animasi counter untuk stats
    animateCounter('totalUsers', 1234);
    animateCounter('totalSavings', 10000000, true);
    animateCounter('totalTransactions', 5678);
    animateCounter('totalGoals', 892);
}

// Animasi counter
function animateCounter(elementId, targetValue, isRupiah = false) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    let current = 0;
    const increment = targetValue / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= targetValue) {
            current = targetValue;
            clearInterval(timer);
        }
        
        if (isRupiah) {
            element.textContent = formatRupiah(Math.round(current));
        } else {
            element.textContent = Math.round(current).toLocaleString();
        }
    }, 20);
}

// Inisialisasi Dashboard
function initDashboard() {
    updateDashboardStats();
    updateRecentTransactions();
    initCharts();
}

// Update statistik dashboard
function updateDashboardStats() {
    const stats = getStatistics();
    const today = new Date();
    const bulanIni = (today.getMonth() + 1).toString();
    const tahunIni = today.getFullYear().toString();
    const statsBulanIni = getStatistics(bulanIni, tahunIni);
    
    document.getElementById('totalTabungan').textContent = formatRupiah(stats.total);
    document.getElementById('bulanIni').textContent = formatRupiah(statsBulanIni.total);
    document.getElementById('totalTransaksi').textContent = stats.count;
    document.getElementById('rataRata').textContent = formatRupiah(stats.average);
}

// Update transaksi terbaru
function updateRecentTransactions() {
    const recent = getRecentTransactions(5);
    const tbody = document.getElementById('recentTransactions');
    
    if (recent.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">Belum ada transaksi</td></tr>';
        return;
    }
    
    let html = '';
    recent.forEach((item, index) => {
        html += `
            <tr>
                <td>${index + 1}</td>
                <td><span class="badge">${item.nama}</span></td>
                <td>${item.tanggal}</td>
                <td>${namaBulan[parseInt(item.bulan) - 1]}</td>
                <td>${item.tahun}</td>
                <td>${formatRupiah(item.jumlah)}</td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

// Inisialisasi Chart
function initCharts() {
    // Chart 7 hari
    const ctx7Hari = document.getElementById('chart7Hari')?.getContext('2d');
    if (ctx7Hari) {
        const data7Hari = getLast7DaysData();
        
        new Chart(ctx7Hari, {
            type: 'line',
            data: {
                labels: data7Hari.map(d => d.date),
                datasets: [{
                    label: 'Total Tabungan (Rp)',
                    data: data7Hari.map(d => d.total),
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'Rp ' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Chart per bulan
    const ctxPerBulan = document.getElementById('chartPerBulan')?.getContext('2d');
    if (ctxPerBulan) {
        const monthlyData = getMonthlyData();
        
        new Chart(ctxPerBulan, {
            type: 'doughnut',
            data: {
                labels: monthlyData.map(d => d.bulan),
                datasets: [{
                    data: monthlyData.map(d => d.total),
                    backgroundColor: [
                        '#667eea', '#764ba2', '#f687b3', '#fbbf6e',
                        '#4fd1c5', '#fc8181', '#9f7aea', '#ed64a6',
                        '#f6ad55', '#68d391', '#63b3ed', '#f56565'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = context.raw;
                                return `Rp ${value.toLocaleString()}`;
                            }
                        }
                    }
                }
            }
        });
    }
}

// Inisialisasi Form Tabungan
function initFormTabungan() {
    const form = document.getElementById('formTabungan');
    if (!form) return;
    
    // Set default tanggal ke hari ini
    const today = new Date();
    document.getElementById('tanggal').value = today.getDate();
    document.getElementById('bulan').value = today.getMonth() + 1;
    document.getElementById('tahun').value = today.getFullYear();
    
    // Handle form submit
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nama = document.getElementById('nama').value;
        const tanggal = document.getElementById('tanggal').value;
        const bulan = document.getElementById('bulan').value;
        const tahun = document.getElementById('tahun').value;
        const jumlah = parseInt(document.getElementById('jumlah').value);
        
        // Validasi
        if (tanggal < 1 || tanggal > 31) {
            showNotification('Tanggal harus antara 1-31', 'error');
            return;
        }
        
        if (jumlah <= 0) {
            showNotification('Jumlah harus lebih dari 0', 'error');
            return;
        }
        
        // Tambah data
        tambahData({
            nama,
            tanggal,
            bulan,
            tahun,
            jumlah
        });
        
        // Reset form
        form.reset();
        
        // Set ke tanggal sekarang
        document.getElementById('tanggal').value = today.getDate();
        document.getElementById('bulan').value = today.getMonth() + 1;
        document.getElementById('tahun').value = today.getFullYear();
        
        // Notifikasi sukses
        showNotification('Data tabungan berhasil ditambahkan!');
    });
}

// Inisialisasi Halaman Rekap
function initRekap() {
    // Inisialisasi filter tahun
    initTahunFilter();
    
    // Tampilkan data
    updateTabelRekap();
    
    // Event listener untuk filter
    document.getElementById('filterBulan').addEventListener('change', filterData);
    document.getElementById('filterTahun').addEventListener('change', filterData);
}

// Inisialisasi filter tahun
function initTahunFilter() {
    const filterTahun = document.getElementById('filterTahun');
    if (!filterTahun) return;
    
    const tahunSekarang = new Date().getFullYear();
    
    for (let tahun = tahunSekarang + 1; tahun >= 2020; tahun--) {
        const option = document.createElement('option');
        option.value = tahun;
        option.textContent = tahun;
        filterTahun.appendChild(option);
    }
}

// Update tabel rekap
function updateTabelRekap() {
    const filterBulan = document.getElementById('filterBulan')?.value || '';
    const filterTahun = document.getElementById('filterTahun')?.value || '';
    
    const data = getDataFiltered(filterBulan, filterTahun);
    const tbody = document.getElementById('tbodyTabungan');
    
    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">Belum ada data tabungan</td></tr>';
    } else {
        let html = '';
        sortByDate(data, false).forEach((item, index) => {
            html += `
                <tr>
                    <td>${index + 1}</td>
                    <td><span class="badge">${item.nama}</span></td>
                    <td>${item.tanggal}</td>
                    <td>${namaBulan[parseInt(item.bulan) - 1]}</td>
                    <td>${item.tahun}</td>
                    <td>${formatRupiah(item.jumlah)}</td>
                    <td>
                        <button class="btn-delete" onclick="hapusDataHandler(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    }
    
    // Update summary
    updateSummary(data);
}

// Update summary card
function updateSummary(data) {
    const stats = calculateStats(data);
    
    document.getElementById('summaryTotal').textContent = formatRupiah(stats.total);
    document.getElementById('summaryCount').textContent = stats.count;
    document.getElementById('summaryAverage').textContent = formatRupiah(stats.average);
    document.getElementById('summaryMax').textContent = formatRupiah(stats.max);
}

// Filter data
function filterData() {
    updateTabelRekap();
}

// Reset filter
function resetFilter() {
    document.getElementById('filterBulan').value = '';
    document.getElementById('filterTahun').value = '';
    updateTabelRekap();
}

// Handler hapus data
function hapusDataHandler(id) {
    confirmAction('Apakah Anda yakin ingin menghapus data ini?').then(confirmed => {
        if (confirmed) {
            hapusData(id);
            updateTabelRekap();
            showNotification('Data berhasil dihapus');
        }
    });
}

// Export functions untuk digunakan di HTML
window.filterData = filterData;
window.resetFilter = resetFilter;
window.hapusDataHandler = hapusDataHandler;
