import { useEffect, useState } from "react";
import { X, Check, ShieldCheck, Clock, Sparkles, Award, Zap, AlertTriangle } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../api/config";
import { useAuth } from "../../context/AuthContext";
import "./SubscriptionModal.css";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubscriptionUpdated?: () => void;
}

export const SubscriptionModal = ({ isOpen, onClose, onSubscriptionUpdated }: Props) => {
  const { currentUser } = useAuth();
  const userEmail = currentUser?.email || "";

  const [activeSub, setActiveSub] = useState<any>(null);
  const [isWindowOpen, setIsWindowOpen] = useState(false);

  const [processingPlan, setProcessingPlan] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !userEmail) return;

    const fetchSub = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/api/subscription/${userEmail}`);
        if (res.data?.success) {
          setActiveSub(res.data.subscription);
          setIsWindowOpen(res.data.isPaymentWindowOpen);
        }
      } catch (err) {
        console.error("Failed to fetch subscription:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSub();
  }, [isOpen, userEmail]);

  if (!isOpen) return null;

  const handleSubscribe = async (planName: string, _price: number) => {
    if (!userEmail) {
      toast.error("Please login to subscribe to a plan.");
      return;
    }

    try {
      setProcessingPlan(planName);

      // Step 1: Create payment order & check 10-11 AM IST window rule
      const orderRes = await axios.post(`${API_BASE_URL}/api/subscription/create-order`, {
        email: userEmail,
        plan: planName,
      });

      if (!orderRes.data.success) {
        toast.error(orderRes.data.message || "Failed to initialize payment.");
        return;
      }

      const { orderId } = orderRes.data;

      // Step 2: Process transaction & issue email invoice
      const payRes = await axios.post(`${API_BASE_URL}/api/subscription/process-payment`, {
        email: userEmail,
        plan: planName,
        orderId,
        paymentId: `pay_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      });

      if (payRes.data.success) {
        toast.success(`🎉 Subscribed to ${planName} Plan! Payment invoice sent to ${userEmail}.`);
        setActiveSub(payRes.data.subscription);
        if (onSubscriptionUpdated) onSubscriptionUpdated();
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      if (err.response?.data?.blocked) {
        toast.error(err.response.data.message || "Payment blocked: Payments are strictly allowed between 10:00 AM and 11:00 AM IST.");
      } else {
        toast.error(err.response?.data?.message || "Payment failed. Please try again.");
      }
    } finally {
      setProcessingPlan(null);
    }
  };

  const currentPlan = activeSub?.plan || "Free";

  return (
    <div className="sub-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sub-modal-card">
        <button className="sub-modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Header */}
        <div className="sub-modal-header">
          <div className="sub-modal-icon">
            <Sparkles size={28} color="#0ea5e9" />
          </div>
          <h2>Internship Application Plans</h2>
          <p>Select a plan to manage and scale your monthly internship applications.</p>
        </div>

        {/* Payment Time Window Status Banner */}
        <div className={`sub-window-banner ${isWindowOpen ? "banner-open" : "banner-closed"}`}>
          {isWindowOpen ? (
            <>
              <Clock size={18} color="#15803d" />
              <div>
                <strong>Payment Window Active (10:00 AM – 11:00 AM IST)</strong>
                <p>Transactions are currently allowed. You may proceed with plan upgrades.</p>
              </div>
            </>
          ) : (
            <>
              <AlertTriangle size={18} color="#dc2626" />
              <div>
                <strong>Payment Access Restricted (Outside 10:00 AM – 11:00 AM IST)</strong>
                <p>Subscription payments are permitted daily strictly between 10:00 AM and 11:00 AM IST.</p>
              </div>
            </>
          )}
        </div>

        {/* Pricing Cards Grid */}
        <div className="sub-plans-grid">
          {/* Free Plan */}
          <div className={`plan-card ${currentPlan === "Free" ? "active-plan" : ""}`}>
            {currentPlan === "Free" && <span className="active-badge">Active Plan</span>}
            <div className="plan-header">
              <ShieldCheck size={24} color="#64748b" />
              <h3>Free Plan</h3>
            </div>
            <div className="plan-price">
              <span className="amount">₹0</span>
              <span className="period">/month</span>
            </div>
            <ul className="plan-features">
              <li><Check size={16} color="#10b981" /> <strong>1</strong> Application / month</li>
              <li><Check size={16} color="#10b981" /> Standard application tracking</li>
              <li><Check size={16} color="#10b981" /> Basic candidate profile</li>
            </ul>
            <button className="plan-btn disabled" disabled>
              {currentPlan === "Free" ? "Current Plan" : "Included"}
            </button>
          </div>

          {/* Bronze Plan */}
          <div className={`plan-card ${currentPlan === "Bronze" ? "active-plan" : ""}`}>
            {currentPlan === "Bronze" && <span className="active-badge">Active Plan</span>}
            <div className="plan-header">
              <Award size={24} color="#d97706" />
              <h3>Bronze Plan</h3>
            </div>
            <div className="plan-price">
              <span className="amount">₹100</span>
              <span className="period">/month</span>
            </div>
            <ul className="plan-features">
              <li><Check size={16} color="#10b981" /> <strong>3</strong> Applications / month</li>
              <li><Check size={16} color="#10b981" /> Email payment invoice receipt</li>
              <li><Check size={16} color="#10b981" /> Priority application processing</li>
            </ul>
            <button
              className="plan-btn bronze-btn"
              disabled={currentPlan === "Bronze" || processingPlan === "Bronze"}
              onClick={() => handleSubscribe("Bronze", 100)}
            >
              {processingPlan === "Bronze" ? "Processing..." : currentPlan === "Bronze" ? "Active Plan" : "Upgrade to Bronze"}
            </button>
          </div>

          {/* Silver Plan */}
          <div className={`plan-card ${currentPlan === "Silver" ? "active-plan" : ""}`}>
            {currentPlan === "Silver" && <span className="active-badge">Active Plan</span>}
            <div className="plan-header">
              <Award size={24} color="#0284c7" />
              <h3>Silver Plan</h3>
            </div>
            <div className="plan-price">
              <span className="amount">₹300</span>
              <span className="period">/month</span>
            </div>
            <ul className="plan-features">
              <li><Check size={16} color="#10b981" /> <strong>5</strong> Applications / month</li>
              <li><Check size={16} color="#10b981" /> Instant invoice PDF delivery</li>
              <li><Check size={16} color="#10b981" /> Higher applicant visibility</li>
            </ul>
            <button
              className="plan-btn silver-btn"
              disabled={currentPlan === "Silver" || processingPlan === "Silver"}
              onClick={() => handleSubscribe("Silver", 300)}
            >
              {processingPlan === "Silver" ? "Processing..." : currentPlan === "Silver" ? "Active Plan" : "Upgrade to Silver"}
            </button>
          </div>

          {/* Gold Plan */}
          <div className={`plan-card gold-card ${currentPlan === "Gold" ? "active-plan" : ""}`}>
            <span className="popular-badge">BEST VALUE</span>
            {currentPlan === "Gold" && <span className="active-badge">Active Plan</span>}
            <div className="plan-header">
              <Zap size={24} color="#eab308" />
              <h3>Gold Plan</h3>
            </div>
            <div className="plan-price">
              <span className="amount">₹1000</span>
              <span className="period">/month</span>
            </div>
            <ul className="plan-features">
              <li><Check size={16} color="#10b981" /> <strong>Unlimited</strong> Applications</li>
              <li><Check size={16} color="#10b981" /> Premium applicant badge</li>
              <li><Check size={16} color="#10b981" /> Immediate employer view</li>
            </ul>
            <button
              className="plan-btn gold-btn"
              disabled={currentPlan === "Gold" || processingPlan === "Gold"}
              onClick={() => handleSubscribe("Gold", 1000)}
            >
              {processingPlan === "Gold" ? "Processing..." : currentPlan === "Gold" ? "Active Plan" : "Upgrade to Gold"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;
