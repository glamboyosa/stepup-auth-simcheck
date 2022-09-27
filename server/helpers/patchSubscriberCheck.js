const fetch = require('node-fetch')
const { createAccessToken } = require('./createAccessToken')

exports.patchSubscriberCheck = async (checkId, code) => {
  const accessToken = await createAccessToken()
  const body = JSON.stringify([{ op: "add", "path": "/code", value: code }])

  const subscriberCheckResponse = await fetch(
    `https://eu.api.tru.id/subscriber_check/v0.2/checks/${checkId}`,
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

  if (subscriberCheckResponse.status === 200) {
    return {
      match: data.match, 
      simChanged: !data.no_sim_change
    }
  } else if (subscriberCheckResponse.status === 404) {
    return JSON.stringify({ error: "Check not found" })
  } else {
    throw new Error(
      `Unexpected API response ${subscriberCheckResponse.status}`,
      subscriberCheckResponse.toString(),
    )
  }
}