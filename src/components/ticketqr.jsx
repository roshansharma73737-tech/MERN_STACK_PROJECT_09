import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

function Ticket_QR_function({ ticket }) {
  const qrRef = useRef(null);

  if (!ticket?.ticketId) {
    return null;
  }

  const qrData = new URL(
    `/ticket/${encodeURIComponent(ticket.ticketId)}`,
    window.location.origin
  ).toString();

  return (
    <div className="ticket-qr">
      <h3>Scan Ticket QR</h3>

      <div className="qr-box">
        <QRCodeCanvas
          ref={qrRef}
          value={qrData}
          size={220}
          bgColor="#ffffff"
          fgColor="#000000"
          level="H"
        />
      </div>

      <p className="qr-ticket-id">Ticket ID: {ticket.ticketId}</p>
      <button
        className="button"
        type="button"
        onClick={() => {
          const canvas = qrRef.current;
          if (!canvas) return;

          const downloadLink = document.createElement("a");
          downloadLink.href = canvas.toDataURL("image/png");
          downloadLink.download = `ticket-${ticket.ticketId}-qr.png`;
          downloadLink.click();
        }}
      >
        Download QR code
      </button>
    </div>
  );
}

export default Ticket_QR_function;