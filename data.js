// Data Management

// Key untuk localStorage
const STORAGE_KEY = 'tabunganKu';

// Data tabungan
let dataTabungan = [];

// Load data dari localStorage
function loadData() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            dataTabungan = JSON.parse(stored);
        } catch (e) {
            console.error('Gagal memuat data:', e);
            dataTabungan = [];
        }
    } else {
        // Data dummy untuk contoh
        dataTabungan = generateDummyData();
        saveData();
    }
    
    return dataTabungan;
}

// Generate data dummy
function generateDummyData() {
    const dummyData = [];
    const now = new Date();
    
    for (let i = 1; i <= 10; i++) {
        const tanggal = Math.floor(Math.random() * 28) + 1;
        const bulan = Math.floor(Math.random() * 12) + 1;
        const tahun = now.getFullYear() - Math.floor(Math.random() * 2);
        const jumlah = Math.floor(Math.random() * 1000000) + 100000;
        
        dummyData.push({
            id: Date.now() - i * 1000000,
            nama: `Tabungan ${i}`,
            tanggal: tanggal.toString(),
            bulan: bulan.toString(),
            tahun: tahun.toString(),
            jumlah: jumlah
        });
    }
    
    return dummyData;
}

// Simpan data ke localStorage
function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataTabungan));
}

// Tambah data baru
function tambahData(data) {
    const newData = {
        id: Date.now(),
        ...data
    };
    
    dataTabungan.push(newData);
    saveData();
    return newData;
}

// Hapus data
function hapusData(id) {
    dataTabungan = dataTabungan.filter(item => item.id !== id);
    saveData();
}

// Update data
function updateData(id, newData) {
    const index = dataTabungan.findIndex(item => item.id === id);
    if (index !== -1) {
        dataTabungan[index] = { ...dataTabungan[index], ...newData };
        saveData();
        return true;
    }
    return false;
}

// Get all data
function getAllData() {
    return [...dataTabungan];
}

// Get data by ID
function getDataById(id) {
    return dataTabungan.find(item => item.id === id);
}

// Get data with filter
function getDataFiltered(bulan = '', tahun = '') {
    return filterByMonthYear(dataTabungan, bulan, tahun);
}

// Get recent transactions
function getRecentTransactions(limit = 5) {
    return sortByDate([...dataTabungan]).slice(0, limit);
}

// Get statistics
function getStatistics(bulan = '', tahun = '') {
    const filtered = getDataFiltered(bulan, tahun);
    return calculateStats(filtered);
}

// Get data for chart 7 hari
function getLast7DaysData() {
    const today = new Date();
    const last7Days = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        const dayData = dataTabungan.filter(item => {
            return parseInt(item.tanggal) === date.getDate() &&
                   parseInt(item.bulan) === date.getMonth() + 1 &&
                   parseInt(item.tahun) === date.getFullYear();
        });
        
        const total = dayData.reduce((sum, item) => sum + item.jumlah, 0);
        
        last7Days.push({
            date: `${date.getDate()} ${namaBulanSingkat[date.getMonth()]}`,
            total: total
        });
    }
    
    return last7Days;
}

// Get data per bulan dalam setahun
function getMonthlyData(tahun = new Date().getFullYear().toString()) {
    const monthlyData = [];
    
    for (let i = 1; i <= 12; i++) {
        const monthData = dataTabungan.filter(item => {
            return parseInt(item.bulan) === i && item.tahun === tahun;
        });
        
        const total = monthData.reduce((sum, item) => sum + item.jumlah, 0);
        
        monthlyData.push({
            bulan: namaBulanSingkat[i - 1],
            total: total
        });
    }
    
    return monthlyData;
}
