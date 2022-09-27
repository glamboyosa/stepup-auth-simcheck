const fetch = require('node-fetch')
const { createAccessToken } = require('./createAccessToken')

exports.patchPhoneCheck = async (checkId, code) => {
  const accessToken = await createAccessToken()
  const body = JSON.stringify([{ op: "add", "path": "/code", value: code }])

  const phoneCheckResponse = await fetch(
    `https://eu.api.tru.id/phone_check/v0.2/checks/${checkId}`,
    {
      method: 'PATCH',
      body,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json-patch+json',
      },
    },
  )

  let patchResponse
  let patchResponseStatus = phoneCheckResponse.status;

  if (phoneCheckResponse.status === 200) {
    patchResponse = await phoneCheckResponse.json()
  } else if (phoneCheckResponse.status === 404) {
    patchResponse = JSON.stringify({ error: "Check not found" })
  } else {
    throw new Error(
      `Unexpected API response ${phoneCheckResponse.status}`,
      phoneCheckResponse.toString(),
    )
  }

  return { patchResponseStatus, patchResponse }
}
