import * as XLSX from 'xlsx';
import { TripWithFinance } from '@/types';

export function exportTripsToExcel(trips: TripWithFinance[], fileNamePrefix: string = 'Rekap_Surat_Jalan_PT_PSM') {
  const worksheetData = trips.map((t, idx) => {
    return {
      'No.': idx + 1,
      'No. Surat Jalan': t.trip_number,
      'Tanggal': t.trip_date,
      'No. Polisi (Nopol)': t.plate_number,
      'Nama Supir': t.driver_name,
      'Ship To (Tujuan)': t.ship_to,
      'Port Point Area': t.port_point_area,
      'Nomor Segel': t.seal_number,
      'Lokasi Muat': t.loading_location,
      'Jumlah Muatan': t.quantity_display,
      'Jenis Muatan': t.goods_type,
      'Status': t.status.toUpperCase(),
      'Tipe Pendapatan': t.finance.revenue_type === 'per_unit' ? `Tarif Satuan (@Rp ${t.finance.unit_rate.toLocaleString('id-ID')})` : 'Borongan/Flat',
      'Pendapatan Kotor (Rp)': t.finance.gross_revenue,
      'Biaya Solar (Rp)': t.finance.fuel_cost,
      'Uang Jalan Supir (Rp)': t.finance.driver_allowance,
      'Ferry & Tol (Rp)': t.finance.ferry_toll_cost,
      'Segel & Retribusi (Rp)': t.finance.retribution_seal_cost,
      'Biaya Lain-lain (Rp)': t.finance.other_costs,
      'Catatan Biaya Lain': t.finance.other_costs_notes || '-',
      'Total Biaya Operasional (Rp)': t.finance.total_operational_cost,
      'Laba Bersih / Net Margin (Rp)': t.finance.net_margin,
      'Margin Keuntungan (%)': `${t.finance.margin_percentage}%`,
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);

  // Set column widths for clean readability
  const colWidths = [
    { wch: 6 },  // No.
    { wch: 24 }, // No. SJ
    { wch: 14 }, // Tanggal
    { wch: 16 }, // Nopol
    { wch: 16 }, // Supir
    { wch: 30 }, // Ship To
    { wch: 45 }, // Port Point Area
    { wch: 18 }, // Segel
    { wch: 22 }, // Lokasi Muat
    { wch: 15 }, // Qty
    { wch: 20 }, // Jenis Muatan
    { wch: 14 }, // Status
    { wch: 24 }, // Tipe Pendapatan
    { wch: 22 }, // Gross Rev
    { wch: 18 }, // Solar
    { wch: 20 }, // Supir
    { wch: 18 }, // Ferry & Tol
    { wch: 20 }, // Retribusi
    { wch: 18 }, // Lain-lain
    { wch: 30 }, // Catatan
    { wch: 24 }, // Total Cost
    { wch: 24 }, // Net Margin
    { wch: 20 }, // Margin %
  ];
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Rekap Operasional & Margin');

  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const fullFileName = `${fileNamePrefix}_${dateStr}.xlsx`;

  XLSX.writeFile(workbook, fullFileName);
}
