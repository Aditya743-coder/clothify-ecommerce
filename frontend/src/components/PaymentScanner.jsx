import React from 'react';
import { QrCode, ShieldCheck, CheckCircle2, ArrowLeft } from 'lucide-react';

const PaymentScanner = ({ amount, onConfirm, onBack }) => {
    const [txnId, setTxnId] = React.useState('');
    const upiId = "9155193740@ybl"; 
    const upiUrl = `upi://pay?pa=${upiId}&pn=Clothify&am=${amount}&cu=INR`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(upiUrl)}`;
    
    return (
        <div className="fade-in" style={{
            backgroundColor: '#fff',
            borderRadius: '24px',
            padding: '40px',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
            border: '1px solid #f0f0f0',
            maxWidth: '500px',
            margin: '0 auto'
        }}>
            <button 
                onClick={onBack}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'none',
                    border: 'none',
                    color: '#666',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '30px',
                    padding: '0'
                }}
            >
                <ArrowLeft size={18} /> BACK TO BAG
            </button>

            <div style={{ marginBottom: '30px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: '950', marginBottom: '10px' }}>SCAN TO PAY</h2>
                <p style={{ color: '#666', fontSize: '15px' }}>Scan the QR code below using any UPI app (GPay, PhonePe, Paytm) to complete your payment.</p>
            </div>

            <div style={{ 
                backgroundColor: '#f9f9f9',
                padding: '20px',
                borderRadius: '20px',
                display: 'inline-block',
                marginBottom: '30px',
                border: '2px solid #000'
            }}>
                <div style={{ 
                    width: '240px', 
                    height: '240px', 
                    backgroundColor: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '12px',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <img src={qrCodeUrl} alt="UPI QR Code" style={{ width: '100%', height: '100%' }} />
                </div>
                <div style={{ 
                    marginTop: '10px',
                    fontSize: '12px',
                    fontWeight: '900',
                    color: '#000',
                    letterSpacing: '1px'
                }}>CLOTHIFY SECURE</div>
            </div>

            <div style={{ 
                backgroundColor: '#f0fdf4', 
                padding: '15px', 
                borderRadius: '12px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '12px',
                marginBottom: '40px'
            }}>
                <span style={{ fontSize: '18px', fontWeight: '700', color: '#166534' }}>Amount to Pay:</span>
                <span style={{ fontSize: '24px', fontWeight: '950', color: '#166534' }}>₹{amount}</span>
            </div>

            <div style={{ marginBottom: '40px' }}>
                <label style={{ 
                    display: 'block', 
                    textAlign: 'left', 
                    fontSize: '14px', 
                    fontWeight: '700', 
                    marginBottom: '10px',
                    color: '#282c3f'
                }}>
                    ENTER TRANSACTION ID / REF NO. AFTER PAYMENT
                </label>
                <input 
                    type="text" 
                    placeholder="e.g. 123456789012"
                    value={txnId}
                    onChange={(e) => setTxnId(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                    maxLength={20}
                    style={{
                        width: '100%',
                        padding: '15px 20px',
                        borderRadius: '12px',
                        border: txnId.length > 0 && txnId.length < 10 ? '2px solid var(--accent)' : '2px solid #eee',
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'all 0.3s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#000'}
                    onBlur={(e) => e.target.style.borderColor = txnId.length > 0 && txnId.length < 10 ? 'var(--accent)' : '#eee'}
                />
                {txnId.length > 0 && txnId.length < 10 && (
                    <p style={{ color: 'var(--accent)', fontSize: '11px', textAlign: 'left', marginTop: '5px', fontWeight: '700' }}>
                        * Transaction ID must be at least 10 characters.
                    </p>
                )}
                <p style={{ fontSize: '12px', color: '#888', marginTop: '8px', textAlign: 'left' }}>
                    * This helps us verify your payment faster.
                </p>
            </div>

            <div style={{ display: 'grid', gap: '15px' }}>
                <button 
                    onClick={() => onConfirm(txnId)}
                    className="btn btn-primary"
                    disabled={txnId.length < 10}
                    style={{ 
                        width: '100%', 
                        padding: '20px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        gap: '10px',
                        fontSize: '16px',
                        opacity: txnId.length >= 10 ? 1 : 0.5,
                        cursor: txnId.length >= 10 ? 'pointer' : 'not-allowed'
                    }}
                >
                    <CheckCircle2 size={22} /> CONFIRM & PLACE ORDER
                </button>
                <p style={{ fontSize: '12px', color: '#888', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <ShieldCheck size={14} /> Your transaction is secured and encrypted.
                </p>
            </div>
        </div>
    );
};

export default PaymentScanner;
