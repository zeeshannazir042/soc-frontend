import API from "./api";

export const attachAlertsToIncident = (incidentId, alertIds) => {
  return API.post(`/incidents/${incidentId}/alerts`, {
    alertIds,
  });
};