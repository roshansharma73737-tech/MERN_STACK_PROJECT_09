import { QRCodeCanvas } from "qrcode.react";

function Ticket_QR_function({ ticket }) {
  if (!ticket) {
    return null;
  }

  const qrData = JSON.stringify({
    ticketId: ticket.ticketId ?? ticket.ticket_id,
    paymentId: ticket.paymentId ?? ticket.payment_id,
    type: ticket.type,
    date: ticket.date,
    time: ticket.time,
    seats: ticket.seats ?? [],
  });

  return (
    <div className="ticket-qr">
      <h3>Scan Ticket QR</h3>

      <div className="qr-box">
        <QRCodeCanvas
          value={qrData}
          size={220}
          bgColor="#ffffff"
          fgColor="#000000"
          level="H"
        />
      </div>

      <p className="qr-ticket-id">
        Ticket ID: {ticket.ticketId ?? ticket.ticket_id}
      </p>
    </div>
  );
}

export default Ticket_QR_function;