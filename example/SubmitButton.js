import React from "react";

export default function SubmitButton({ shouldDisable, onClick }) {
  return (
    <button type="submit" disabled={shouldDisable} onClick={onClick}>
      Submit {shouldDisable ? 'Disabled' : 'Enabled'}
    </button>
  );
}
