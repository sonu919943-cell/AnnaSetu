import React, { useState, useEffect } from 'react';
import { Heart, Clock, Truck, CheckCircle2, ShieldCheck, MapPin, QrCode, ArrowRight, UserCheck, Utensils, Package, Leaf } from 'lucide-react';
import { MOCK_NGOS } from '../data/mockData';
import { collection, query, where, orderBy, onSnapshot, Timestamp, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { BATCH_STATUS, NGO_WINDOW_MS } from '../constants/statusEnum';
import CountdownTimer from './CountdownTimer';
import DeliveryVerificationModal from './DeliveryVerificationModal';

export default function NgoRoleView({ surplusItems = [], isFertilizer = false, onScanQrCode }) {
  const { currentUser } = useAuth();
  const [selectedNgoId, setSelectedNgoId] = useState(MOCK_NGOS[0].id);
  const currentNgo = MOCK_NGOS.find(n => n.id === selectedNgoId) || MOCK_NGOS[0];

  // Live Firestore batches
  const [liveBatches, setLiveBatches] = useState([]);
  const [isLoadingLive, setIsLoadingLive] = useState(true);

  // Verification modal state
  const [verifyBatch, setVerifyBatch] = useState(null);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

  // Demo fallback requests — only shown when Firestore returns 0 live batches
  const DEMO_REQUESTS = [
    {
      id: 'REQ-9401',
      kitchenName: 'Taj Palace Hotel & Convention',
      foodName: 'Paneer Butter Masala',
      foodType: 'Paneer Butter Masala & Steamed Basmati Rice',
      quantityKg: 38,
      estimatedPlates: 125,
      pricing: 0,
      rawMaterial: 'Paneer, Tomato, Butter, Cream, Basmati Rice, Spices',
      distanceKm: 1.2,
      etaMins: 8,
      freshnessScore: isFertilizer ? 38 : 94,
      verdict: isFertilizer ? 'SPOILED' : 'EDIBLE',
      createdAt: new Date(),
      status: 'PENDING_CLAIM',
      qrCodeRef: 'AS-2026-FSSAI-89421',
      auditHash: '0x8f9a...8a9b',
      isDemo: true,
    },
    {
      id: 'REQ-9402',
      kitchenName: 'IIT Delhi Main Hostel Mess',
      foodName: 'Rajma Chawal',
      foodType: 'Rajma Chawal & Mix Veg Batch',
      quantityKg: 50,
      estimatedPlates: 160,
      pricing: 0,
      rawMaterial: 'Rajma, Basmati Rice, Mixed Vegetables, Spices',
      distanceKm: 2.1,
      etaMins: 12,
      freshnessScore: isFertilizer ? 22 : 92,
      verdict: isFertilizer ? 'SPOILED' : 'EDIBLE',
      createdAt: new Date(Date.now() - 5 * 60 * 1000),
      status: 'PENDING_CLAIM',
      qrCodeRef: 'AS-2026-FSSAI-89422',
      auditHash: '0x1a2b...9a0b',
      isDemo: true,
    }
  ];
  const [demoRequests, setDemoRequests] = useState(DEMO_REQUESTS);

  // ─── Firestore Real-Time Listener ───
  useEffect(() => {
    let unsubscribe = () => {};

    try {
      let q;
      if (isFertilizer) {
        // Fertilizer sees: SPOILED_PENDING or PENDING_FERTILIZER (expired NGO window)
        q = query(
          collection(db, 'surplus_batches'),
          where('status', 'in', [BATCH_STATUS.PENDING_FERTILIZER, BATCH_STATUS.SPOILED_PENDING]),
          orderBy('createdAt', 'desc')
        );
      } else {
        // NGO sees: EDIBLE + PENDING_NGO + created within last 30 minutes
        const thirtyMinAgo = Timestamp.fromDate(new Date(Date.now() - NGO_WINDOW_MS));
        q = query(
          collection(db, 'surplus_batches'),
          where('verdict', '==', 'EDIBLE'),
          where('status', '==', BATCH_STATUS.PENDING_NGO),
          where('createdAt', '>', thirtyMinAgo),
          orderBy('createdAt', 'desc')
        );
      }

      unsubscribe = onSnapshot(q, (snapshot) => {
        const batches = snapshot.docs.map(d => ({
          firestoreId: d.id,
          ...d.data(),
          // Ensure createdAt is a JS Date for the CountdownTimer
          createdAt: d.data().createdAt?.toDate ? d.data().createdAt.toDate() : new Date(),
        }));
        setLiveBatches(batches);
        setIsLoadingLive(false);
      }, (error) => {
        console.error('Firestore onSnapshot error:', error);
        setIsLoadingLive(false);
      });
    } catch (err) {
      console.error('Firestore query setup error:', err);
      setIsLoadingLive(false);
    }

    return () => unsubscribe();
  }, [isFertilizer]);

  // ─── Accept Request Handler ───
  const handleAcceptRequest = async (reqId, isLiveBatch = false) => {
    if (isLiveBatch) {
      // Update Firestore document directly
      try {
        await updateDoc(doc(db, 'surplus_batches', reqId), {
          status: BATCH_STATUS.ACCEPTED_EN_ROUTE,
          acceptedByUid: currentUser?.uid || 'demo-ngo',
          acceptedByName: currentNgo.name,
          acceptedAt: serverTimestamp(),
          ...(isFertilizer 
            ? { assignedProcessor: currentNgo.name }
            : { assignedNgo: currentNgo.name }),
          matchedEta: `${currentNgo.etaMins || 10} mins`,
        });
        console.log(`[AnnaSetu] Batch ${reqId} accepted by ${currentNgo.name}`);
      } catch (err) {
        console.error('Failed to accept batch:', err);
      }
    } else {
      // Demo mode: local state update
      setDemoRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'ACCEPTED_EN_ROUTE' } : r));
    }
  };

  // ─── Open Verification Modal ───
  const handleOpenVerify = (batch) => {
    setVerifyBatch(batch);
    setIsVerifyModalOpen(true);
  };

  const handleVerified = (updatedBatch) => {
    // Update local demo state
    setDemoRequests(prev => prev.map(r => 
      r.id === updatedBatch.id ? { ...r, status: BATCH_STATUS.ACCEPTED_AND_VERIFIED } : r
    ));
    setTimeout(() => setIsVerifyModalOpen(false), 2000);
  };

  // Show live Firestore batches first; demo requests as fallback
  const displayRequests = liveBatches.length > 0
    ? liveBatches.map(b => ({ ...b, id: b.batchCode || b.firestoreId, isLive: true }))
    : demoRequests;

  return (
    <div className="space-y-8">
      {/* Top Header Bar */}
      <div className="p-6 rounded-2xl glass-card border border-annagreen-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-saffron-500/20 border border-saffron-500/30 flex items-center justify-center text-saffron-400 font-bold text-xl">
            <Heart className="w-7 h-7 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-extrabold text-white">{currentNgo.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-saffron-500/20 text-saffron-600 border border-saffron-500/30">
                {isFertilizer ? 'Verified Bio-Processor' : 'Verified Recipient Partner'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              📍 {currentNgo.address} · Contact: <strong>{currentNgo.contactPerson} ({currentNgo.phone})</strong>
            </p>
          </div>
        </div>

        {/* Switch NGO Dropdown */}
        <div className="text-right">
          <p className="text-[11px] text-slate-500 font-semibold uppercase">
            {isFertilizer ? 'Switch Processor Profile' : 'Switch NGO Profile'}
          </p>
          <select
            value={selectedNgoId}
            onChange={(e) => setSelectedNgoId(e.target.value)}
            className="bg-darkbg-800 text-white text-xs rounded-lg px-3 py-1.5 border border-slate-700 focus:outline-none focus:border-annagreen-500 font-semibold"
          >
            {MOCK_NGOS.map(n => (
              <option key={n.id} value={n.id}>{n.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-md">
          <p className="text-xs text-slate-500 font-semibold uppercase">
            {isFertilizer ? 'Waste Processed This Month' : 'Meals Rescued This Month'}
          </p>
          <p className="text-3xl font-extrabold text-annagreen-600 mt-1 font-mono">
            {isFertilizer ? '1,450 kg' : '4,280 Plates'}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Over 34 donor kitchens</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-saffron-200 shadow-md">
          <p className="text-xs text-slate-500 font-semibold uppercase">
            {isFertilizer ? 'Active Diversion Claims' : 'Active Match Claims'}
          </p>
          <p className="text-3xl font-extrabold text-saffron-600 mt-1 font-mono">
            {displayRequests.filter(r => r.status === 'ACCEPTED_EN_ROUTE').length + 1}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Pickups currently en route</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-md">
          <p className="text-xs text-slate-500 font-semibold uppercase">
            {isFertilizer ? 'Avg CO₂e Offset/Day' : 'Avg Response Latency'}
          </p>
          <p className="text-3xl font-extrabold text-slate-800 mt-1 font-mono">
            {isFertilizer ? '4.2 Tonnes' : '1.2 Mins'}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            {isFertilizer ? 'Converted to Bio-CNG & BSFL' : 'Claimed within 30-minute window'}
          </p>
        </div>
      </div>

      {/* Incoming Match Requests Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
            <Clock className="w-5 h-5 text-saffron-500" /> 
            {isFertilizer ? 'Incoming Spoiled Waste Diversions' : 'Incoming AI Surplus Match Requests'}
          </h2>
          <div className="flex items-center gap-2">
            {!isFertilizer && (
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-600">
                30-MIN WINDOW
              </span>
            )}
            <span className="text-xs font-mono text-annagreen-600">Live Geo-Dispatch Feed</span>
          </div>
        </div>

        {/* Live Firestore Batches */}
        {liveBatches.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-annagreen-500 uppercase tracking-wider flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-annagreen-500 animate-pulse" />
              Live from Firestore ({liveBatches.length})
            </p>
            <div className="grid grid-cols-1 gap-4">
              {liveBatches.map((req) => {
                const isAccepted = req.status === BATCH_STATUS.ACCEPTED_EN_ROUTE;
                const isVerified = req.status === BATCH_STATUS.ACCEPTED_AND_VERIFIED;
                return (
                  <div
                    key={req.firestoreId}
                    className="p-5 rounded-2xl bg-darkbg-800/90 border border-annagreen-500/30 hover:border-annagreen-500/60 transition-all flex flex-col gap-4 shadow-lg ring-1 ring-annagreen-500/10"
                  >
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold text-annagreen-400">{req.batchCode || req.firestoreId?.slice(0,8)}</span>
                          <h3 className="font-bold text-white text-base">{req.foodName || req.foodType}</h3>
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Score: {req.freshnessScore}/100
                          </span>
                          {req.pricing > 0 && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-saffron-500/20 text-saffron-300 border border-saffron-500/30">
                              ₹{req.pricing}
                            </span>
                          )}
                          {req.pricing === 0 && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-annagreen-500/20 text-annagreen-300 border border-annagreen-500/30">
                              FREE
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-300">
                          Donor: <strong className="text-white">{req.kitchenName}</strong> · Qty: <strong className="text-white">{req.quantityKg} kg ({req.estimatedPlates} plates)</strong>
                        </p>
                        {req.rawMaterial && (
                          <p className="text-[10px] text-slate-500 flex items-center gap-1">
                            <Leaf className="w-3 h-3 text-annagreen-500" /> {req.rawMaterial}
                          </p>
                        )}
                      </div>

                      {/* Countdown Timer (NGO only) */}
                      {!isFertilizer && !isAccepted && !isVerified && (
                        <CountdownTimer createdAt={req.createdAt} windowMinutes={30} />
                      )}
                    </div>

                    <div className="flex items-center justify-end gap-2">
                      {isVerified ? (
                        <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                          <ShieldCheck className="w-4 h-4" /> Verified ✓
                        </span>
                      ) : isAccepted ? (
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                            <Truck className="w-4 h-4 animate-bounce" /> Driver En Route
                          </span>
                          <button
                            onClick={() => handleOpenVerify(req)}
                            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold flex items-center gap-1 shadow-sm"
                          >
                            <ShieldCheck className="w-4 h-4 text-annagreen-600" />
                            Scan & Verify
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAcceptRequest(req.firestoreId, true)}
                          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-annagreen-500 to-annagreen-600 hover:from-annagreen-600 hover:to-annagreen-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          {isFertilizer ? 'Accept Waste & Dispatch Truck' : 'Accept Surplus & Dispatch Vehicle'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Demo / Hardcoded Requests (Fallback when no live data) */}
        {liveBatches.length === 0 && (
          <div className="grid grid-cols-1 gap-4">
            {demoRequests.map((req) => {
            const isAccepted = req.status === 'ACCEPTED_EN_ROUTE';
            const isVerified = req.status === BATCH_STATUS.ACCEPTED_AND_VERIFIED;
            return (
              <div
                key={req.id}
                className="p-5 rounded-2xl bg-darkbg-800/90 border border-slate-700/60 hover:border-annagreen-500/40 transition-all flex flex-col gap-4 shadow-lg"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-saffron-400">{req.id}</span>
                      <h3 className="font-bold text-white text-base">{req.foodName || req.foodType}</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Score: {req.freshnessScore}/100
                      </span>
                      {req.pricing > 0 && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-saffron-500/20 text-saffron-300 border border-saffron-500/30">
                          ₹{req.pricing}
                        </span>
                      )}
                      {req.pricing === 0 && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-annagreen-500/20 text-annagreen-300 border border-annagreen-500/30">
                          FREE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300">
                      Donor: <strong className="text-white">{req.kitchenName}</strong> · Quantity: <strong className="text-white">{req.quantityKg} kg ({req.estimatedPlates} plates)</strong>
                    </p>
                    {req.rawMaterial && (
                      <p className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Leaf className="w-3 h-3 text-annagreen-500" /> {req.rawMaterial}
                      </p>
                    )}
                    <p className="text-[11px] text-slate-400 flex items-center gap-3">
                      <span>📍 Distance: <strong>{req.distanceKm} km ({req.etaMins} mins ETA)</strong></span>
                      <span>•</span>
                      <span>Fleet: <strong>{currentNgo.vehicle}</strong></span>
                    </p>
                  </div>

                  {/* Countdown Timer (NGO only, demo requests) */}
                  {!isFertilizer && !isAccepted && !isVerified && req.createdAt && (
                    <CountdownTimer createdAt={req.createdAt} windowMinutes={30} />
                  )}
                </div>

                <div className="self-end flex items-center gap-2">
                  {isVerified ? (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" /> Verified ✓
                    </span>
                  ) : !isAccepted ? (
                    <button
                      onClick={() => handleAcceptRequest(req.id)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-annagreen-500 to-annagreen-600 hover:from-annagreen-600 hover:to-annagreen-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      {isFertilizer ? 'Accept Waste & Dispatch Truck' : 'Accept Surplus & Dispatch Vehicle'}
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                        <Truck className="w-4 h-4 animate-bounce" /> Driver En Route
                      </span>
                      <button
                        onClick={() => handleOpenVerify(req)}
                        className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold flex items-center gap-1 shadow-sm"
                      >
                        <ShieldCheck className="w-4 h-4 text-annagreen-600" />
                        Scan & Verify
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        )}
      </div>

      {/* Delivery Verification Modal */}
      <DeliveryVerificationModal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        batch={verifyBatch}
        onVerified={handleVerified}
        isFertilizer={isFertilizer}
      />
    </div>
  );
}
