import { useRef } from 'react';
import { XMarkIcon, PrinterIcon } from '@heroicons/react/24/outline';

export default function InvoiceView({ bill, onClose }) {
    const printRef = useRef();

    const handlePrint = () => {
        const content = printRef.current;
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
            <head>
                <title>Invoice ${bill.billNumber}</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: 'Segoe UI', Arial, sans-serif; color: #1f2937; padding: 20px; }
                    .invoice { max-width: 380px; margin: 0 auto; }
                    .header { text-align: center; padding-bottom: 16px; border-bottom: 2px dashed #d1d5db; margin-bottom: 16px; }
                    .store-name { font-size: 22px; font-weight: 700; color: #4f46e5; }
                    .store-detail { font-size: 11px; color: #6b7280; margin-top: 2px; }
                    .invoice-meta { display: flex; justify-content: space-between; font-size: 12px; color: #6b7280; margin-bottom: 12px; }
                    .customer-box { background: #f9fafb; padding: 10px; border-radius: 6px; font-size: 12px; margin-bottom: 14px; }
                    .customer-box strong { color: #111827; }
                    table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 14px; }
                    th { text-align: left; padding: 6px 4px; border-bottom: 2px solid #e5e7eb; color: #6b7280; font-size: 11px; text-transform: uppercase; }
                    th:last-child, td:last-child { text-align: right; }
                    th:nth-child(2), td:nth-child(2) { text-align: center; }
                    th:nth-child(3), td:nth-child(3) { text-align: right; }
                    td { padding: 5px 4px; border-bottom: 1px solid #f3f4f6; }
                    .totals { border-top: 2px dashed #d1d5db; padding-top: 10px; }
                    .total-row { display: flex; justify-content: space-between; font-size: 12px; padding: 3px 0; color: #6b7280; }
                    .total-row.grand { font-size: 16px; font-weight: 700; color: #111827; padding-top: 8px; border-top: 2px solid #e5e7eb; margin-top: 6px; }
                    .total-row.discount { color: #059669; }
                    .qr-section { text-align: center; margin-top: 16px; padding-top: 14px; border-top: 2px dashed #d1d5db; }
                    .qr-section img { width: 120px; height: 120px; }
                    .qr-label { font-size: 10px; color: #9ca3af; margin-top: 4px; }
                    .footer { text-align: center; margin-top: 16px; padding-top: 12px; border-top: 2px dashed #d1d5db; font-size: 11px; color: #9ca3af; }
                    @media print { body { padding: 0; } }
                </style>
            </head>
            <body>${content.innerHTML}</body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => { printWindow.print(); printWindow.close(); }, 300);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: true
        });
    };

    const totalDiscounts = (parseFloat(bill.itemDiscount) || 0) + (parseFloat(bill.billDiscount) || 0);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                {/* Action Bar */}
                <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-3 flex items-center justify-between rounded-t-2xl z-10">
                    <h2 className="font-semibold text-gray-900 text-lg">Invoice</h2>
                    <div className="flex items-center gap-2">
                        <button onClick={handlePrint}
                            className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm font-medium">
                            <PrinterIcon className="w-4 h-4" /> Print
                        </button>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
                            <XMarkIcon className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>
                </div>

                {/* Printable Invoice Content */}
                <div ref={printRef} className="p-6">
                    <div className="invoice">
                        {/* Header */}
                        <div className="header" style={{ textAlign: 'center', paddingBottom: 16, borderBottom: '2px dashed #d1d5db', marginBottom: 16 }}>
                            <div className="store-name" style={{ fontSize: 22, fontWeight: 700, color: '#4f46e5' }}>
                                {bill.storeName || 'SmartRetail'}
                            </div>
                            {bill.storeAddress && <div className="store-detail" style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{bill.storeAddress}</div>}
                            {bill.storePhone && <div className="store-detail" style={{ fontSize: 11, color: '#6b7280' }}>Tel: {bill.storePhone}</div>}
                            {bill.storeGstNumber && <div className="store-detail" style={{ fontSize: 11, color: '#6b7280' }}>GSTIN: {bill.storeGstNumber}</div>}
                        </div>

                        {/* Invoice Meta */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6b7280', marginBottom: 12 }}>
                            <span><strong style={{ color: '#111827' }}>{bill.billNumber}</strong></span>
                            <span>{formatDate(bill.createdAt)}</span>
                        </div>

                        {/* Customer */}
                        {bill.customerName && (
                            <div style={{ background: '#f9fafb', padding: 10, borderRadius: 6, fontSize: 12, marginBottom: 14 }}>
                                <strong style={{ color: '#111827' }}>{bill.customerName}</strong>
                                {bill.customerEmail && <div style={{ color: '#6b7280' }}>{bill.customerEmail}</div>}
                                {bill.customerPhone && <div style={{ color: '#6b7280' }}>{bill.customerPhone}</div>}
                            </div>
                        )}

                        {/* Items Table */}
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, marginBottom: 14 }}>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'left', padding: '6px 4px', borderBottom: '2px solid #e5e7eb', color: '#6b7280', fontSize: 11, textTransform: 'uppercase' }}>Item</th>
                                    <th style={{ textAlign: 'center', padding: '6px 4px', borderBottom: '2px solid #e5e7eb', color: '#6b7280', fontSize: 11, textTransform: 'uppercase' }}>Qty</th>
                                    <th style={{ textAlign: 'right', padding: '6px 4px', borderBottom: '2px solid #e5e7eb', color: '#6b7280', fontSize: 11, textTransform: 'uppercase' }}>Rate</th>
                                    <th style={{ textAlign: 'right', padding: '6px 4px', borderBottom: '2px solid #e5e7eb', color: '#6b7280', fontSize: 11, textTransform: 'uppercase' }}>Amt</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bill.items?.map((item, idx) => (
                                    <tr key={idx}>
                                        <td style={{ padding: '5px 4px', borderBottom: '1px solid #f3f4f6' }}>{item.productName}</td>
                                        <td style={{ padding: '5px 4px', borderBottom: '1px solid #f3f4f6', textAlign: 'center' }}>{item.quantity}</td>
                                        <td style={{ padding: '5px 4px', borderBottom: '1px solid #f3f4f6', textAlign: 'right' }}>₹{parseFloat(item.unitPrice).toFixed(2)}</td>
                                        <td style={{ padding: '5px 4px', borderBottom: '1px solid #f3f4f6', textAlign: 'right' }}>₹{parseFloat(item.lineTotal).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Totals */}
                        <div style={{ borderTop: '2px dashed #d1d5db', paddingTop: 10 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '3px 0', color: '#6b7280' }}>
                                <span>Subtotal</span>
                                <span>₹{parseFloat(bill.subtotal).toFixed(2)}</span>
                            </div>
                            {totalDiscounts > 0 && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '3px 0', color: '#059669' }}>
                                    <span>Discounts</span>
                                    <span>-₹{totalDiscounts.toFixed(2)}</span>
                                </div>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '3px 0', color: '#6b7280' }}>
                                <span>GST ({bill.taxRate}%)</span>
                                <span>₹{parseFloat(bill.taxAmount).toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700, color: '#111827', paddingTop: 8, borderTop: '2px solid #e5e7eb', marginTop: 6 }}>
                                <span>Total</span>
                                <span>₹{parseFloat(bill.totalAmount).toFixed(2)}</span>
                            </div>
                        </div>

                        {/* QR Code */}
                        {bill.qrCodeBase64 && (
                            <div style={{ textAlign: 'center', marginTop: 16, paddingTop: 14, borderTop: '2px dashed #d1d5db' }}>
                                <img src={bill.qrCodeBase64} alt="Invoice QR" style={{ width: 120, height: 120 }} />
                                <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 4 }}>Scan for verification</div>
                            </div>
                        )}

                        {/* Footer */}
                        <div style={{ textAlign: 'center', marginTop: 16, paddingTop: 12, borderTop: '2px dashed #d1d5db', fontSize: 11, color: '#9ca3af' }}>
                            <p>Thank you for shopping with us!</p>
                            <p style={{ marginTop: 2 }}>Powered by SmartRetail</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
