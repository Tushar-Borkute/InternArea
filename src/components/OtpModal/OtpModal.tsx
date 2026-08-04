import { useState, useRef, useEffect, useCallback } from "react";
import { ShieldCheck, X, RefreshCw, Mail, Lock } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import "./OtpModal.css";

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

interface OtpModalProps {
  onClose: () => void;
}

const OtpModal = ({ onClose }: OtpModalProps) => {
  const { t, confirmFrench, cancelFrench } = useLanguage();
  const { currentUser } = useAuth();

  const [otp, setOtp] = useState(generateOtp);
  const [inputs, setInputs] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [copied, setCopied] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const userEmail =
    currentUser?.email || "your email";

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleInput = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newInputs = [...inputs];
    newInputs[index] = value.slice(-1);
    setInputs(newInputs);
    setError(false);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !inputs[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setInputs(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = useCallback(async () => {
    const entered = inputs.join("");
    if (entered.length < 6) return;
    setVerifying(true);
    await new Promise((r) => setTimeout(r, 800));
    if (entered === otp) {
      confirmFrench();
      onClose();
    } else {
      setError(true);
      setShake(true);
      setInputs(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      setTimeout(() => setShake(false), 600);
    }
    setVerifying(false);
  }, [inputs, otp, confirmFrench, onClose]);

  const handleResend = () => {
    setOtp(generateOtp());
    setInputs(["", "", "", "", "", ""]);
    setError(false);
    setCopied(false);
    inputRefs.current[0]?.focus();
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(otp).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleCancel = () => {
    cancelFrench();
    onClose();
  };

  return (
    <div className="otp-overlay" onClick={(e) => e.target === e.currentTarget && handleCancel()}>
      <div className={`otp-modal ${shake ? "otp-shake" : ""}`}>
        {/* Header */}
        <div className="otp-header">
          <div className="otp-icon-wrap">
            <ShieldCheck size={28} className="otp-shield-icon" />
          </div>
          <button className="otp-close-btn" onClick={handleCancel} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Title */}
        <div className="otp-body">
          <h2 className="otp-title">{t("otp.title")}</h2>
          <p className="otp-subtitle">{t("otp.subtitle")}</p>

          {/* Email display */}
          <div className="otp-email-row">
            <Mail size={15} />
            <span>{t("otp.sentTo")}</span>
            <strong>{userEmail}</strong>
          </div>

          {/* Simulated OTP display */}
          <div className="otp-sim-box">
            <Lock size={14} className="otp-sim-icon" />
            <div>
              <span className="otp-sim-label">{t("otp.simulatedNote")}</span>
              <div className="otp-code-row">
                <span className="otp-code-display">{otp}</span>
                <button
                  className={`otp-copy-btn ${copied ? "copied" : ""}`}
                  onClick={handleCopyCode}
                >
                  {copied ? "✓ Copied" : "Copy"}
                </button>
              </div>
            </div>
          </div>

          {/* OTP input boxes */}
          <div className="otp-label">{t("otp.enterCode")}</div>
          <div
            className={`otp-inputs-row ${error ? "otp-inputs-error" : ""}`}
            onPaste={handlePaste}
          >
            {inputs.map((val, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                className="otp-digit-input"
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={val}
                onChange={(e) => handleInput(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
              />
            ))}
          </div>

          {error && (
            <p className="otp-error-msg">{t("otp.wrongCode")}</p>
          )}

          {/* Actions */}
          <button
            className="otp-verify-btn"
            onClick={handleVerify}
            disabled={verifying || inputs.join("").length < 6}
          >
            {verifying ? (
              <>
                <span className="otp-spinner" />
                {t("otp.verifying")}
              </>
            ) : (
              <>
                <ShieldCheck size={16} />
                {t("otp.verify")}
              </>
            )}
          </button>

          <div className="otp-secondary-actions">
            <button className="otp-resend-btn" onClick={handleResend}>
              <RefreshCw size={13} />
              {t("otp.resend")}
            </button>
            <button className="otp-cancel-btn" onClick={handleCancel}>
              {t("otp.cancel")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpModal;
