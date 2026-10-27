function Seat({ seatId, number, occupied, selected, onClick }) {
    return (
        <button
            type="button"
            disabled={occupied}
            aria-label={`Seat ${seatId}${
                occupied
                    ? ", unavailable"
                    : selected
                        ? ", selected"
                        : ", available"
            }`}
            aria-pressed={selected}
            className={[
                "seat",
                occupied ? "seat-occupied" : "",
                selected ? "seat-selected" : ""
            ].filter(Boolean).join(" ")}
            onClick={() => onClick(seatId)}
        >
            {number}
        </button>
    );
}

export default Seat;