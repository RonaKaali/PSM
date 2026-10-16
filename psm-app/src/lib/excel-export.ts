import * as XLSX from 'xlsx';
import { TripWithFinance } from '@/types';

export function exportTripsToExcel(
  trips: TripWithFinance[],
  periodLabel: string = 'Semua',
  userRole: 'super_admin' | 'admin' = 'super_admin'
) {
  const isSuperAdmin = userRole === 'super_admin';

  const worksheetData = trips.map((t, idx) => {
    const baseRow: Record<string, any> = {
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
      'Transportir': t.delivery_by || 'PT. PUTRA SAIJAAN MANDIRI',
    };

    if (isSuperAdmin && t.finance) {
      baseRow['Tipe Pendapatan'] = t.finance.revenue_type === 'per_unit' ? `Tarif Satuan (@Rp ${t.finance.unit_rate?.toLocaleString('id-ID')})` : 'Borongan/Flat';
      baseRow['Pendapatan Kotor (Rp)'] = t.finance.gross_revenue;
      baseRow['Uang Jalan Supir (Rp)'] = t.finance.driver_allowance;
      baseRow['Biaya Lain-lain (Rp)'] = t.finance.other_costs;
      baseRow['Catatan Biaya Lain'] = t.finance.other_costs_notes || '-';
      baseRow['Total Biaya Operasional (Rp)'] = t.finance.total_operational_cost;
      baseRow['Laba Bersih / Net Margin (Rp)'] = t.finance.net_margin;
      baseRow['Margin Keuntungan (%)'] = `${t.finance.margin_percentage}%`;
    }

    return baseRow;
  });

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);

  // Set column widths for clean readability
  const colWidths = isSuperAdmin
    ? [
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
        { wch: 26 }, // Transportir
        { wch: 24 }, // Tipe Pendapatan
        { wch: 22 }, // Gross Rev
        { wch: 20 }, // Uang Jalan Supir
        { wch: 18 }, // Lain-lain
        { wch: 30 }, // Catatan
        { wch: 24 }, // Total Cost
        { wch: 24 }, // Net Margin
        { wch: 20 }, // Margin %
      ]
    : [
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
        { wch: 30 }, // Transportir
      ];

  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, `Rekap ${periodLabel}`);

  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const safePeriod = periodLabel.replace(/\s+/g, '_');
  const rolePrefix = isSuperAdmin ? 'Lengkap' : 'Operasional';
  const fullFileName = `Rekap_Surat_Jalan_PT_PSM_${rolePrefix}_${safePeriod}_${dateStr}.xlsx`;

  XLSX.writeFile(workbook, fullFileName);
}
