/**
 * userDashboardService.js
 *
 * Frontend API service for the FloraX User Dashboard.
 * Maps 1-to-1 with UserDashboardController endpoints.
 *
 * Base URL  : http://localhost:8081/florax/api
 * Auth      : JWT Bearer token auto-attached via axios interceptor
 * Prefix    : /dashboard
 *
 * Usage example:
 *   import { getMyDashboard, getActiveAlerts } from '../api/userDashboardService';
 *   const data = await getMyDashboard();
 */

import api from "./axios";

const BASE = "/dashboard";

// ══════════════════════════════════════════════════════════════════════════════
// UTILITY — centralised error extractor
// ══════════════════════════════════════════════════════════════════════════════
const extractError = (error) => {
    const msg =
        error?.response?.data?.message ||
        error?.response?.data ||
        error?.message ||
        "An unexpected error occurred";
    throw new Error(msg);
};

// ══════════════════════════════════════════════════════════════════════════════
// 1. FULL DASHBOARD
// ══════════════════════════════════════════════════════════════════════════════

/**
 * GET /dashboard/me
 * Returns the complete dashboard snapshot for the logged-in user.
 * Includes summary stats, all gardens, zones, sensors, alerts, and irrigation logs.
 *
 * @returns {Promise<UserDashboardResponse>}
 */
export const getMyDashboard = async () => {
    try {
        const res = await api.get(`${BASE}/me`);
        return res.data;
    } catch (error) {
        extractError(error);
    }
};

// ══════════════════════════════════════════════════════════════════════════════
// 2. SUMMARY STATISTICS
// ══════════════════════════════════════════════════════════════════════════════

/**
 * GET /dashboard/summary
 * Returns aggregated stats: total gardens, zones, sensors, valves,
 * water usage (today / week / month), alert counts by type, and tank levels.
 *
 * @returns {Promise<DashboardSummaryDTO>}
 */
export const getDashboardSummary = async () => {
    try {
        const res = await api.get(`${BASE}/summary`);
        return res.data;
    } catch (error) {
        extractError(error);
    }
};

// ══════════════════════════════════════════════════════════════════════════════
// 3. GARDEN OPERATIONS
// ══════════════════════════════════════════════════════════════════════════════

/**
 * GET /dashboard/gardens
 * Returns all gardens with their zones, recent alerts, and irrigation logs.
 *
 * @returns {Promise<GardenDTO[]>}
 */
export const getAllGardens = async () => {
    try {
        const res = await api.get(`${BASE}/gardens`);
        return res.data;
    } catch (error) {
        extractError(error);
    }
};

/**
 * GET /dashboard/gardens/{gardenId}
 * Returns a single garden by ID with full zone and alert detail.
 *
 * @param {number} gardenId
 * @returns {Promise<GardenDTO>}
 */
export const getGardenById = async (gardenId) => {
    try {
        const res = await api.get(`${BASE}/gardens/${gardenId}`);
        return res.data;
    } catch (error) {
        extractError(error);
    }
};

// ══════════════════════════════════════════════════════════════════════════════
// 4. ZONE OPERATIONS
// ══════════════════════════════════════════════════════════════════════════════

/**
 * GET /dashboard/zones
 * Returns all zones across all gardens with live moisture and irrigation status.
 *
 * @returns {Promise<ZoneDTO[]>}
 */
export const getAllZones = async () => {
    try {
        const res = await api.get(`${BASE}/zones`);
        return res.data;
    } catch (error) {
        extractError(error);
    }
};

/**
 * GET /dashboard/gardens/{gardenId}/zones
 * Returns all zones in a specific garden.
 *
 * @param {number} gardenId
 * @returns {Promise<ZoneDTO[]>}
 */
export const getZonesByGarden = async (gardenId) => {
    try {
        const res = await api.get(`${BASE}/gardens/${gardenId}/zones`);
        return res.data;
    } catch (error) {
        extractError(error);
    }
};

/**
 * GET /dashboard/zones/{zoneId}
 * Returns a single zone by ID with sensors, latest reading, and last irrigation.
 *
 * @param {number} zoneId
 * @returns {Promise<ZoneDTO>}
 */
export const getZoneById = async (zoneId) => {
    try {
        const res = await api.get(`${BASE}/zones/${zoneId}`);
        return res.data;
    } catch (error) {
        extractError(error);
    }
};

/**
 * GET /dashboard/zones/alert
 * Returns all zones currently below their moisture threshold (ALERT status).
 *
 * @returns {Promise<ZoneDTO[]>}
 */
export const getAlertZones = async () => {
    try {
        const res = await api.get(`${BASE}/zones/alert`);
        return res.data;
    } catch (error) {
        extractError(error);
    }
};

/**
 * GET /dashboard/zones/active
 * Returns all zones that are currently being irrigated (ACTIVE status).
 *
 * @returns {Promise<ZoneDTO[]>}
 */
export const getActiveIrrigationZones = async () => {
    try {
        const res = await api.get(`${BASE}/zones/active`);
        return res.data;
    } catch (error) {
        extractError(error);
    }
};

// ══════════════════════════════════════════════════════════════════════════════
// 5. SENSOR OPERATIONS
// ══════════════════════════════════════════════════════════════════════════════

/**
 * GET /dashboard/sensors
 * Returns all sensors across all zones with their latest reading.
 *
 * @returns {Promise<SensorDTO[]>}
 */
export const getAllSensors = async () => {
    try {
        const res = await api.get(`${BASE}/sensors`);
        return res.data;
    } catch (error) {
        extractError(error);
    }
};

/**
 * GET /dashboard/zones/{zoneId}/sensors
 * Returns all sensors for a specific zone with latest readings.
 *
 * @param {number} zoneId
 * @returns {Promise<SensorDTO[]>}
 */
export const getSensorsByZone = async (zoneId) => {
    try {
        const res = await api.get(`${BASE}/zones/${zoneId}/sensors`);
        return res.data;
    } catch (error) {
        extractError(error);
    }
};

/**
 * GET /dashboard/sensors/faulty
 * Returns all sensors with FAULTY or INACTIVE status.
 *
 * @returns {Promise<SensorDTO[]>}
 */
export const getFaultySensors = async () => {
    try {
        const res = await api.get(`${BASE}/sensors/faulty`);
        return res.data;
    } catch (error) {
        extractError(error);
    }
};

// ══════════════════════════════════════════════════════════════════════════════
// 6. IRRIGATION LOG OPERATIONS
// ══════════════════════════════════════════════════════════════════════════════

/**
 * GET /dashboard/irrigation/today
 * Returns all irrigation logs from today across all gardens.
 *
 * @returns {Promise<IrrigationLogDTO[]>}
 */
export const getTodayIrrigationLogs = async () => {
    try {
        const res = await api.get(`${BASE}/irrigation/today`);
        return res.data;
    } catch (error) {
        extractError(error);
    }
};

/**
 * GET /dashboard/irrigation/weekly
 * Returns irrigation logs from the past 7 days.
 *
 * @returns {Promise<IrrigationLogDTO[]>}
 */
export const getWeeklyIrrigationLogs = async () => {
    try {
        const res = await api.get(`${BASE}/irrigation/weekly`);
        return res.data;
    } catch (error) {
        extractError(error);
    }
};

/**
 * GET /dashboard/irrigation/monthly
 * Returns irrigation logs from the past 30 days.
 *
 * @returns {Promise<IrrigationLogDTO[]>}
 */
export const getMonthlyIrrigationLogs = async () => {
    try {
        const res = await api.get(`${BASE}/irrigation/monthly`);
        return res.data;
    } catch (error) {
        extractError(error);
    }
};

/**
 * GET /dashboard/irrigation/recent?limit=10
 * Returns the last N irrigation logs across all gardens.
 *
 * @param {number} [limit=10]
 * @returns {Promise<IrrigationLogDTO[]>}
 */
export const getRecentIrrigationLogs = async (limit = 10) => {
    try {
        const res = await api.get(`${BASE}/irrigation/recent`, { params: { limit } });
        return res.data;
    } catch (error) {
        extractError(error);
    }
};

/**
 * GET /dashboard/zones/{zoneId}/irrigation?limit=10
 * Returns irrigation logs for a specific zone.
 *
 * @param {number} zoneId
 * @param {number} [limit=10]
 * @returns {Promise<IrrigationLogDTO[]>}
 */
export const getIrrigationLogsByZone = async (zoneId, limit = 10) => {
    try {
        const res = await api.get(`${BASE}/zones/${zoneId}/irrigation`, { params: { limit } });
        return res.data;
    } catch (error) {
        extractError(error);
    }
};

/**
 * GET /dashboard/water-usage/today
 * Returns total water volume used today (litres).
 *
 * @returns {Promise<number>}
 */
export const getWaterUsageToday = async () => {
    try {
        const res = await api.get(`${BASE}/water-usage/today`);
        return res.data;
    } catch (error) {
        extractError(error);
    }
};

/**
 * GET /dashboard/water-usage/weekly
 * Returns total water volume used this week (litres).
 *
 * @returns {Promise<number>}
 */
export const getWaterUsageWeekly = async () => {
    try {
        const res = await api.get(`${BASE}/water-usage/weekly`);
        return res.data;
    } catch (error) {
        extractError(error);
    }
};

/**
 * GET /dashboard/water-usage/monthly
 * Returns total water volume used this month (litres).
 *
 * @returns {Promise<number>}
 */
export const getWaterUsageMonthly = async () => {
    try {
        const res = await api.get(`${BASE}/water-usage/monthly`);
        return res.data;
    } catch (error) {
        extractError(error);
    }
};

// ══════════════════════════════════════════════════════════════════════════════
// 7. ALERT OPERATIONS
// ══════════════════════════════════════════════════════════════════════════════

/**
 * GET /dashboard/alerts
 * Returns all ACTIVE alerts across all gardens.
 *
 * @returns {Promise<AlertDTO[]>}
 */
export const getActiveAlerts = async () => {
    try {
        const res = await api.get(`${BASE}/alerts`);
        return res.data;
    } catch (error) {
        extractError(error);
    }
};

/**
 * GET /dashboard/alerts/resolved-today
 * Returns alerts that were resolved today.
 *
 * @returns {Promise<AlertDTO[]>}
 */
export const getResolvedAlertsToday = async () => {
    try {
        const res = await api.get(`${BASE}/alerts/resolved-today`);
        return res.data;
    } catch (error) {
        extractError(error);
    }
};

/**
 * GET /dashboard/alerts/recent?limit=10
 * Returns the last N alerts (any status), sorted newest first.
 *
 * @param {number} [limit=10]
 * @returns {Promise<AlertDTO[]>}
 */
export const getRecentAlerts = async (limit = 10) => {
    try {
        const res = await api.get(`${BASE}/alerts/recent`, { params: { limit } });
        return res.data;
    } catch (error) {
        extractError(error);
    }
};

/**
 * GET /dashboard/gardens/{gardenId}/alerts
 * Returns alerts for a specific garden.
 *
 * @param {number} gardenId
 * @returns {Promise<AlertDTO[]>}
 */
export const getAlertsByGarden = async (gardenId) => {
    try {
        const res = await api.get(`${BASE}/gardens/${gardenId}/alerts`);
        return res.data;
    } catch (error) {
        extractError(error);
    }
};

/**
 * GET /dashboard/alerts/count-by-type
 * Returns alert counts grouped by type.
 * Example: { "LOW_WATER": 2, "DRY_SOIL": 1, "SENSOR_FAULT": 0 }
 *
 * @returns {Promise<Record<string, number>>}
 */
export const getAlertCountByType = async () => {
    try {
        const res = await api.get(`${BASE}/alerts/count-by-type`);
        return res.data;
    } catch (error) {
        extractError(error);
    }
};

/**
 * PUT /dashboard/alerts/{alertId}/resolve
 * Marks an alert as RESOLVED. Returns 204 No Content on success.
 *
 * @param {number} alertId
 * @returns {Promise<void>}
 */
export const resolveAlert = async (alertId) => {
    try {
        await api.put(`${BASE}/alerts/${alertId}/resolve`);
    } catch (error) {
        extractError(error);
    }
};

// ══════════════════════════════════════════════════════════════════════════════
// 8. WATER TANK OPERATIONS
// ══════════════════════════════════════════════════════════════════════════════

/**
 * GET /dashboard/tanks
 * Returns all water tanks with current fill level and percentage.
 *
 * @returns {Promise<WaterTankDTO[]>}
 */
export const getAllWaterTanks = async () => {
    try {
        const res = await api.get(`${BASE}/tanks`);
        return res.data;
    } catch (error) {
        extractError(error);
    }
};

/**
 * GET /dashboard/gardens/{gardenId}/tanks
 * Returns water tanks for a specific garden.
 *
 * @param {number} gardenId
 * @returns {Promise<WaterTankDTO[]>}
 */
export const getWaterTanksByGarden = async (gardenId) => {
    try {
        const res = await api.get(`${BASE}/gardens/${gardenId}/tanks`);
        return res.data;
    } catch (error) {
        extractError(error);
    }
};

/**
 * GET /dashboard/tanks/low
 * Returns tanks with LOW or EMPTY status — needs refilling.
 *
 * @returns {Promise<WaterTankDTO[]>}
 */
export const getLowWaterTanks = async () => {
    try {
        const res = await api.get(`${BASE}/tanks/low`);
        return res.data;
    } catch (error) {
        extractError(error);
    }
};

// ══════════════════════════════════════════════════════════════════════════════
// 9. VALVE OPERATIONS
// ══════════════════════════════════════════════════════════════════════════════

/**
 * GET /dashboard/valves
 * Returns all valves with their current status and last activation time.
 *
 * @returns {Promise<ValveDTO[]>}
 */
export const getAllValves = async () => {
    try {
        const res = await api.get(`${BASE}/valves`);
        return res.data;
    } catch (error) {
        extractError(error);
    }
};

/**
 * GET /dashboard/zones/{zoneId}/valves
 * Returns valves for a specific zone.
 *
 * @param {number} zoneId
 * @returns {Promise<ValveDTO[]>}
 */
export const getValvesByZone = async (zoneId) => {
    try {
        const res = await api.get(`${BASE}/zones/${zoneId}/valves`);
        return res.data;
    } catch (error) {
        extractError(error);
    }
};

/**
 * GET /dashboard/valves/open
 * Returns all valves that are currently OPEN (actively irrigating).
 *
 * @returns {Promise<ValveDTO[]>}
 */
export const getOpenValves = async () => {
    try {
        const res = await api.get(`${BASE}/valves/open`);
        return res.data;
    } catch (error) {
        extractError(error);
    }
};
