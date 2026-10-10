import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import RequestCard from '../components/RequestCard';
import { Inbox, Send, AlertCircle, Sparkles, CheckCircle2, Clock, Check, X } from 'lucide-react';

const Requests = () => {
  const { user } = useAuth();
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [mySentRequests, setMySentRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('incoming'); // 'incoming' | 'sent'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchRequests = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      setError('');
      const [resIncoming, resSent] = await Promise.all([
        api.get(`/users/${user.id}/incoming-requests`),
        api.get(`/users/${user.id}/requests`),
      ]);

      if (resIncoming.success) setIncomingRequests(resIncoming.data || []);
      if (resSent.success) setMySentRequests(resSent.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [user?.id]);

  const handleAccept = async (requestId) => {
    try {
      setError('');
      const res = await api.put(`/requests/${requestId}/accept`, null, {
        params: { ownerId: user.id },
      });
      setSuccess('Join request accepted! Student has been added to your project team.');
      setTimeout(() => setSuccess(''), 4000);
      fetchRequests();
    } catch (err) {
      setError(err.message || 'Failed to accept request.');
    }
  };

  const handleReject = async (requestId) => {
    if (!window.confirm('Are you sure you want to reject this join request?')) return;
    try {
      setError('');
      const res = await api.put(`/requests/${requestId}/reject`, null, {
        params: { ownerId: user.id },
      });
      setSuccess('Join request rejected.');
      setTimeout(() => setSuccess(''), 4000);
      fetchRequests();
    } catch (err) {
      setError(err.message || 'Failed to reject request.');
    }
  };

  const pendingIncomingCount = incomingRequests.filter(
    (r) => r.status === 'PENDING'
  ).length;

  return (
    <div className="requests-page max-w-5xl">
      <div className="page-header">
        <div>
          <h1 className="page-title">Team Collaboration Requests</h1>
          <p className="page-subtitle">
            Review candidates applying to your projects and track the status of your own applications.
          </p>
        </div>
      </div>

      {success && (
        <div className="alert alert-success my-4">
          <Sparkles size={18} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-error my-4">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="tabs-header-bar mt-6">
        <button
          type="button"
          className={`tab-btn ${activeTab === 'incoming' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('incoming')}
        >
          <Inbox size={18} />
          <span>Incoming Requests</span>
          {pendingIncomingCount > 0 ? (
            <span className="tab-count-badge badge-warning">{pendingIncomingCount}</span>
          ) : (
            <span className="tab-count-badge">{incomingRequests.length}</span>
          )}
        </button>

        <button
          type="button"
          className={`tab-btn ${activeTab === 'sent' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('sent')}
        >
          <Send size={18} />
          <span>My Sent Requests</span>
          <span className="tab-count-badge">{mySentRequests.length}</span>
        </button>
      </div>

      {loading ? (
        <div className="page-loading-spinner">
          <div className="spinner"></div>
          <p>Loading requests...</p>
        </div>
      ) : activeTab === 'incoming' ? (
        /* Incoming Requests Tab */
        <div className="tab-content-area mt-6">
          {incomingRequests.length > 0 ? (
            <div className="requests-list">
              {incomingRequests.map((req) => (
                <RequestCard
                  key={req.id}
                  request={req}
                  type="incoming"
                  onAccept={handleAccept}
                  onReject={handleReject}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state-box">
              <Inbox size={48} className="text-muted" />
              <h3>No incoming requests</h3>
              <p>When other students apply to join your projects, they will appear here for your review.</p>
            </div>
          )}
        </div>
      ) : (
        /* My Sent Requests Tab */
        <div className="tab-content-area mt-6">
          {mySentRequests.length > 0 ? (
            <div className="requests-list">
              {mySentRequests.map((req) => (
                <RequestCard
                  key={req.id}
                  request={req}
                  type="outgoing"
                />
              ))}
            </div>
          ) : (
            <div className="empty-state-box">
              <Send size={48} className="text-muted" />
              <h3>You haven't requested to join any projects</h3>
              <p>Explore open projects, find skills matching your interests, and submit a join request!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Requests;
