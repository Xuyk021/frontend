import axios from "axios"

import { MOCK_BY_YEAR, MOCK_BY_FIELD, MOCK_UNSUPPORTED } from "../mock/mock_chat_responses"

const USE_MOCK = false

const API = "http://127.0.0.1:5000/api"

function pickMock(message) {
  const m = message.toLowerCase()

  if (m.includes("by year") || (m.includes("number") && m.includes("year"))) return MOCK_BY_YEAR
  if (m.includes("by field") || m.includes("field")) return MOCK_BY_FIELD
  return MOCK_UNSUPPORTED
}


export const fetchCitationNetwork = async () => {
  const res = await axios.get(
    `${API}/citation-network?university=PSU`
  )
  return res.data
}

export const fetchAuthorNetwork = async () => {
  const res = await axios.get(
    `${API}/author-network?university=PSU`
  )
  return res.data
}
export const fetchTimeline = async () => {
  const res = await axios.get(
    `${API}/timeline?university=PSU`
  )
  return res.data
}

export const fetchPatentHistogram = async (year=null) => {
  const res = await axios.get(
    `${API}/patent-histogram`,
    {
      params: { year }
    }
  )
  return res.data
}
export async function chat(message) {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 250))
    return pickMock(message)
  }
  const res = await axios.post(`${API}/chat`, { message })
  return res.data
}