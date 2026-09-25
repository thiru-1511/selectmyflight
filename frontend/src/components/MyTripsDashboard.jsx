import React, { useState } from 'react';
import { Plane, Luggage, AlertTriangle, FileText, Ban, RefreshCw, Receipt, Building2, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export default function MyTripsDashboard({ bookings, currency, onRefreshBookings, onViewETicket, onBookFlight, onTrackRefund }) {
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming', 'past'
  const [cancelModalData, setCancelModalData] = useState(null);

  const convertPrice = (inrPrice) => {
    return currency === 'USD' ? Math.round(inrPrice / 85) : inrPrice;
  };
  const currencySymbol = currency === 'USD' ? '$' : '₹';

  const upcomingTrips = bookings.filter(b => b.status !== 'CANCELLED');
  const pastTrips = bookings.filter(b => b.status === 'CANCELLED');

  const displayedTrips = activeTab === 'upcoming' ? upcomingTrips : pastTrips;

  const handleCancelClick = (booking) => {
    const fee = 1500;
    const total = booking.totalAmount || booking.totalPrice || 0;
    const refund = Math.max(0, total - fee);
    setCancelModalData({
      pnr: booking.pnr || booking.voucherCode || booking.id,
      totalAmount: total,
      cancellationFee: fee,
      refundAmount: refund
    });
  };

  const handleConfirmCancel = async () => {
    if (!cancelModalData) return;
    if (cancelModalData.pnr.startsWith('SMF-') || cancelModalData.pnr.startsWith('PNR-')) {
      await api.cancelBooking(cancelModalData.pnr);
    }
    setCancelModalData(null);
    onRefreshBookings();
  };

  return (
    <div style={{
      maxWidth: 1240,
      margin: '24px auto 80px auto',
      padding: '36px 32px 60px 32px',
      borderRadius: 24,
      background: "linear-gradient(135deg, rgba(9, 15, 29, 0.90), rgba(15, 23, 42, 0.95)), url('/assets/images/cabin_luxury_suite.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
      border: '1px solid rgba(0, 210, 255, 0.25)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Luggage size={28} color="#00d2ff" />
            My Trips & Multi-Modal Travel Dashboard
          </h2>
          <p style={{ fontSize: 14, color: '#94a3b8', marginTop: 4 }}>
            Manage your flights, hotel vouchers, train/bus transit tickets, and AI trip packages in one place.
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.05)', padding: 4, borderRadius: 10 }}>
          <button
            onClick={() => setActiveTab('upcoming')}
            style={{
              background: activeTab === 'upcoming' ? 'linear-gradient(135deg, #00d2ff, #3a7bd5)' : 'transparent',
              color: activeTab === 'upcoming' ? '#fff' : '#94a3b8',
              border: 'none',
              padding: '8px 20px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Active Bookings ({upcomingTrips.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            style={{
              background: activeTab === 'past' ? 'linear-gradient(135deg, #00d2ff, #3a7bd5)' : 'transparent',
              color: activeTab === 'past' ? '#fff' : '#94a3b8',
              border: 'none',
              padding: '8px 20px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Past / Cancelled ({pastTrips.length})
          </button>
        </div>
      </div>

      {/* Trips Grid */}
      {displayedTrips.length === 0 ? (
        <div className="glass-card" style={{ padding: '60px 24px', textAlign: 'center' }}>
          <Luggage size={54} color="#64748b" style={{ margin: '0 auto 16px auto' }} />
          <h3 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 8 }}>
            No {activeTab} travel bookings found
          </h3>
          <p style={{ fontSize: 14, color: '#94a3b8', maxWidth: 400, margin: '0 auto 24px auto' }}>
            {activeTab === 'upcoming' 
              ? "You don't have any active flights, hotel stays, or transit passes booked right now." 
              : "No past or cancelled travel records."}
          </p>
          <button
            onClick={onBookFlight}
            className="btn-primary"
            style={{ padding: '12px 28px' }}
          >
            <Plane size={16} /> Search & Book Travel
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {displayedTrips.map(trip => {
            const isHotel = trip.bookingType === 'HOTEL';
            const isTransit = trip.bookingType === 'TRANSIT';
            const isBundle = trip.bookingType === 'BUNDLE';

            const flight = trip.flight || {};
            const passenger = (trip.passengers && trip.passengers[0]) ? trip.passengers[0] : {};
            const totalCost = trip.totalAmount || trip.totalPrice || 0;

            return (
              <div key={trip.pnr || trip.id || Math.random()} className="glass-card" style={{ padding: '24px', position: 'relative' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 16,
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  paddingBottom: 16,
                  marginBottom: 16
                }}>
                  {/* PNR & Title */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      background: isHotel ? 'rgba(245, 175, 25, 0.15)' : isTransit ? 'rgba(0, 230, 118, 0.15)' : isBundle ? 'rgba(192, 132, 252, 0.2)' : 'rgba(0, 210, 255, 0.15)',
                      color: isHotel ? '#f5af19' : isTransit ? '#00e676' : isBundle ? '#c084fc' : '#00d2ff',
                      fontWeight: 800,
                      padding: '6px 12px',
                      borderRadius: 6,
                      fontSize: 14,
                      letterSpacing: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}>
                      {isHotel && <Building2 size={16} />}
                      {isTransit && <Train size={16} />}
                      {isBundle && <Sparkles size={16} />}
                      {!isHotel && !isTransit && !isBundle && <Plane size={16} />}
                      <span>{isHotel ? `VOUCHER: ${trip.voucherCode || trip.id}` : `PNR: ${trip.pnr || trip.id}`}</span>
                    </div>

                    <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>
                      {isHotel && `${trip.hotelName} (${trip.destinationCity})`}
                      {isTransit && `${trip.serviceName} (#${trip.serviceNumber})`}
                      {isBundle && `${trip.title}`}
                      {!isHotel && !isTransit && !isBundle && `${flight.airlineName || 'SelectMyFlight Express'} (${flight.flightNumber || 'FL-2026'})`}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {trip.status === 'CANCELLED' ? (
                      <span style={{
                        background: 'rgba(255, 82, 82, 0.15)',
                        color: '#ff5252',
                        border: '1px solid rgba(255, 82, 82, 0.4)',
                        padding: '4px 12px',
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 700
                      }}>
                        🔴 CANCELLED
                      </span>
                    ) : (
                      <span style={{
                        background: 'rgba(0, 230, 118, 0.15)',
                        color: '#00e676',
                        border: '1px solid rgba(0, 230, 118, 0.4)',
                        padding: '4px 12px',
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}>
                        <span className="live-dot" /> 🟢 CONFIRMED
                      </span>
                    )}
                  </div>
                </div>

                {/* Details Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: 16,
                  alignItems: 'center'
                }}>
                  {/* Route / Location */}
                  <div>
                    <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase' }}>
                      {isHotel ? 'Property Location' : isBundle ? 'Trip Destination' : 'Route'}
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginTop: 2 }}>
                      {isHotel && `${trip.destinationCity}`}
                      {isTransit && `${trip.originCity} ➔ ${trip.destinationCity}`}
                      {isBundle && `${trip.destination}`}
                      {!isHotel && !isTransit && !isBundle && `${flight.originCode || 'DEL'} ➔ ${flight.destinationCode || 'BOM'}`}
                    </div>
                    <div style={{ fontSize: 12, color: '#00d2ff' }}>
                      {isHotel && `${trip.roomType?.name || 'Deluxe Suite'}`}
                      {isTransit && `Dep: ${trip.departureTime} • Arr: ${trip.arrivalTime}`}
                      {isBundle && `Includes Flight ${trip.flightNumber} + Stay`}
                      {!isHotel && !isTransit && !isBundle && `Dep: ${flight.departureTime || '08:00'} • Arr: ${flight.arrivalTime || '10:15'}`}
                    </div>
                  </div>

                  {/* Date & Room/Seat */}
                  <div>
                    <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase' }}>
                      {isHotel ? 'Check-In Date' : 'Travel Date'}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginTop: 2 }}>
                      {trip.travelDate || trip.checkInDate || 'Scheduled Today'}
                    </div>
                    <div style={{ fontSize: 12, color: '#94a3b8' }}>
                      {isHotel && `Nights: ${trip.nights || 1} • Guests: ${trip.guestCount || 2}`}
                      {isTransit && `Coach: ${trip.coachNumber || 'C1'}, ${trip.seatNumber || 'Seat 12'}`}
                      {isBundle && `Duration: ${trip.duration}`}
                      {!isHotel && !isTransit && !isBundle && `Gate: ${trip.gate || 'T3-B14'} (${trip.terminal || 'T3'})`}
                    </div>
                  </div>

                  {/* Guest / Passenger */}
                  <div>
                    <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase' }}>Primary Traveler</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginTop: 2 }}>
                      {trip.primaryGuestName || trip.passengerName || (passenger.firstName ? `${passenger.firstName} ${passenger.lastName}` : 'Rahul Sharma')}
                    </div>
                    <div style={{ fontSize: 12, color: '#f5af19', fontWeight: 600 }}>
                      {isHotel ? 'Instant Voucher Issued' : isTransit ? `Status: Confirmed` : isBundle ? 'Package Locked' : `Seat: ${passenger.seatNumber || '04A'}`}
                    </div>
                  </div>

                  {/* Amount & Actions */}
                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                    <div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>Total Paid</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>
                        {currencySymbol}{convertPrice(totalCost).toLocaleString()}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {!isHotel && !isTransit && !isBundle && (
                        <button
                          onClick={() => onViewETicket(trip)}
                          className="btn-primary"
                          style={{ padding: '8px 14px', fontSize: 12 }}
                        >
                          <FileText size={14} /> View E-Ticket
                        </button>
                      )}

                      <button
                        onClick={() => onViewETicket && onViewETicket({ ...trip, initialShowInvoice: true })}
                        style={{
                          background: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          color: '#cbd5e1',
                          padding: '8px 12px',
                          borderRadius: 8,
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6
                        }}
                      >
                        <Receipt size={14} color="#00d2ff" /> Tax Invoice
                      </button>

                      {trip.status !== 'CANCELLED' ? (
                        <button
                          onClick={() => handleCancelClick(trip)}
                          style={{
                            background: 'rgba(255, 82, 82, 0.15)',
                            color: '#ff5252',
                            border: '1px solid rgba(255, 82, 82, 0.3)',
                            padding: '8px 12px',
                            borderRadius: 8,
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6
                          }}
                        >
                          <Ban size={14} /> Cancel
                        </button>
                      ) : (
                        <button
                          onClick={() => onTrackRefund && onTrackRefund(trip.pnr || trip.id, Math.max(0, totalCost - 1500))}
                          style={{
                            background: 'rgba(0, 230, 118, 0.15)',
                            color: '#00e676',
                            border: '1px solid rgba(0, 230, 118, 0.3)',
                            padding: '8px 12px',
                            borderRadius: 8,
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6
                          }}
                        >
                          <RefreshCw size={14} /> Track Refund
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancellation Confirmation Modal */}
      {cancelModalData && (
        <div className="modal-overlay" onClick={() => setCancelModalData(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <div style={{ padding: '24px' }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'rgba(255, 82, 82, 0.2)',
                color: '#ff5252',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto'
              }}>
                <AlertTriangle size={24} />
              </div>

              <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff', textAlign: 'center', marginBottom: 8 }}>
                Cancel Booking ({cancelModalData.pnr})?
              </h3>
              <p style={{ fontSize: 13, color: '#94a3b8', textAlign: 'center', marginBottom: 20 }}>
                Are you sure you want to cancel this booking? Here is your instant refund breakdown:
              </p>

              <div style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 10,
                padding: '16px',
                marginBottom: 20,
                fontSize: 13,
                display: 'flex',
                flexDirection: 'column',
                gap: 8
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                  <span>Total Amount Paid:</span>
                  <span>{currencySymbol}{convertPrice(cancelModalData.totalAmount).toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ff5252' }}>
                  <span>Processing & Cancellation Fee:</span>
                  <span>-{currencySymbol}{convertPrice(cancelModalData.cancellationFee).toLocaleString()}</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: '#00e676',
                  fontWeight: 800,
                  fontSize: 15,
                  paddingTop: 8,
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <span>Refund Credited to You:</span>
                  <span>{currencySymbol}{convertPrice(cancelModalData.refundAmount).toLocaleString()}</span>
                </div>
              </div>

              <p style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', marginBottom: 20 }}>
                Refund will be credited back to your original payment method within 3-5 business days.
              </p>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setCancelModalData(null)}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '12px', justifyContent: 'center' }}
                >
                  Keep Booking
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCancel}
                  style={{
                    flex: 1,
                    background: '#ff5252',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    fontWeight: 700,
                    padding: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


