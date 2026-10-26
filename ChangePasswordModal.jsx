import { useState } from "react";
import { supabase } from "./supabaseClient";

// Eingeloggte Nutzer ändern hier ihr eigenes Passwort, z. B. nachdem ein
// Admin ein vorläufiges Passwort für sie gesetzt hat.
export default function ChangePasswordModal({ onClose }) {
  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError("Das Passwort muss mindestens 6 Zeichen haben.");
      return;
    }
    if (password !== repeat) {
      setError("Die beiden Eingaben stimmen nicht überein.");
      return;
    }
    setBusy(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (err) {
      const code = err.code || "";
      if (code === "same_password") {
        setError("Das neue Passwort muss sich vom bisherigen unterscheiden.");
      } else if (code === "weak_password") {
        setError("Das Passwort ist zu schwach. Bitte ein längeres wählen.");
      } else if (code === "reauthentication_needed" || code === "session_not_found") {
        setError("Bitte einmal ab- und wieder anmelden und es dann erneut versuchen.");
      } else {
        setError(`Passwort konnte nicht geändert werden: ${err.message}`);
      }
      return;
    }
    setDone(true);
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label="Passwort ändern"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-title">Passwort ändern</div>
        {done ? (
          <p className="modal-info">Dein Passwort wurde geändert.</p>
        ) : (
          <form className="name-gate-form" onSubmit={submit} style={{ marginTop: 12 }}>
            {error && <div className="modal-error">{error}</div>}
            <label>
              Neues Passwort
              <input
                type="password"
                autoComplete="new-password"
                minLength={6}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <label>
              Neues Passwort wiederholen
              <input
                type="password"
                autoComplete="new-password"
                minLength={6}
                required
                value={repeat}
                onChange={(e) => setRepeat(e.target.value)}
              />
            </label>
            <button type="submit" className="btn-primary" disabled={busy}>
              {busy ? "Einen Moment…" : "Passwort speichern"}
            </button>
          </form>
        )}
        <button className="btn-close" onClick={onClose}>
          {done ? "Schließen" : "Abbrechen"}
        </button>
      </div>
    </div>
  );
}
