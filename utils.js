// Utility Functions

// Format angka ke Rupiah
function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(angka);
}

// Nama bulan dalam bahasa Indonesia
const namaBulan = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

// Nama bulan singkat
const namaBulanSingkat = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
];

// Format tanggal
function formatTanggal(tanggal, bulan, tahun) {
    return `${tanggal} ${namaBulan[parseInt(bulan) - 1]} ${tahun}`;
}

// Get current date
function getCurrentDate() {
    const now = new Date();
    return {
        tanggal: now.getDate(),
        bulan: (now.getMonth() + 1).toString(),
        tahun: now.getFullYear().toString()
    };
}

// Show notification
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Confirmation dialog
function confirmAction(message) {
    return new Promise((resolve) => {
        if (confirm(message)) {
            resolve(true);
        } else {
            resolve(false);
        }
    });
}

// Format angka dengan pemisah ribuan
function formatAngka(angka) {
    return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Parse angka dari format Rupiah
function parseRupiah(rupiah) {
    return parseInt(rupiah.replace(/[^0-9]/g, '')) || 0;
}

// Group by function
function groupBy(array, key) {
    return array.reduce((result, currentValue) => {
        (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
        return result;
    }, {});
}

// Sort by date
function sortByDate(data, ascending = false) {
    return data.sort((a, b) => {
        const dateA = new Date(a.tahun, a.bulan - 1, a.tanggal);
        const dateB = new Date(b.tahun, b.bulan - 1, b.tanggal);
        
        if (ascending) {
            return dateA - dateB;
        } else {
            return dateB - dateA;
        }
    });
}

// Filter by month and year
function filterByMonthYear(data, bulan, tahun) {
    return data.filter(item => {
        if (bulan && tahun) {
            return item.bulan === bulan && item.tahun === tahun;
        } else if (bulan) {
            return item.bulan === bulan;
        } else if (tahun) {
            return item.tahun === tahun;
        } else {
            return true;
        }
    });
}

// Calculate statistics
function calculateStats(data) {
    const total = data.reduce((sum, item) => sum + item.jumlah, 0);
    const count = data.length;
    const average = count > 0 ? total / count : 0;
    const max = data.length > 0 ? Math.max(...data.map(item => item.jumlah)) : 0;
    const min = data.length > 0 ? Math.min(...data.map(item => item.jumlah)) : 0;
    
    return { total, count, average, max, min };
}

// Download data as JSON
function downloadJSON(data, filename = 'tabungan.json') {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    
    URL.revokeObjectURL(url);
}
