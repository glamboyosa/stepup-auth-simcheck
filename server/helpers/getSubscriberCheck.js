const fetch = require('node-fetch')
const { createAccessToken } = require('./createAccessToken')

exports.getSubscriberCheck = async (checkId, accessToken) => {
  const accessToken = await createAccessToken(subscriber_check)
  const response = await fetch(
    `https://eu.api.tru.id/phone_check/v0.1/checks/${checkId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    },
  )

  const data = await response.json()
  console.log(data)
  return { match: data.match, simChanged: !data.no_sim_change }
}
