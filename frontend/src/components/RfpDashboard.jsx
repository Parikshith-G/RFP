import React, { useState, useEffect, useCallback } from "react";

import "./RfpStyles.css";
const API_BASE_URL = "http://localhost:3000";

const RfpDashboard = () => {
  const [userText, setUserText] = useState("");
  const [rfpId, setRfpId] = useState(null);
  const [status, setStatus] = useState("Ready to create RFP.");
  const [proposals, setProposals] = useState([]);
  const [recommendation, setRecommendation] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchProposals = useCallback(async () => {
    if (!rfpId) return;

    try {
      const response = await fetch(`${API_BASE_URL}/rfps/${rfpId}/proposals`);
      if (!response.ok) throw new Error("Failed to fetch proposals.");

      const data = await response.json();

      setProposals(data.proposals);
      setRecommendation(data.aiRecommendation);
      setStatus(
        `Proposals received: ${
          data.proposals.length
        }. Last updated: ${new Date().toLocaleTimeString()}`
      );
    } catch (error) {
      console.error("Polling Error:", error);
      setStatus("Error fetching proposals. Check console.");
    }
  }, [rfpId]);

  useEffect(() => {
    let intervalId;
    console.log("Setting up polling for RFP ID:", rfpId);
    if (rfpId) {
      intervalId = setInterval(fetchProposals, 15000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [rfpId, fetchProposals]);

  const handleCreateRfp = async (e) => {
    e.preventDefault();
    if (!userText.trim()) return;

    setLoading(true);
    setProposals([]);
    setRecommendation("");
    setStatus("Sending text to AI and distributing RFP...");

    try {
      const response = await fetch(`${API_BASE_URL}/rfps/raw-text`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create RFP.");
      }

      const newRfpId = data.rfp.id;
      setRfpId(newRfpId);
      setLoading(false);
      setStatus(
        `RFP created (${newRfpId}) and sent to ${data.vendorsSentTo.length} vendors. Polling started...`
      );

      await fetchProposals();
    } catch (error) {
      setLoading(false);
      console.error("RFP Creation Error:", error);
      setStatus(`Creation failed: ${error.message}`);
    }
  };
  return (
    <div className="container">
      <h1>Procurement Manager Dashboard</h1>
      <p style={{ color: "blue" }}>Status: {status}</p>

      <form onSubmit={handleCreateRfp} className="form">
        <h2>1. Create RFP (Natural Language Input)</h2>

        <textarea
          value={userText}
          onChange={(e) => setUserText(e.target.value)}
          placeholder="E.g., I need to procure laptops and monitors for our new office. Budget is $50,000 total. Need delivery within 30 days. We need 20 laptops..."
          rows="5"
          className="textarea"
          disabled={loading || !!rfpId}
        />

        <button type="submit" disabled={loading || !!rfpId} className="button">
          {loading ? "Processing..." : "Create & Distribute RFP"}
        </button>

        {rfpId && (
          <p>
            Current RFP ID: <strong>{rfpId}</strong>
          </p>
        )}
      </form>

      <hr className="hr" />

      {rfpId && (
        <section>
          <h2>2. Proposal Comparison & Evaluation</h2>

          <div className="recommendationBox">
            <h3>AI Recommendation</h3>
            <p className="recommendationText">
              {recommendation ||
                "Awaiting enough proposals to generate a recommendation..."}
            </p>
          </div>

          <h3>Received Proposals ({proposals.length})</h3>

          <table className="table">
            <thead>
              <tr className="tableHeaderRow">
                <th className="tableHeader">Rank</th>
                <th className="tableHeader">Vendor</th>
                <th className="tableHeader">Price</th>
                <th className="tableHeader">Delivery (Days)</th>
                <th className="tableHeader">Warranty (Yrs)</th>
                <th className="tableHeader" style={{ color: "green" }}>
                  Final Score
                </th>
              </tr>
            </thead>

            <tbody>
              {proposals.map((p, index) => (
                <tr
                  key={p.id}
                  style={{
                    backgroundColor: index === 0 ? "#ff7272ff" : "lightred",
                  }}
                >
                  <td className="tableCell">**#{index + 1}**</td>
                  <td className="tableCell">{p.Vendor.name}</td>
                  <td className="tableCell">
                    ${Number(p.totalPrice).toLocaleString()}
                  </td>
                  <td className="tableCell">{p.deliveryDays}</td>
                  <td className="tableCell">
                    {p.parsed?.warranty_years || "N/A"}
                  </td>
                  <td className="tableCell">**{p.score}**</td>
                </tr>
              ))}

              {proposals.length === 0 && (
                <tr>
                  <td colSpan="6" className="emptyCell">
                    Awaiting first vendor reply...
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <p className="simulationNote">
            *To simulate vendor replies, use Postman to send a{" "}
            <strong>POST</strong> request to the{" "}
            <strong>{API_BASE_URL}/proposals/inbound</strong> endpoint with the
            RFP ID and Vendor details. The table will refresh automatically.
          </p>
        </section>
      )}
    </div>
  );
};

export default RfpDashboard;
