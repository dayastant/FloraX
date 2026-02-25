import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Leaf, Droplets, Thermometer, Activity, Bell, Settings, LogOut,
    LayoutDashboard, ChevronRight, CheckCircle2, AlertTriangle, Clock,
    Gauge, Waves, Zap, RefreshCw, X, Eye, TrendingUp, TrendingDown,
    FlaskConical, Wind, Cpu,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
    getMyDashboard, getDashboardSummary, getAllZones, getActiveAlerts,
    getRecentAlerts, getAllSensors, getFaultySensors, getTodayIrrigationLogs,
    getWeeklyIrrigationLogs, getMonthlyIrrigationLogs, getAllWaterTanks,
    getLowWaterTanks, getAllValves, getOpenValves, resolveAlert,
} from "../api/userDashboardService";

// ── Sidebar navigation items ────────────────────────────────────────────────
const NAV_ITEMS = [
    { id: "overview", icon: LayoutDashboard, label: "Overview" },
    { id: "zones", icon: Droplets, label: "Zones" },
    { id: "sensors", icon: FlaskConical, label: "Sensors" },
    { id: "irrigation", icon: Waves, label: "Irrigation" },
    { id: "alerts", icon: Bell, label: "Alerts" },
    { id: "tanks", icon: Gauge, label: "Water Tanks" },
    { id: "valves", icon: Zap, label: "Valves" },
];

// ── Status helpers ──────────────────────────────────────────────────────────
const statusBadge = {
    ACTIVE: "bg-emerald-100 text-emerald-700",
    IDLE: "bg-slate-100 text-slate-600",
    ALERT: "bg-red-100 text-red-700",
    UNKNOWN: "bg-gray-100 text-gray-500",
    OPEN: "bg-blue-100 text-blue-700",
    CLOSED: "bg-slate-100 text-slate-600",
    FAULTY: "bg-red-100 text-red-700",
    INACTIVE: "bg-orange-100 text-orange-700",
    NORMAL: "bg-green-100 text-green-700",
    LOW: "bg-yellow-100 text-yellow-700",
    EMPTY: "bg-red-100 text-red-700",
    FULL: "bg-blue-100 text-blue-700",
};

const moistureColor = (v) => {
    if (v == null) return "bg-gray-300";
    if (v >= 70) return "bg-emerald-500";
    if (v >= 40) return "bg-yellow-400";
    return "bg-red-500";
};

const alertTypeIcon = {
    LOW_WATER: <Droplets size={15} className="text-blue-500" />,
    DRY_SOIL: <Leaf size={15} className="text-amber-500" />,
    SENSOR_FAULT: <Cpu size={15} className="text-red-500" />,
};

// ── Animation variants ──────────────────────────────────────────────────────
const fadeUp = {
    hidden: { opacity: 0, y: 18 },
    visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.4 } }),
};

// ── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color, bg, delay = 0 }) {
    return (
        <motion.div
            custom={delay}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(0,0,0,0.10)" }}
            className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-4 cursor-default group transition-all"
        >
            <div className={`p-3 rounded-xl ${bg} group-hover:scale-110 transition-transform`}>
                <Icon size={22} className={color} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{label}</p>
                <p className="text-2xl font-bold text-gray-800 mt-0.5 leading-tight">{value ?? "—"}</p>
                {sub && <p className={`text-xs mt-1 font-medium ${color}`}>{sub}</p>}
            </div>
        </motion.div>
    );
}

// ── Section Header ──────────────────────────────────────────────────────────
function SectionHeader({ title, badge, onRefresh, loading }) {
    return (
        <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-gray-800">{title}</h2>
                {badge && (
                    <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-0.5 rounded-full border border-emerald-100">
                        {badge}
                    </span>
                )}
            </div>
            {onRefresh && (
                <button
                    onClick={onRefresh}
                    className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-emerald-600 transition-colors"
                >
                    <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
                </button>
            )}
        </div>
    );
}

// ── Skeleton Loader ─────────────────────────────────────────────────────────
function Skeleton({ className = "" }) {
    return <div className={`bg-gray-100 rounded-xl animate-pulse ${className}`} />;
}

// ════════════════════════════════════════════════════════════════════════════
// VIEWS
// ════════════════════════════════════════════════════════════════════════════

// Overview View
function OverviewView({ summary, dashboard, loading }) {
    if (loading) return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-28" />)}
            </div>
        </div>
    );

    const s = summary || {};
    const d = dashboard || {};

    const stats = [
        { icon: Leaf, label: "Gardens", value: s.totalGardens ?? d.totalGardens, sub: "Total gardens", color: "text-green-600", bg: "bg-green-50" },
        { icon: Droplets, label: "Zones", value: s.totalZones ?? d.totalZones, sub: "Irrigation zones", color: "text-blue-600", bg: "bg-blue-50" },
        { icon: FlaskConical, label: "Sensors", value: s.totalSensors, sub: `${s.activeSensors ?? 0} active`, color: "text-violet-600", bg: "bg-violet-50" },
        { icon: AlertTriangle, label: "Active Alerts", value: s.activeAlerts ?? d.activeAlerts, sub: `${s.resolvedAlertsToday ?? 0} resolved today`, color: "text-red-500", bg: "bg-red-50" },
        { icon: Waves, label: "Water Today", value: s.totalWaterUsedToday != null ? `${s.totalWaterUsedToday}L` : "—", sub: `${s.totalIrrigationsToday ?? 0} irrigations`, color: "text-cyan-600", bg: "bg-cyan-50" },
        { icon: TrendingUp, label: "Water This Week", value: s.totalWaterUsedThisWeek != null ? `${s.totalWaterUsedThisWeek}L` : "—", sub: `${s.totalIrrigationsThisWeek ?? 0} sessions`, color: "text-teal-600", bg: "bg-teal-50" },
        { icon: Gauge, label: "Avg Moisture", value: s.avgMoistureLevel != null ? `${s.avgMoistureLevel}%` : d.avgMoistureLevel != null ? `${d.avgMoistureLevel}%` : "—", sub: "Across all zones", color: "text-indigo-600", bg: "bg-indigo-50" },
        { icon: Zap, label: "Open Valves", value: s.openValves ?? "—", sub: `of ${s.totalValves ?? 0} total`, color: "text-amber-600", bg: "bg-amber-50" },
    ];

    return (
        <div className="space-y-8">
            {/* Stat grid */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {stats.map((s, i) => <StatCard key={s.label} {...s} delay={i} />)}
            </div>

            {/* Gardens list */}
            {d.gardens?.length > 0 && (
                <motion.div variants={fadeUp} initial="hidden" animate="visible" className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-50">
                        <h2 className="text-base font-bold text-gray-800">Your Gardens</h2>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {d.gardens.map((g) => (
                            <div key={g.gardenId} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div>
                                    <p className="font-semibold text-gray-800">{g.gardenName}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{g.location || "No location set"} · {g.totalZones} zone{g.totalZones !== 1 ? "s" : ""}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    {g.activeAlerts > 0 && (
                                        <span className="flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full">
                                            <AlertTriangle size={11} /> {g.activeAlerts} alert{g.activeAlerts !== 1 ? "s" : ""}
                                        </span>
                                    )}
                                    <span className="text-xs text-gray-400">{g.totalArea ? `${g.totalArea} m²` : ""}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
}

// Zones View
function ZonesView() {
    const [zones, setZones] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        try { setZones(await getAllZones() || []); } catch (_) { setZones([]); }
        setLoading(false);
    }, []);

    useEffect(() => { load(); }, [load]);

    return (
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                <SectionHeader title="Irrigation Zones" badge={`${zones.length} total`} onRefresh={load} loading={loading} />
            </div>
            {loading ? (
                <div className="p-6 space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-14" />)}</div>
            ) : zones.length === 0 ? (
                <div className="p-10 text-center text-gray-400 text-sm">No zones found</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-400 uppercase text-xs">
                            <tr>
                                {["Zone", "Plant / Soil", "Moisture", "Status", "Last Irrigated"].map(h => (
                                    <th key={h} className="px-6 py-3 text-left font-semibold tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {zones.map((z, i) => (
                                <motion.tr key={z.zoneId} custom={i} variants={fadeUp} initial="hidden" animate="visible"
                                    className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-semibold text-gray-800">{z.zoneName}</td>
                                    <td className="px-6 py-4 text-gray-500 text-xs">
                                        <div>{z.plantType || "—"}</div>
                                        <div className="text-gray-300">{z.soilType || ""}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 bg-gray-100 rounded-full h-2 w-24">
                                                <div className={`h-2 rounded-full ${moistureColor(z.latestMoistureReading)}`}
                                                    style={{ width: `${Math.min(z.latestMoistureReading ?? 0, 100)}%` }} />
                                            </div>
                                            <span className="text-xs font-semibold text-gray-700 w-8">
                                                {z.latestMoistureReading != null ? `${z.latestMoistureReading}%` : "—"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusBadge[z.irrigationStatus] || "bg-gray-100 text-gray-500"}`}>
                                            {z.irrigationStatus || "UNKNOWN"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 text-xs">{z.lastIrrigated || "Never"}</td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </motion.div>
    );
}

// Sensors View
function SensorsView() {
    const [sensors, setSensors] = useState([]);
    const [faulty, setFaulty] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFaulty, setShowFaulty] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const [all, f] = await Promise.all([getAllSensors(), getFaultySensors()]);
            setSensors(all || []); setFaulty(f || []);
        } catch (_) { setSensors([]); }
        setLoading(false);
    }, []);

    useEffect(() => { load(); }, [load]);

    const displayed = showFaulty ? faulty : sensors;

    return (
        <div className="space-y-5">
            <div className="flex items-center gap-3">
                <SectionHeader title="Sensors" badge={`${sensors.length} total`} onRefresh={load} loading={loading} />
                <button onClick={() => setShowFaulty(!showFaulty)}
                    className={`ml-auto text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${showFaulty ? "bg-red-600 text-white border-red-600" : "border-gray-200 text-gray-500 hover:border-red-400 hover:text-red-500"}`}>
                    {showFaulty ? "All Sensors" : `Faulty (${faulty.length})`}
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {loading
                    ? [...Array(6)].map((_, i) => <Skeleton key={i} className="h-32" />)
                    : displayed.length === 0
                        ? <div className="col-span-3 py-10 text-center text-gray-400 text-sm">No sensors found</div>
                        : displayed.map((s, i) => (
                            <motion.div key={s.sensorId} custom={i} variants={fadeUp} initial="hidden" animate="visible"
                                className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-violet-50 rounded-lg"><FlaskConical size={16} className="text-violet-600" /></div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-800">{s.sensorType || "Sensor"}</p>
                                            <p className="text-xs text-gray-400">{s.serialNumber || "—"}</p>
                                        </div>
                                    </div>
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusBadge[s.status] || "bg-gray-100 text-gray-500"}`}>
                                        {s.status || "—"}
                                    </span>
                                </div>
                                <div className="mt-2">
                                    <p className="text-2xl font-bold text-gray-800">{s.latestReading != null ? s.latestReading : "—"}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{s.recordedAt || "No readings yet"}</p>
                                </div>
                            </motion.div>
                        ))
                }
            </div>
        </div>
    );
}

// Irrigation View — with Monthly period, Monthly Averages, and Filter bar
function IrrigationView() {
    const [logs, setLogs] = useState([]);
    const [weekLogs, setWeekLogs] = useState([]);
    const [monthLogs, setMonthLogs] = useState([]);
    const [period, setPeriod] = useState("today");
    const [loading, setLoading] = useState(true);

    // Filter state
    const [filterZone, setFilterZone] = useState("");
    const [filterTrigger, setFilterTrigger] = useState("ALL");

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const [t, w, m] = await Promise.all([
                getTodayIrrigationLogs(),
                getWeeklyIrrigationLogs(),
                getMonthlyIrrigationLogs(),
            ]);
            setLogs(t || []); setWeekLogs(w || []); setMonthLogs(m || []);
        } catch (_) { setLogs([]); setWeekLogs([]); setMonthLogs([]); }
        setLoading(false);
    }, []);

    useEffect(() => { load(); }, [load]);

    // ── Select raw data by period ────────────────────────────────────────────
    const rawData = period === "today" ? logs : period === "week" ? weekLogs : monthLogs;

    // ── Derive unique trigger types for filter dropdown ──────────────────────
    const triggerTypes = ["ALL", ...Array.from(new Set(monthLogs.map(l => l.triggerType).filter(Boolean)))];

    // ── Apply filters ────────────────────────────────────────────────────────
    const displayed = rawData.filter(l => {
        const zoneMatch = filterZone.trim() === "" ||
            (l.zoneName || "").toLowerCase().includes(filterZone.trim().toLowerCase());
        const triggerMatch = filterTrigger === "ALL" || l.triggerType === filterTrigger;
        return zoneMatch && triggerMatch;
    });

    // ── Monthly averages (computed from full monthLogs, not filtered) ────────
    const monthStats = (() => {
        const total = monthLogs.length;
        if (total === 0) return null;

        const totalWater = monthLogs.reduce((s, l) => s + (l.waterVolumeUsed ?? 0), 0);
        const totalDuration = monthLogs.reduce((s, l) => s + (l.durationMinutes ?? 0), 0);

        // unique days that had at least one session
        const uniqueDays = new Set(
            monthLogs
                .filter(l => l.startTime)
                .map(l => new Date(l.startTime).toDateString())
        ).size || 1;

        return {
            totalSessions: total,
            totalWaterL: totalWater.toFixed(1),
            avgSessionsPerDay: (total / uniqueDays).toFixed(1),
            avgWaterPerSession: (totalWater / total).toFixed(1),
            avgDurationMin: (totalDuration / total).toFixed(1),
            activeDays: uniqueDays,
        };
    })();

    const PERIODS = [
        { id: "today", label: "Today" },
        { id: "week", label: "This Week" },
        { id: "month", label: "This Month" },
    ];

    return (
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-5">

            {/* ── Header row ─────────────────────────────────────────────── */}
            <div className="flex items-center flex-wrap gap-2">
                <SectionHeader title="Irrigation Logs" onRefresh={load} loading={loading} />
                <div className="ml-auto flex gap-1.5">
                    {PERIODS.map(p => (
                        <button key={p.id} onClick={() => setPeriod(p.id)}
                            className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all
                                ${period === p.id
                                    ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                                    : "border-gray-200 text-gray-500 hover:border-emerald-400 hover:text-emerald-600"}`}>
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Monthly Averages Summary Bar (shown only on month tab) ── */}
            {period === "month" && !loading && monthStats && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
                    {[
                        { label: "Total Sessions", value: monthStats.totalSessions, unit: "", icon: "🔁", color: "text-indigo-600", bg: "bg-indigo-50" },
                        { label: "Total Water Used", value: `${monthStats.totalWaterL}`, unit: "L", icon: "💧", color: "text-cyan-600", bg: "bg-cyan-50" },
                        { label: "Avg Sessions / Day", value: monthStats.avgSessionsPerDay, unit: "/day", icon: "📅", color: "text-emerald-600", bg: "bg-emerald-50" },
                        { label: "Avg Water / Session", value: monthStats.avgWaterPerSession, unit: "L", icon: "🪣", color: "text-blue-600", bg: "bg-blue-50" },
                        { label: "Avg Duration", value: monthStats.avgDurationMin, unit: "min", icon: "⏱️", color: "text-violet-600", bg: "bg-violet-50" },
                    ].map(stat => (
                        <div key={stat.label}
                            className={`${stat.bg} rounded-2xl p-4 flex flex-col gap-1 border border-white/60 shadow-sm`}>
                            <span className="text-lg leading-none">{stat.icon}</span>
                            <p className={`text-xl font-extrabold mt-1 ${stat.color}`}>
                                {stat.value}<span className="text-sm font-semibold ml-0.5 opacity-70">{stat.unit}</span>
                            </p>
                            <p className="text-xs text-gray-500 font-medium leading-tight">{stat.label}</p>
                        </div>
                    ))}
                </motion.div>
            )}

            {/* ── Filter bar ─────────────────────────────────────────────── */}
            <div className="flex flex-wrap gap-3 items-center">
                {/* Zone search */}
                <div className="relative flex-1 min-w-[180px] max-w-xs">
                    <input
                        type="text"
                        placeholder="Filter by zone name…"
                        value={filterZone}
                        onChange={e => setFilterZone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 bg-white placeholder-gray-400 transition"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        🔍
                    </span>
                    {filterZone && (
                        <button onClick={() => setFilterZone("")}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                            <X size={14} />
                        </button>
                    )}
                </div>

                {/* Trigger type dropdown */}
                <select
                    value={filterTrigger}
                    onChange={e => setFilterTrigger(e.target.value)}
                    className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-white text-gray-600 transition cursor-pointer">
                    {triggerTypes.map(t => (
                        <option key={t} value={t}>{t === "ALL" ? "All Triggers" : t}</option>
                    ))}
                </select>

                {/* Result count badge */}
                <span className="text-xs text-gray-400 font-medium ml-auto">
                    {displayed.length} record{displayed.length !== 1 ? "s" : ""}
                    {(filterZone || filterTrigger !== "ALL") && (
                        <button onClick={() => { setFilterZone(""); setFilterTrigger("ALL"); }}
                            className="ml-2 text-red-400 hover:text-red-600 font-semibold underline text-xs transition">
                            Clear filters
                        </button>
                    )}
                </span>
            </div>

            {/* ── Table ──────────────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-6 space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-14" />)}</div>
                ) : displayed.length === 0 ? (
                    <div className="py-14 text-center">
                        <p className="text-gray-400 text-sm">No irrigation logs match your filters</p>
                        {(filterZone || filterTrigger !== "ALL") && (
                            <button onClick={() => { setFilterZone(""); setFilterTrigger("ALL"); }}
                                className="mt-2 text-xs text-emerald-600 font-semibold hover:underline">
                                Clear filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-400 uppercase text-xs">
                                <tr>
                                    {["Zone", "Start Time", "End Time", "Duration", "Water Used", "Trigger"].map(h => (
                                        <th key={h} className="px-6 py-3 text-left font-semibold tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {displayed.map((l, i) => (
                                    <motion.tr key={l.logId || i} custom={i} variants={fadeUp}
                                        initial="hidden" animate="visible"
                                        className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-semibold text-gray-800">{l.zoneName || "—"}</td>
                                        <td className="px-6 py-4 text-gray-500 text-xs">
                                            {l.startTime ? new Date(l.startTime).toLocaleString() : "—"}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-xs">
                                            {l.endTime ? new Date(l.endTime).toLocaleString() : (
                                                <span className="text-emerald-600 font-semibold">In progress</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-700 font-medium">
                                            {l.durationMinutes != null ? `${l.durationMinutes} min` : "—"}
                                        </td>
                                        <td className="px-6 py-4 text-cyan-700 font-bold">
                                            {l.waterVolumeUsed != null ? `${l.waterVolumeUsed}L` : "—"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-semibold">
                                                {l.triggerType || "—"}
                                            </span>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Period totals footer */}
                        {displayed.length > 0 && (
                            <div className="bg-gray-50 border-t border-gray-100 px-6 py-3 flex flex-wrap gap-6 text-xs text-gray-500">
                                <span>
                                    <span className="font-semibold text-gray-700">{displayed.length}</span> sessions shown
                                </span>
                                <span>
                                    Total water:{" "}
                                    <span className="font-bold text-cyan-700">
                                        {displayed.reduce((s, l) => s + (l.waterVolumeUsed ?? 0), 0).toFixed(1)}L
                                    </span>
                                </span>
                                <span>
                                    Total duration:{" "}
                                    <span className="font-bold text-gray-700">
                                        {displayed.reduce((s, l) => s + (l.durationMinutes ?? 0), 0)} min
                                    </span>
                                </span>
                                <span>
                                    Avg water / session:{" "}
                                    <span className="font-bold text-blue-700">
                                        {displayed.length > 0
                                            ? (displayed.reduce((s, l) => s + (l.waterVolumeUsed ?? 0), 0) / displayed.length).toFixed(1)
                                            : "—"}L
                                    </span>
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
}

// Alerts View
function AlertsView() {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [resolving, setResolving] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        try { setAlerts(await getRecentAlerts(20) || []); } catch (_) { setAlerts([]); }
        setLoading(false);
    }, []);

    useEffect(() => { load(); }, [load]);

    const handleResolve = async (alertId) => {
        setResolving(alertId);
        try { await resolveAlert(alertId); await load(); } catch (_) { }
        setResolving(null);
    };

    return (
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-5">
            <SectionHeader title="Alerts" badge={`${alerts.filter(a => a.status === "ACTIVE").length} active`} onRefresh={load} loading={loading} />

            {loading
                ? <div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
                : alerts.length === 0
                    ? <div className="bg-white rounded-2xl border border-gray-100 py-12 text-center text-gray-400 text-sm">No alerts</div>
                    : (
                        <div className="space-y-3">
                            <AnimatePresence>
                                {alerts.map((a, i) => (
                                    <motion.div key={a.alertId || i} custom={i} variants={fadeUp} initial="hidden" animate="visible" exit={{ opacity: 0, x: 40 }}
                                        className={`bg-white rounded-2xl border p-4 flex items-start gap-4 hover:shadow-md transition-all ${a.status === "ACTIVE" ? "border-red-100" : "border-gray-100 opacity-60"}`}>
                                        <div className={`p-2 rounded-xl mt-0.5 ${a.status === "ACTIVE" ? "bg-red-50" : "bg-gray-50"}`}>
                                            {alertTypeIcon[a.type] || <Bell size={15} className="text-gray-400" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <p className="text-sm font-semibold text-gray-800">{a.message || "Alert"}</p>
                                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusBadge[a.status] || "bg-gray-100 text-gray-500"}`}>
                                                    {a.status}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {a.zoneName && <span className="mr-2">🌿 {a.zoneName}</span>}
                                                {a.type && <span className="mr-2">· {a.type?.replace("_", " ")}</span>}
                                                {a.createdAt && <span>· {new Date(a.createdAt).toLocaleString()}</span>}
                                            </p>
                                        </div>
                                        {a.status === "ACTIVE" && (
                                            <button onClick={() => handleResolve(a.alertId)}
                                                disabled={resolving === a.alertId}
                                                className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition-all disabled:opacity-50">
                                                <CheckCircle2 size={13} />
                                                {resolving === a.alertId ? "Resolving…" : "Resolve"}
                                            </button>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )
            }
        </motion.div>
    );
}

// Water Tanks View
function TanksView() {
    const [tanks, setTanks] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        try { setTanks(await getAllWaterTanks() || []); } catch (_) { setTanks([]); }
        setLoading(false);
    }, []);

    useEffect(() => { load(); }, [load]);

    return (
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-5">
            <SectionHeader title="Water Tanks" badge={`${tanks.length} tanks`} onRefresh={load} loading={loading} />

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {loading
                    ? [...Array(3)].map((_, i) => <Skeleton key={i} className="h-44" />)
                    : tanks.length === 0
                        ? <div className="col-span-3 py-12 text-center text-gray-400 text-sm">No water tanks found</div>
                        : tanks.map((t, i) => {
                            const pct = t.fillPercentage ?? 0;
                            const barColor = pct >= 60 ? "bg-emerald-500" : pct >= 30 ? "bg-yellow-400" : "bg-red-500";
                            return (
                                <motion.div key={t.tankId} custom={i} variants={fadeUp} initial="hidden" animate="visible"
                                    className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-all">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-cyan-50 rounded-xl"><Gauge size={18} className="text-cyan-600" /></div>
                                            <p className="font-bold text-gray-800 text-sm">Tank #{t.tankId}</p>
                                        </div>
                                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusBadge[t.status] || "bg-gray-100 text-gray-500"}`}>
                                            {t.status || "—"}
                                        </span>
                                    </div>
                                    {/* Tank visual */}
                                    <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden mb-3">
                                        <motion.div className={`h-4 rounded-full ${barColor}`} initial={{ width: 0 }}
                                            animate={{ width: `${pct}%` }} transition={{ duration: 1, ease: "easeOut" }} />
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">{t.currentLevelLiters?.toFixed(1) ?? "—"}L</span>
                                        <span className="font-bold text-gray-800 text-lg">{pct.toFixed(0)}%</span>
                                        <span className="text-gray-400">of {t.capacityLiters?.toFixed(0) ?? "—"}L</span>
                                    </div>
                                </motion.div>
                            );
                        })
                }
            </div>
        </motion.div>
    );
}

// Valves View
function ValvesView() {
    const [valves, setValves] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        try { setValves(await getAllValves() || []); } catch (_) { setValves([]); }
        setLoading(false);
    }, []);

    useEffect(() => { load(); }, [load]);

    return (
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-5">
            <SectionHeader title="Valves"
                badge={`${valves.filter(v => v.valveStatus === "OPEN").length} open`}
                onRefresh={load} loading={loading} />

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {loading
                    ? [...Array(4)].map((_, i) => <Skeleton key={i} className="h-32" />)
                    : valves.length === 0
                        ? <div className="col-span-3 py-12 text-center text-gray-400 text-sm">No valves found</div>
                        : valves.map((v, i) => (
                            <motion.div key={v.valveId} custom={i} variants={fadeUp} initial="hidden" animate="visible"
                                className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className={`p-2 rounded-xl ${v.valveStatus === "OPEN" ? "bg-blue-50" : "bg-gray-50"}`}>
                                            <Zap size={16} className={v.valveStatus === "OPEN" ? "text-blue-600" : "text-gray-400"} />
                                        </div>
                                        <p className="font-bold text-gray-800 text-sm">Valve #{v.valveId}</p>
                                    </div>
                                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusBadge[v.valveStatus] || "bg-gray-100 text-gray-500"}`}>
                                        {v.valveStatus || "—"}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 font-medium">{v.zoneName || "Unknown zone"}</p>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-xs text-gray-400">Power: {v.powerSource || "—"}</span>
                                    {v.lastActivatedAt && (
                                        <span className="text-xs text-gray-400">
                                            {new Date(v.lastActivatedAt).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            </motion.div>
                        ))
                }
            </div>
        </motion.div>
    );
}

// ════════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ════════════════════════════════════════════════════════════════════════════
export default function UserDashboard() {
    const navigate = useNavigate();
    const [activeView, setActiveView] = useState("overview");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [dashboard, setDashboard] = useState(null);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeAlertCount, setActiveAlertCount] = useState(0);
    const userName = dashboard?.userName || "User";

    useEffect(() => {
        if (!localStorage.getItem("token")) { navigate("/login"); return; }
        (async () => {
            try {
                const [d, s, a] = await Promise.all([getMyDashboard(), getDashboardSummary(), getActiveAlerts()]);
                setDashboard(d); setSummary(s); setActiveAlertCount(a?.length ?? 0);
            } catch (_) { }
            setLoading(false);
        })();
    }, [navigate]);

    const handleLogout = () => { localStorage.removeItem("token"); navigate("/"); };

    const renderView = () => {
        switch (activeView) {
            case "overview": return <OverviewView summary={summary} dashboard={dashboard} loading={loading} />;
            case "zones": return <ZonesView />;
            case "sensors": return <SensorsView />;
            case "irrigation": return <IrrigationView />;
            case "alerts": return <AlertsView />;
            case "tanks": return <TanksView />;
            case "valves": return <ValvesView />;
            default: return null;
        }
    };

    // Sidebar component
    const Sidebar = ({ mobile = false }) => (
        <aside className={`${mobile ? "w-64" : "hidden md:flex w-64"} h-screen sticky top-0 bg-gradient-to-b from-emerald-700 via-emerald-800 to-green-900 text-white flex flex-col shadow-2xl`}>
            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
                <div className="bg-white/15 p-2.5 rounded-xl"><Leaf size={22} className="text-white" /></div>
                <span className="text-xl font-extrabold tracking-wide">FloraX</span>
            </div>

            {/* User info */}
            <div className="px-5 py-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center font-bold text-sm">
                        {userName[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{userName}</p>
                        <p className="text-xs text-emerald-300">{dashboard?.email || "—"}</p>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto sidebar-scroll">
                {NAV_ITEMS.map(({ id, icon: Icon, label }) => {
                    const isActive = activeView === id;
                    const showBadge = id === "alerts" && activeAlertCount > 0;
                    return (
                        <button key={id} onClick={() => { setActiveView(id); setSidebarOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${isActive ? "bg-white/20 text-white shadow-lg shadow-black/10" : "text-emerald-100 hover:bg-white/10 hover:text-white"}`}>
                            <Icon size={18} />
                            <span className="flex-1 text-left">{label}</span>
                            {showBadge && (
                                <span className="text-xs bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center font-bold">
                                    {activeAlertCount > 9 ? "9+" : activeAlertCount}
                                </span>
                            )}
                            {isActive && <ChevronRight size={14} className="shrink-0 opacity-60" />}
                        </button>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="px-3 py-4 border-t border-white/10">
                <button onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-300 hover:bg-red-500/20 hover:text-red-100 font-medium text-sm transition-all">
                    <LogOut size={18} /><span>Logout</span>
                </button>
            </div>
        </aside>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex">

            {/* Desktop Sidebar */}
            <motion.div className="hidden md:flex" initial={{ x: -80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
                <Sidebar />
            </motion.div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div className="fixed inset-0 bg-black/40 z-30 md:hidden"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setSidebarOpen(false)} />
                        <motion.div className="fixed left-0 top-0 h-full z-40 md:hidden flex"
                            initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: "spring", damping: 25 }}>
                            <Sidebar mobile />
                            <button className="absolute top-4 right-4 text-white/70 hover:text-white" onClick={() => setSidebarOpen(false)}>
                                <X size={20} />
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0">

                {/* Top Header */}
                <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white border-b border-gray-100 px-5 md:px-8 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
                    <div className="flex items-center gap-3">
                        {/* Mobile hamburger */}
                        <button className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors" onClick={() => setSidebarOpen(true)}>
                            <div className="space-y-1.5">
                                <span className="block w-5 h-0.5 bg-gray-600 rounded" />
                                <span className="block w-5 h-0.5 bg-gray-600 rounded" />
                                <span className="block w-5 h-0.5 bg-gray-600 rounded" />
                            </div>
                        </button>
                        <div>
                            <h1 className="text-base md:text-lg font-bold text-gray-800 capitalize">
                                {NAV_ITEMS.find(n => n.id === activeView)?.label || "Dashboard"}
                            </h1>
                            <p className="text-xs text-gray-400 hidden sm:block">
                                {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="relative p-2 rounded-xl hover:bg-emerald-50 transition-colors"
                            onClick={() => setActiveView("alerts")}>
                            <Bell size={20} className="text-gray-600" />
                            {activeAlertCount > 0 && (
                                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center">
                                    {activeAlertCount > 9 ? "9+" : activeAlertCount}
                                </span>
                            )}
                        </button>
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center text-white font-bold text-sm shadow-md">
                            {userName[0]?.toUpperCase()}
                        </div>
                    </div>
                </motion.header>

                {/* Page content */}
                <main className="flex-1 overflow-auto px-5 md:px-8 py-7">
                    <AnimatePresence mode="wait">
                        <motion.div key={activeView} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                            {renderView()}
                        </motion.div>
                    </AnimatePresence>
                </main>

                {/* Footer */}
                <footer className="px-8 py-3 text-xs text-gray-300 border-t border-gray-100 bg-white text-center">
                    FloraX Dashboard · {new Date().getFullYear()} · Live Data
                </footer>
            </div>
        </div>
    );
}
