import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export const postGuest = (payload: any) =>
  axios.post(`${API_BASE}/auth/guest`, payload);

export const submitTest = (payload: any) =>
  axios.post(`${API_BASE}/test/submit`, payload);

export const getResult = (id: string) =>
  axios.get(`${API_BASE}/test/result/${id}`);

export const mergeReport = (snapshot: any) =>
  axios.post(`${API_BASE}/test/mergeReport`, { snapshot });

export const postChat = (payload: any) =>
  axios.post(`${API_BASE}/chat`, payload);

export const submitFeedback = (payload: { userId: string; resultId: string; rating: number; comment?: string }) =>
  axios.post(`${API_BASE}/test/feedback`, payload);

